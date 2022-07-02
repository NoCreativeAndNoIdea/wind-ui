import { componentSizes } from '@wind-ui/constants'
import type { FormItemRule } from '@wind-ui/tokens'
import type { Arrayable } from '@wind-ui/utils'
import { definePropType, buildProps } from '@wind-ui/utils'
import type { ExtractPropTypes } from 'vue'

export const formItemValidateStates = [
  '',
  'error',
  'validating',
  'success',
] as const
export type FormItemValidateState = typeof formItemValidateStates[number]

export type FormItemProp = Arrayable<string>

export const formItemProps = buildProps({
  label: String,
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  prop: {
    type: definePropType<FormItemProp>([String, Array]),
  },
  required: {
    type: Boolean,
    default: undefined,
  },
  rules: {
    type: definePropType<Arrayable<FormItemRule>>([Object, Array]),
  },
  error: String,
  validateStatus: {
    type: String,
    values: formItemValidateStates,
  },
  for: String,
  inlineMessage: {
    type: [String, Boolean],
    default: '',
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    values: componentSizes,
  },
} as const)

export type FormItemProps = ExtractPropTypes<typeof formItemProps>
