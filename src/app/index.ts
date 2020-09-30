import { createApp } from 'vue'
import App from './app'
import router from '../router'
import store from '../store'
import EasyComponents from './plugin/v-easy-components'
import Antd from './plugin/antd'
import { errorHandle } from '@/components/error-boundary/index'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Antd)
  .use(EasyComponents)

errorHandle(app)

app.mount('#app')
