import type { PropType } from 'vue'
import { warn } from 'vue'
import type {
  IfNativePropType,
  IfWindProp,
  NativePropType,
  WindProp,
  WindPropConvert,
  WindPropFinalized,
  WindPropInput,
  WindPropMergeType,
} from './types'
import { isObject } from '../../types'
import { hasOwn } from '@vue/shared'
import { fromPairs } from '@wind-ui/utils'

export const windPropKey = '__windPropKey'

export const definePropType = <T>(val: any): PropType<T> => val

export const isWindProp = (val: unknown): val is WindProp<any, any, any> =>
  isObject(val) && !!(val as any)[windPropKey]

export const buildProp = <
  Type = never,
  Value = never,
  Validator = never,
  Default extends WindPropMergeType<Type, Value, Validator> = never,
  Required extends boolean = false
>(
  prop: WindPropInput<Type, Value, Validator, Default, Required>,
  key?: string
): WindPropFinalized<Type, Value, Validator, Default, Required> => {
  if (!isObject(prop) || isWindProp(prop)) return prop as any

  const { values, required, default: defaultValue, type, validator } = prop

  const _validator =
    values || validator
      ? (val: unknown) => {
          let valid = false
          let allowedValues: unknown[] = []

          if (values) {
            allowedValues = Array.from(values)
            if (hasOwn(prop, 'default')) {
              allowedValues.push(defaultValue)
            }
            valid ||= allowedValues.includes(val)
          }

          if (validator) valid ||= validator(val)

          if (!valid && allowedValues.length > 0) {
            const allowValuesText = [...new Set(allowedValues)]
              .map((val) => JSON.stringify(val))
              .join(', ')
            warn(
              `Invalid prop: validation failed${
                key ? ` for prop "${key}"` : ''
              }. Expected one of [${allowValuesText}], got value ${JSON.stringify(
                val
              )}.`
            )
          }

          return valid
        }
      : undefined

  const windProp: any = {
    type,
    required: !!required,
    validator: _validator,
    [windPropKey]: true,
  }

  if (hasOwn(prop, 'default')) windProp.default = defaultValue
  return windProp
}

export const buildProps = <
  Props extends Record<
    string,
    | { [windPropKey]: true }
    | NativePropType
    | WindPropInput<any, any, any, any, any>
  >
>(
  props: Props
): {
  [K in keyof Props]: IfWindProp<
    Props[K],
    Props[K],
    IfNativePropType<Props[K], Props[K], WindPropConvert<Props[K]>>
  >
} =>
  fromPairs(
    Object.entries(props).map(([key, option]) => [
      key,
      buildProp(option as any, key),
    ])
  ) as any
