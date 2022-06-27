import { createApp } from 'vue'
import App from './src/App.vue'
import '@wind-ui/theme-chalk/src/index.scss'

function bootstrap() {
  const app = createApp(App)

  app.mount('#playground')
}

bootstrap()
