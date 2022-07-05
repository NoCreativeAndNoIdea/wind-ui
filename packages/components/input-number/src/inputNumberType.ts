import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from '@wind-ui/constants'
import { useSizeProp } from '@wind-ui/hooks'
import { buildProps, isNumber } from '@wind-ui/utils'
import { isNil } from 'lodash-unified'
import type { ExtractPropTypes } from 'vue'
import type InputNumber from './input-number.vue'

export const inputNumberProp = buildProps({
  id: {
    type: String,
    default: undefined,
  },
  modelValue: Number,
  min: {
    type: Number,
    default: Number.NEGATIVE_INFINITY,
  },
  max: {
    type: Number,
    default: Number.POSITIVE_INFINITY,
  },
  step: {
    type: Number,
    default: 1,
  },
  stepStrictly: Boolean,
  size: useSizeProp,
  disabled: Boolean,
  controls: {
    type: Boolean,
    default: true,
  },
  controlsPosition: {
    type: String,
    values: ['right', ''],
    default: '',
  },
  valueOnClear: {
    type: [String, Number, null],
    default: null,
    validator: (val: 'min' | 'max' | number | null) =>
      val === null || isNumber(val) || ['min', 'max'].includes(val),
  },
  precision: {
    type: Number,
    validator: (val: number) =>
      val >= 0 && val === Number.parseInt(`${val}`, 10),
  },
  name: String,
  label: String,
  placeholder: String,
} as const)

export type InputNumberType = ExtractPropTypes<typeof inputNumberProp>

export const inputNumberEmits = {
  [UPDATE_MODEL_EVENT]: (value: number) => isNumber(value) || isNil(value),
  [INPUT_EVENT]: (value: number) => isNumber(value) || isNil(value),
  [CHANGE_EVENT]: (prev: number | undefined, cur: number | undefined) =>
    prev !== cur,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
}

export type InputNumberEmits = typeof inputNumberEmits

export type InputNumberInstance = InstanceType<InputNumber>

export interface InputNumberData {
  currentValue: number | null | undefined
  userInput: null | number | string
}
