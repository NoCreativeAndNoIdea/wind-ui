import { componentSizes } from '@wind-ui/constants'
import type { FormRules } from '@wind-ui/tokens'
import {
  buildProps,
  definePropType,
  isArray,
  isString,
  isBoolean,
} from '@wind-ui/utils'
import type { ExtractPropTypes } from 'vue'
import type Form from '../form.vue'
import type { FormItemProp } from './form-item'

export const formProps = buildProps({
  model: Object,
  rules: {
    type: definePropType<FormRules>(Object),
  },
  labelPosition: {
    type: String,
    values: ['left', 'right', 'top'] as const,
    default: 'right',
  },
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  labelSuffix: {
    type: String,
    default: '',
  },
  inline: Boolean,
  inlineMessage: Boolean,
  statusMessage: Boolean,
  statusIcon: Boolean,
  showMessage: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    values: componentSizes,
  },
  disabled: Boolean,
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  hideRequiredAsterisk: {
    type: Boolean,
    default: false,
  },
  scrollToError: Boolean,
} as const)

export type FormProps = ExtractPropTypes<typeof formProps>

export const formEmits = {
  validate: (prop: FormItemProp, isValid: boolean, message: string) =>
    (isArray(prop) || isString(prop)) &&
    isBoolean(isValid) &&
    isString(message),
}

export type FormEmits = typeof formEmits

export type FormInstance = InstanceType<typeof Form>
