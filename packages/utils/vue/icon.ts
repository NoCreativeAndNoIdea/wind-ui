import { CircleCheck, CircleClose, Loading } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { definePropType } from './props'

export const iconPropType = definePropType<string | Component>([
  String,
  Object,
  Function,
])

export const ValidateComponentsMap: Record<string, Component> = {
  validating: Loading,
  success: CircleCheck,
  error: CircleClose,
}
