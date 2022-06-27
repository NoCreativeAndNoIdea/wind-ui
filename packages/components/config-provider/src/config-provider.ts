import { provideGlobalConfig, useSizeProp } from '@wind-ui/hooks'
import { buildProps, definePropType } from '@wind-ui/utils'
import { defineComponent, renderSlot } from 'vue'
import type { ExtractPropTypes } from 'vue'
import type { ButtonConfigContext } from '@wind-ui/components/button/src/button'

export const configProviderProps = buildProps({
  size: useSizeProp,

  button: {
    type: definePropType<ButtonConfigContext>(Object),
  },

  keyboardNavigation: {
    type: Boolean,
    default: true,
  },

  zIndex: Number,

  namespace: {
    type: String,
    default: 'wind',
  },
} as const)

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>

const ConfigProvider = defineComponent({
  name: 'DConfigProvider',
  props: configProviderProps,
  setup(props, { slots }) {
    const config = provideGlobalConfig(props)

    return () => renderSlot(slots, 'default', { config: config?.value })
  },
})

export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>

export default ConfigProvider
