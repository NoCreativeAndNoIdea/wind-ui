import { withInstall, withNoopInstall } from '@wind-ui/utils'
import Container from './src/container.vue'
import Aside from './src/aside.vue'
import Header from './src/header.vue'
import Main from './src/main.vue'
import Footer from './src/footer.vue'

export const DContainer = withInstall(Container, {
  Aside,
  Header,
  Main,
  Footer,
})

export const DAside = withNoopInstall(Aside)
export const DHeader = withNoopInstall(Header)
export const DMain = withNoopInstall(Main)
export const DFooter = withNoopInstall(Footer)

export default DContainer
