import { createApp } from 'vue'
import { Components } from './plugin/v-easy-components'
import { errorHandle } from '@/components/error-boundary/index'
import { registerIPC } from '@/electron/preload/ipc'
import { isElectron } from '@/utils/index'
import GlobalComponent from '@/components-global/index'
import App from './app'
import store from '@/store'
import router from '@/router'
import init from '@/electron/preload/init'
import i18n from '@/locale/i18n'
import '@/iconfont/index'

const app = createApp(App)
  .use(i18n)
  .use(store)
  .use(router)
  .use(Components)
  .use(GlobalComponent)

errorHandle(app)
init()

if (isElectron) {
  registerIPC(app)
}

app.mount('#app')
