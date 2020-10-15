import { createApp } from 'vue'
import App from './app'
import router from '../router'
import store from '../store'
import EasyComponents from './plugin/v-easy-components'
import Antd from './plugin/antd'
import GlobalComponent from '@/components-global/index'
import { errorHandle } from '@/components/error-boundary/index'
import '@/iconfont/index'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Antd)
  .use(GlobalComponent)
  .use(EasyComponents)

errorHandle(app)

app.mount('#app')
