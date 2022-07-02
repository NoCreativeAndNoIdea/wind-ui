import { isArray, isObject } from '@vue/shared'

export {
  isArray,
  isFunction,
  isObject,
  isString,
  isDate,
  isPromise,
  isSymbol,
} from '@vue/shared'
export { isVNode } from 'vue'

export const judgeType = <T>(val: unknown, type: string): val is T =>
  Object.prototype.toString.call(val).match(/([A-Z])\w+/g)?.[0] === type

export const isNumber = (val: unknown): val is number =>
  judgeType<number>(val, 'Number')

export const isBoolean = (val: unknown): val is boolean =>
  judgeType<boolean>(val, 'Boolean')

export const isUndefined = (val: any): val is undefined => val === undefined

export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length)

export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false
  return e instanceof Element
}

export const isPropAbsent = (prop: unknown): prop is null | undefined =>
  prop === null

export const isKorean = (text: string) =>
  /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi.test(text)
