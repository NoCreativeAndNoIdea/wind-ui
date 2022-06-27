import type { Ref, App } from 'vue'
import { getCurrentInstance, ref, inject, computed, provide, unref } from 'vue'
import type { ConfigProviderContext } from '@wind-ui/tokens'
import { configProviderContextKey } from '@wind-ui/tokens'
import type { MaybeRef } from '@wind-ui/utils'
import { debugWarn, keysOf } from '@wind-ui/utils'

const globalConfig = ref<ConfigProviderContext>()

const mergeConfig = (
  a: ConfigProviderContext,
  b: ConfigProviderContext
): ConfigProviderContext => {
  const keys = [...new Set([...keysOf(a), ...keysOf(b)])]
  const obj: Record<string, any> = {}
  for (const key of keys) {
    obj[key] = b[key] ?? a[key]
  }
  return obj
}

export function useGlobalConfig<
  K extends keyof ConfigProviderContext,
  D extends ConfigProviderContext[K]
>(
  key: K,
  defaultValue?: D
): Ref<Exclude<ConfigProviderContext[K], undefined> | D>
export function useGlobalConfig(): Ref<ConfigProviderContext>
export function useGlobalConfig(
  key?: keyof ConfigProviderContext,
  defaultValue = undefined
) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig
  if (key) {
    return computed(() => config.value?.[key] ?? defaultValue)
  } else {
    return config
  }
}

export const provideGlobalConfig = (
  config: MaybeRef<ConfigProviderContext>,
  app?: App,
  global = false
) => {
  const inSetup = !!getCurrentInstance()
  const oldConfig = inSetup ? useGlobalConfig() : undefined

  const provideFn = app?.provide ?? (inSetup ? provide : undefined)

  if (!provideFn) {
    debugWarn(
      'provideGlobalConfig',
      'provideGlobalConfig() can only be used inside setup().'
    )
    return null
  }

  const context = computed(() => {
    const cfg = unref(config)
    if (!oldConfig?.value) return cfg
    return mergeConfig(oldConfig.value, cfg)
  })

  provideFn(configProviderContextKey, context)
  if (global || !globalConfig.value) {
    globalConfig.value = context.value
  }

  return context
}
