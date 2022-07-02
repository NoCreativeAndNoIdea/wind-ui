import type { ComputedRef } from 'vue'
import { computed, getCurrentInstance } from 'vue'
import { debugWarn, fromPairs } from '@wind-ui/utils'

interface Params {
  excludeListeners?: boolean
  excludeKeys?: ComputedRef<string[]>
}

const DEFAULT_ECLUDE_KEYS = ['class', 'style']
const LISTENER_PREFIX = /^on[A-Z]/

export const useAttrs = (
  params: Params = {}
): ComputedRef<Record<string, unknown>> => {
  const { excludeKeys, excludeListeners = false } = params
  const allExcludeKeys = computed<string[]>(() =>
    (excludeKeys?.value || []).concat(DEFAULT_ECLUDE_KEYS)
  )
  const instance = getCurrentInstance()
  if (!instance) {
    debugWarn(
      'use-attrs',
      'getCurrentInstance() returned null. useAttrs() must be called at the top of a setup function!'
    )
    return computed(() => ({}))
  }

  return computed(() =>
    fromPairs(
      Object.entries(instance.proxy?.$attrs ?? {}).filter(
        ([key]) =>
          !allExcludeKeys.value.includes(key) &&
          !(excludeListeners && LISTENER_PREFIX.test(key))
      )
    )
  )
}

export type ReturnUseAttrs = ReturnType<typeof useAttrs>
