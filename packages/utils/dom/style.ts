import { isString, isNumber } from '@wind-ui/utils'

import { debugWarn } from '../error'

const SCOPE = 'utils/dom/style'

export function addUnit(
  value?: string | number,
  defaultUnit = 'px'
): string | undefined {
  if (!value) return ''
  if (isString(value)) {
    return value
  } else if (isNumber(value)) {
    return `${value}${defaultUnit}`
  }

  debugWarn(SCOPE, 'binding value must be a string or number')
  return undefined
}
