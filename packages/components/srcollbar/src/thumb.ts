import { buildProps } from '@wind-ui/utils'
import type { ExtractPropTypes } from 'vue'
import type Thumb from './thumb.vue'

export const thumpProps = buildProps({
  vertical: Boolean,
  size: String,
  move: Number,
  ratio: {
    type: Number,
    required: true,
  },
  always: Boolean,
} as const)

export type ThumbProps = ExtractPropTypes<typeof thumpProps>

export type ThumbInstance = InstanceType<typeof Thumb>
