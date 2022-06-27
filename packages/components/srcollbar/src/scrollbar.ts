import { buildProps, definePropType, isNumber } from '@wind-ui/utils'
import type { ExtractPropTypes, StyleValue } from 'vue'
import type Scrollbar from './scrollbar.vue'

export const scrollbarProps = buildProps({
  height: {
    type: [String, Number],
    default: '',
  },
  maxHeight: {
    type: [String, Number],
    default: '',
  },
  native: Boolean,
  wrapString: {
    type: definePropType<StyleValue>([String, Object, Array]),
    default: '',
  },
  wrapClass: {
    type: [String, Array],
    default: '',
  },
  viewClass: {
    type: [String, Array],
    default: '',
  },
  viewStyle: {
    type: [String, Array, Object],
    default: '',
  },
  noresize: Boolean,
  tag: {
    type: String,
    default: 'div',
  },
  always: Boolean,
  minSize: {
    type: Number,
    default: 20,
  },
} as const)

export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>

export const scrollbarEmits = {
  'on-scroll': ({
    scrollTop,
    scrollLeft,
  }: {
    scrollTop: number
    scrollLeft: number
  }) => isNumber(scrollTop) && isNumber(scrollLeft),
}

export type ScrollbarEmits = typeof scrollbarEmits

export type ScrollbariNSTANCE = InstanceType<typeof Scrollbar>
