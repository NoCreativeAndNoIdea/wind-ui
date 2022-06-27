import { provideGlobalConfig } from '@wind-ui/hooks'

import type { App, Plugin } from 'vue'
import type { ConfigProviderContext } from '@wind-ui/tokens'
import { INSTALLED_KEY } from '@wind-ui/constants'
import { hasOwn } from '@vue/shared'

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext): null => {
    if (hasOwn(app, INSTALLED_KEY)) return null
    ;(app as Record<string | symbol, any>)[INSTALLED_KEY] = true

    components.forEach((c) => app.use(c))

    if (options) provideGlobalConfig(options, app, true)
    return null
  }

  return {
    install,
  }
}
