import { buildProps, definePropType, mutable } from '@wind-ui/utils'
import type { ExtractPropTypes } from 'vue'
import type Col from './col.vue'
export interface ColSizeObject {
  span?: number
  offset?: number
  pull?: number
  push?: number
}

export type ColSize = number | ColSizeObject

const sizeProp = {
  type: definePropType<ColSize>([Number, Object]),
  default: () => mutable({} as const),
}

export const colProps = buildProps({
  tag: {
    type: String,
    default: 'div',
  },
  span: {
    type: Number,
    default: 24,
  },
  offset: {
    type: Number,
    default: 0,
  },
  pull: {
    type: Number,
    default: 0,
  },
  push: {
    type: Number,
    default: 0,
  },
  xs: sizeProp,
  sm: sizeProp,
  md: sizeProp,
  lg: sizeProp,
  xl: sizeProp,
} as const)

export type ColProps = ExtractPropTypes<typeof colProps>
export type ColInstance = InstanceType<typeof Col>
