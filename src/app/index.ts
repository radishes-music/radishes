import { createApp } from 'vue'
import App from './app'
import router from '../router'
import store from '../store'
import { Components } from './plugin/v-easy-components'
import GlobalComponent from '@/components-global/index'
import { errorHandle } from '@/components/error-boundary/index'
import { registerIPC } from '../electron/preload/ipc'
import { isElectron } from '@/utils/index'
import init from '@/electron/preload/init'
import '@/iconfont/index'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Components)
  .use(GlobalComponent)

errorHandle(app)
init()

if (isElectron()) {
  registerIPC(app)
}

app.mount('#app')
