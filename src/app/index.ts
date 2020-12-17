import { createApp } from 'vue'
import App from './app'
import router from '../router'
import store from '../store'
import { Components } from './plugin/v-easy-components'
import GlobalComponent from '@/components-global/index'
import { errorHandle } from '@/components/error-boundary/index'
import '@/iconfont/index'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Components)
  .use(GlobalComponent)

errorHandle(app)

app.mount('#app')
