import type { MaybeRef } from '@wind-ui/utils'
import { buildProp } from '@wind-ui/utils'
import type { ComponentSize } from '@wind-ui/constants'
import { componentSizes } from '@wind-ui/constants'
import { computed, ref, unref } from 'vue'
import { useProp } from '../use-prop'
import { useGlobalConfig } from '../use-global-config'

export const useSizeProp = buildProp({
  type: String,
  values: componentSizes,
  required: false,
})

export const useSize = (
  fallback?: MaybeRef<ComponentSize | undefined>,
  ignore: Partial<Record<'prop' | 'form' | 'formItem' | 'global', boolean>> = {}
) => {
  const emptyRef = ref(undefined)

  const size = ignore.prop ? emptyRef : useProp<ComponentSize>('size')
  const globalConfig = ignore.global ? emptyRef : useGlobalConfig('size')

  // TODO: form Item size

  return computed(
    (): ComponentSize =>
      size.value || unref(fallback) || globalConfig.value || ''
  )
}

export const useDisabled = (fallback?: MaybeRef<boolean | undefined>) => {
  const disabled = useProp<boolean>('disabled')
  // TODO: from disabled
  return computed(() => disabled.value || unref(fallback) || false)
}
