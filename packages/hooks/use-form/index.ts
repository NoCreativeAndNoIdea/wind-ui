import type {
  FormItemProps,
  FormItemValidateState,
} from '@wind-ui/components/form'
import type { FormValidateFailure } from '@wind-ui/tokens/index'
import type { FormItemRule } from '@wind-ui/tokens/index'
import { hasOwn, isArray } from '@wind-ui/utils'
import type { Arrayable, MaybeRef } from '@wind-ui/utils'
import AsyncValidate from 'async-validator'
import { cloneDeep, omit } from 'lodash-unified'
import { nextTick, reactive, shallowRef, unref, watch } from 'vue'

type Props = Record<string, any>

type ModelRef = Record<string, unknown>

export type RuleRef = Record<string, Arrayable<FormItemRule>>

interface ValidateInfo extends Partial<FormItemProps> {
  error?: string
  rules?: Arrayable<FormItemRule>
  required?: boolean
  validateValue?: Props
  validateStatus?: FormItemValidateState
}

type ValidateInfos = Record<string, ValidateInfo>

// Filter Rules
const filterItemRule = (
  rulesRef: MaybeRef<RuleRef>,
  key: string
): RuleRef['value'] => {
  const ruleItem = cloneDeep(unref(rulesRef)[key])

  if (!ruleItem) return []
  if (isArray(ruleItem)) {
    return ruleItem.filter((rule) =>
      isArray(rule.trigger) ? rule.trigger.length : rule.trigger
    )
  } else {
    return ruleItem.trigger ? [ruleItem] : []
  }
}

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
  const resetFields = async (newValues: Props) => {
    Object.assign(unref(modelRef), {
      ...cloneDeep(initialModel),
      ...newValues,
    })
    await nextTick(() => {
      Object.keys(validateInfos).forEach((key) => {
        validateInfos[key] = {
          prop: key,
          required: isRequired(unref(rulesRef)[key]),
          rules: filterItemRule(rulesRef, key),
          validateValue: modelRef,
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

  const validateField = async (key: string) => {
    if (!unref(rulesKeys).includes(key)) return Promise.resolve(true)
    const ruleItem = unref(rulesRef)[key]
    const validator = new AsyncValidate({
      [key]: omit(ruleItem, 'trigger'),
    })

    return validator!
      .validate({ [key]: unref(modelRef)[key] }, { firstFields: true })
      .then(() => {
        onValidationSuccess(key)
        return Promise.resolve(true)
      })
      .catch((error: FormValidateFailure) => {
        onValidationFailed(error)
        return Promise.reject(error)
      })
  }
  const validate = async () => {
    let result = true
    for (const ruleKey of unref(rulesKeys)) {
      // eslint-disable-next-line no-loop-func
      validateField(ruleKey).catch((_): void => {
        result = false
      })
    }
    return result
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
        rules: filterItemRule(rulesRef, key),
        validateValue: modelRef,
        required: isRequired(unref(rulesRef)[key]),
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
