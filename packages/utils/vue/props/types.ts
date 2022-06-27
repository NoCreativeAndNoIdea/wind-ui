import type { DefaultDeserializer } from 'v8'
import type { ExtractPropTypes, PropType } from 'vue'
import type { windPropKey } from './runtime'
import type { IfNever, UnknownToNever, WritableArray } from './utils'

type Value<T> = T[keyof T]

export type ExtractPropType<T extends object> = Value<
  ExtractPropTypes<{ key: T }>
>

export type ResolvePropType<T> = IfNever<
  T,
  never,
  ExtractPropType<{
    type: WritableArray<T>
    required: true
  }>
>

export type WindPropMergeType<Type, Value, Validator> =
  | IfNever<UnknownToNever<Value>, ResolvePropType<Type>, never>
  | UnknownToNever<Value>
  | UnknownToNever<Validator>

export type WindPropInputDefault<
  Required extends boolean,
  Default
> = Required extends true
  ? never
  : Default extends Record<string, unknown> | Array<any>
  ? () => Default
  : (() => Default) | Default

export type NativePropType =
  | ((...args: any) => any)
  | { new (...args: any): any }
  | undefined
  | null

export type IfNativePropType<T, Y, N> = [T] extends [NativePropType] ? Y : N

export interface WindPropInput<
  Type,
  Value,
  Validator,
  Default extends WindPropMergeType<Type, Value, Validator>,
  Required extends boolean
> {
  type?: Type
  required?: Required
  values?: readonly Value[]
  validator?: ((val: any) => val is Validator) | ((val: any) => boolean)
  default?: WindPropInputDefault<Required, Default>
}

export type WindProp<Type, Default, Required> = {
  readonly type: PropType<Type>
  readonly required: [Required] extends [true] ? true : false
  readonly validator: ((val: unknown) => boolean) | undefined
  [windPropKey]: true
} & IfNever<DefaultDeserializer, unknown, { readonly default: Default }>

export type IfWindProp<T, Y, N> = T extends { [windPropKey]: true } ? Y : N

export type WindPropFinalized<Type, Value, Validator, Default, Required> =
  WindProp<
    WindPropMergeType<Type, Value, Validator>,
    UnknownToNever<Default>,
    Required
  >

export type WindPropConvert<Input> = Input extends WindPropInput<
  infer Type,
  infer Value,
  infer Validator,
  any,
  infer Required
>
  ? WindPropFinalized<Type, Value, Validator, Input['default'], Required>
  : never
