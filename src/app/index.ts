import { createApp } from 'vue'
import App from './app'
import router from '../router'
import store from '../store'
import EasyComponents from './plugin/v-easy-components'
import Antd from './plugin/antd'
import Vant from './plugin/vant'
import GlobalComponent from '@/components-global/index'
import { errorHandle } from '@/components/error-boundary/index'
import '@/iconfont/index'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Antd)
  .use(EasyComponents)
  .use(GlobalComponent)
  .use(Vant)

errorHandle(app)

app.mount('#app')
