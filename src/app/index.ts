import { createApp } from 'vue'
import App from './app'
import store from '../store'
import router from '../router'
import { Components } from './plugin/v-easy-components'
import GlobalComponent from '@/components-global/index'
import { errorHandle } from '@/components/error-boundary/index'
import { registerIPC } from '../electron/preload/ipc'
import { isElectron } from '@/utils/index'
import init from '@/electron/preload/init'
import '@/iconfont/index'
import './index.css'
import { setupMainEvent } from '@/electron/web/event'

const app = createApp(App)
  .use(store)
  .use(router)
  // @ts-expect-error
  .use(Components.default)
  .use(GlobalComponent)

errorHandle(app)

init()

if (isElectron) {
  // console.log = electronAPI.info
  // console.warn = electronAPI.warn
  // console.error = electronAPI.error
  registerIPC(app)
  setupMainEvent()
}

app.mount('#app')
