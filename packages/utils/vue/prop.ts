import type { PropType } from 'vue'

export const _definePropType = <T>(val: any): PropType<T> => val

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function makeProp<T>(type: any): Record<string, any>
export function makeProp<T>(type: any, defaultVal: T): Record<string, any>
export function makeProp<T>(
  type: any,
  defaultVal: T,
  required: boolean
): Record<string, any>
export function makeProp<T>(
  type: any,
  defaultVal?: T,
  required?: boolean,
  validator?: never
): Record<string, any> {
  const prop: Record<string, any> = {
    type: _definePropType<T>(type),
  }

  prop['required'] = !!required

  if (defaultVal) {
    prop['default'] = defaultVal
  }

  if (validator) {
    prop['validator'] = validator
  }

  return prop
}
