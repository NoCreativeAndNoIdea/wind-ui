<script setup lang="ts">
import { useNamespace, useSize } from '@wind-ui/hooks'
import { formContextKey } from '@wind-ui/tokens'
import type {
  FormItemContext,
  FormContext,
  FormValidateCallback,
  FormValidationResult,
} from '@wind-ui/tokens'
import { debugWarn, isFunction } from '@wind-ui/utils'
import type { ValidateFieldsError } from 'async-validator'
import type { Arrayable } from 'vitest'
import { computed, provide, reactive, toRefs, watch } from 'vue'
import { formProps, formEmits } from './type/form'
import type { FormItemProp } from './type/form-item'
import { filterFields, useFormLabelWidth } from './utils'

const COMPONENT_NAME = 'DForm'

defineOptions({
  name: 'DForm',
})

const props = defineProps(formProps)
const emit = defineEmits(formEmits)

const fields: FormItemContext[] = []
const formSize = useSize()

const ns = useNamespace('form')
const formClasses = computed(() => {
  const { labelPosition, inline } = props

  return [
    ns.b(),
    ns.m(formSize.value || 'default'),
    {
      [ns.m(`label-${labelPosition}`)]: labelPosition,
      [ns.m('inline')]: inline,
    },
  ]
})

const addField: FormContext['addField'] = (field) => {
  fields.push(field)
}

const removeField: FormContext['removeField'] = (field) => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1)
  }
}

const resetFields: FormContext['resetFields'] = (properties = []) => {
  if (!props.model) {
    debugWarn(COMPONENT_NAME, 'model is required for reset Fields to work!')
  }
  filterFields(fields, properties).forEach((field) => field.resetField())
}

const clearValidate: FormContext['clearValidate'] = (props = []) => {
  filterFields(fields, props).forEach((field) => field.clearValidate())
}

const isValidate = computed(() => {
  const hasModel = !!props.model
  if (!hasModel) {
    debugWarn(COMPONENT_NAME, 'model is required for validate to work.')
  }
  return hasModel
})

const obtainValidateFields = (props: Arrayable<FormItemProp>) => {
  if (fields.length === 0) return []

  const filteredFields = filterFields(fields, props)

  if (!filterFields.length) {
    debugWarn(COMPONENT_NAME, 'please pass correct props!')
    return []
  }

  return filteredFields
}

const doValidateField = async (
  props: Arrayable<FormItemProp>
): Promise<boolean> => {
  if (!isValidate.value) return false

  const fields = obtainValidateFields(props)
  if (fields.length === 0) return true

  let validationErrors: ValidateFieldsError = {}
  for (const field of fields) {
    try {
      await field.validate('')
    } catch (fields) {
      validationErrors = {
        ...validationErrors,
        ...(fields as ValidateFieldsError),
      }
    }
  }

  if (Object.keys(validationErrors).length === 0) return true
  return Promise.reject(validationErrors)
}

const scrollToField = (prop: FormItemProp) => {
  const field = filterFields(fields, prop)?.[0]
  if (field) {
    field.$el?.scrollIntoView()
  }
}

const validateField: FormContext['validateFiled'] = async (
  modelProps = [],
  callback
) => {
  const shouldThrow = !isFunction(callback)
  try {
    const result = await doValidateField(modelProps)
    if (result === true) {
      callback?.(result)
    }

    return result
  } catch (e) {
    const invalidFields = e as ValidateFieldsError
    if (props.scrollToError) {
      scrollToField(Object.keys(invalidFields)[0])
    }

    callback?.(false, invalidFields)

    return shouldThrow && Promise.reject(invalidFields)
  }
}

const validate = async (
  callback?: FormValidateCallback
): FormValidationResult => validateField(undefined, callback)

watch(
  () => props.rules,
  () => {
    if (props.validateOnRuleChange) {
      validate().catch((err) => debugWarn(err))
    }
  },
  {
    deep: true,
  }
)

provide(
  formContextKey,
  reactive({
    ...toRefs(props),
    emit,
    resetFields,
    clearValidate,
    addField,
    removeField,
    ...useFormLabelWidth(),
  })
)

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
})
</script>

<template>
  <form :class="formClasses">
    <slot />
  </form>
</template>
