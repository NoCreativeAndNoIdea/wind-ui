import type { ButtonProps } from '@wind-ui/components/button/src/button'
import type { InjectionKey } from 'vue'

export interface ButtonGroupContext {
  size?: ButtonProps['size']
  type?: ButtonProps['type']
}

export const buttonGroupContextKey: InjectionKey<ButtonGroupContext> = Symbol(
  'buttonGroupContextKey'
)
