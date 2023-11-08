import { createApp } from 'vue'
import App from './app'
import store from '../store'
import router from '../router'
import { Components } from './plugin/v-easy-components'
import GlobalComponent from '@/components-global/index'
import { errorHandle } from '@/components/error-boundary/index'
import { registerIPC } from '../electron/preload/ipc'
import { isElectron } from '@/utils/index'
// import init from '@/electron/preload/init'
import '@/iconfont/index'

const app = createApp(App)
  .use(store)
  .use(router)
  // @ts-expect-error
  .use(Components.default)
  .use(GlobalComponent)

errorHandle(app)

// FIXME: run with it, cant build in web
// init()

if (isElectron) {
  registerIPC(app)
}

app.mount('#app')
