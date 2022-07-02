import { isArray } from '../'

type Many<T> = T | ReadonlyArray<T>
export const ensureArray = <T>(arr: Many<T>): T[] => {
  if (!arr && (arr as any) !== 0) return []
  return isArray(arr) ? arr : [arr]
}
