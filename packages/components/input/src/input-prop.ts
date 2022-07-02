import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from '@wind-ui/constants'
import { useSizeProp } from '@wind-ui/hooks'
import {
  buildProps,
  definePropType,
  iconPropType,
  isString,
  mutable,
} from '@wind-ui/utils'
import type { ExtractPropTypes, StyleValue } from 'vue'
import type Input from './input.vue'

export type InputAutoSize = { minRows?: number; maxRows?: number } | boolean

export const inputProps = buildProps({
  id: {
    type: String,
    default: undefined,
  },
  size: useSizeProp,
  disabled: Boolean,
  modelValue: {
    type: definePropType<string | number | null | undefined>([
      String,
      Number,
      Object,
    ]),
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  resize: {
    type: String,
    values: ['node', 'both', 'horizontal', 'vertical'],
  },
  autosize: {
    type: definePropType<InputAutoSize>([Boolean, Object]),
    default: false,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  formatter: {
    type: Function,
  },
  parser: {
    type: Function,
  },
  placeholder: {
    type: String,
  },
  form: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  suffixIcon: {
    type: iconPropType,
    default: '',
  },
  prefixIcon: {
    type: iconPropType,
    default: '',
  },
  containerRole: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  tabindex: {
    type: [String, Number],
    default: 0,
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
  inputStyle: {
    type: definePropType<StyleValue>([Object, Array, String]),
    default: () => mutable({} as const),
  },
} as const)

export type InputProps = ExtractPropTypes<typeof inputProps>

export const inputEmits = {
  [UPDATE_MODEL_EVENT]: (value: string) => isString(value),
  [INPUT_EVENT]: (value: string) => isString(value),
  [CHANGE_EVENT]: (value: string) => isString(value),
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  clear: () => true,
  mouseleave: (evt: MouseEvent) => evt instanceof MouseEvent,
  mouseenter: (evt: MouseEvent) => evt instanceof MouseEvent,
  keydown: (evt: KeyboardEvent) => evt instanceof KeyboardEvent,
  compositionstart: (evt: CompositionEvent) => evt instanceof CompositionEvent,
  compositionupdate: (evt: CompositionEvent) => evt instanceof CompositionEvent,
  compositionend: (evt: CompositionEvent) => evt instanceof CompositionEvent,
}

export type InputEmits = typeof inputEmits
export type InputInstance = InstanceType<typeof Input>
