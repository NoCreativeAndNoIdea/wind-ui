import type { FormItemValidateState } from '@wind-ui/components/form'
import type { FormValidateFailure } from '@wind-ui/tokens/index'
import type { FormItemRule } from '@wind-ui/tokens/index'
import { hasOwn, isArray } from '@wind-ui/utils'
import type { Arrayable, MaybeRef } from '@wind-ui/utils'
import AsyncValidate from 'async-validator'
import { cloneDeep } from 'lodash-unified'
import { nextTick, reactive, shallowRef, unref, watch } from 'vue'

type Props = Record<string, any>

type ModelRef = Record<string, unknown>

export type RuleRef = Record<string, Arrayable<FormItemRule>>

interface ValidateInfo {
  error?: string
  required?: boolean
  validateValue?: Props
  validateStatus?: FormItemValidateState
}

type ValidateInfos = Record<string, ValidateInfo>

function isRequired(rules: Arrayable<FormItemRule>) {
  let isRequired = false
  if (isArray(rules) && rules.length) {
    rules.every((rule) => {
      if (rule.required) {
        isRequired = true
        return false
      }
      return true
    })
  } else if (rules && !isArray(rules)) {
    return !!rules.required
  }
  return isRequired
}

export const useForm = (
  modelRef: MaybeRef<ModelRef>,
  rulesRef: MaybeRef<RuleRef>
) => {
  const initialModel = cloneDeep(unref(modelRef))
  const validateInfos = reactive<ValidateInfos>({})

  const rulesKeys = shallowRef<string[]>([])

  // Clear
  const resetFields = (newValues: Props) => {
    Object.assign(unref(modelRef), {
      ...cloneDeep(initialModel),
      ...newValues,
    })
    nextTick(() => {
      Object.keys(validateInfos).forEach((key) => {
        validateInfos[key] = {
          required: isRequired(unref(rulesRef)[key]),
        }
      })
    })
  }

  const clearValidate = (names?: string | string[]) => {
    let keys = []
    if (!names) {
      keys = rulesKeys.value
    } else if (isArray(names)) {
      keys = names
    } else {
      keys = [names]
    }
    keys.forEach((key) => {
      validateInfos[key] &&
        Object.assign(validateInfos[key], {
          validateStatus: '',
        })
    })
  }

  // Validate
  const onValidationSuccess = (key: string) => {
    validateInfos[key] = {
      ...cloneDeep(validateInfos[key]),
      validateStatus: '',
    }
  }
  const onValidationFailed = (error: FormValidateFailure) => {
    const { fields, errors } = error

    if (!errors || !fields) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    const errorInfo = errors?.[0] ?? {}

    validateInfos[errorInfo.field as string] = {
      ...validateInfos[errorInfo.field as string],
      validateStatus: 'error',
      error: errorInfo.message ?? `${errorInfo.field} is required`,
    }
  }

  const validateField = (key: string) => {
    if (!unref(rulesKeys).includes(key)) return Promise.resolve(true)
    const ruleItem = unref(rulesRef)[key]
    const validator = new AsyncValidate({
      [key]: ruleItem,
    })
    return validator
      .validate({ [key]: unref(modelRef)[key] }, { firstFields: true })
      .then(() => {
        onValidationSuccess(key)
        return true as const
      })
      .catch((error: FormValidateFailure) => {
        onValidationFailed(error)
        return Promise.reject(error)
      })
  }

  const validate = async () => {
    const bool = await Promise.all(
      unref(rulesKeys).map((key) => validateField(key))
    )
    return bool.some((val) => val)
  }

  // Watch
  const watchRulesKeys = () => {
    rulesKeys.value = rulesRef ? Object.keys(unref(rulesRef)) : []
  }
  const watchValidateInfos = () => {
    const newValidateInfos: ValidateInfos = {}
    rulesKeys.value.forEach((key) => {
      newValidateInfos[key] = Object.assign({}, validateInfos[key], {
        prop: key,
        rules: unref(rulesRef)[key],
        required: isRequired(unref(rulesRef)[key]),
        validateValue: modelRef,
      })
      delete validateInfos[key]
    })

    for (const key in validateInfos) {
      if (hasOwn(validateInfos, key)) {
        delete validateInfos[key]
      }
    }

    Object.assign(validateInfos, newValidateInfos)
  }

  watch(rulesRef, watchRulesKeys, { deep: true, immediate: true })

  watch(rulesKeys, watchValidateInfos, { immediate: true })

  return {
    modelRef,
    rulesRef,
    initialModel,
    validateInfos,
    resetFields,
    clearValidate,
    validateField,
    validate,
  }
}
