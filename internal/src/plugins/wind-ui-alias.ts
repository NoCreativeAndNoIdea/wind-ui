import { PKG_NAME } from '../build-info'

import type { Plugin } from 'rollup'

export function WindUiAlias(): Plugin {
  const themeChalk = 'theme-chalk'
  const sourceThemeChalk = `@wind-ui/${themeChalk}` as const
  const bundleThemeChalk = `${PKG_NAME}/${themeChalk}` as const

  return {
    name: 'wind-ui-alias-plugin',
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) return null
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: 'absolute',
      }
    },
  }
}
