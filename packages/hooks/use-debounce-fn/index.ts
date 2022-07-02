import type {
  FunctionArgs,
  MaybeRef,
  DebounceFilterOptions,
} from '@wind-ui/utils'
import { createFilterWrapper, debounceFilter } from '@wind-ui/utils'

export function useDebounceFn<T extends FunctionArgs>(
  fn: T,
  ms: MaybeRef<number> = 200,
  options: DebounceFilterOptions = {}
): T {
  return createFilterWrapper(debounceFilter(ms, options), fn)
}
