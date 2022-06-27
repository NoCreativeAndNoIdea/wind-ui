import { withInstall } from '@wind-ui/utils'
export * from './src/config-provider'

import ConfigProvider from './src/config-provider'

export const DConfigProvider = withInstall(ConfigProvider)
export default DConfigProvider

export * from './src/config-provider'
