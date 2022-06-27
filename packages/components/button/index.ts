import { withInstall, withNoopInstall } from '@wind-ui/utils'
import Button from './src/button.vue'
import ButtonGroup from './src/button-group.vue'

export const DButton = withInstall(Button, {
  ButtonGroup,
})
export const DButtonGroup = withNoopInstall(ButtonGroup)

export default DButton
export * from './src/button'
