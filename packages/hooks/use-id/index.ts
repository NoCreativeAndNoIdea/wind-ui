import type { MaybeRef } from '@wind-ui/utils'
import { debugWarn } from '@wind-ui/utils'
import type { InjectionKey, Ref } from 'vue'
import { computed, inject, unref } from 'vue'

export interface DIdInjection {
  prefix: number
  current: number
}

const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 100000),
  current: 0,
}

export const ID_INJECTION_KEY: InjectionKey<DIdInjection> =
  Symbol('dIdInjection')

export const useId = (deterministicId?: MaybeRef<string>): Ref<string> => {
  const idInjection = inject(ID_INJECTION_KEY, defaultIdInjection)

  if (!window && idInjection === defaultIdInjection) {
    debugWarn(
      'IdInjection',
      `Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
        usage: app.provide(ID_INJECTION_KEY, {
          prefix: number,
          current: number,
      })`
    )
  }

  return computed(
    () =>
      unref(deterministicId) ||
      `d-id-${idInjection.prefix}-${idInjection.current++}`
  )
}
