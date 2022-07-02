import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { useDebounceFn } from '../use-debounce-fn'
import type { DebounceFilterOptions } from '@wind-ui/utils'

export function refDebounced<T>(
  value: Ref<T>,
  ms = 200,
  options: DebounceFilterOptions = {}
): Readonly<Ref<T>> {
  if (ms <= 0) return value

  const debounced = ref(value.value as T) as Ref<T>

  const updater = useDebounceFn(
    () => {
      debounced.value = value.value
    },
    ms,
    options
  )

  watch(value, () => updater())

  return debounced
}

export { refDebounced as useDebounce, refDebounced as debouncedRef }
