// electron creates window entry, such as lyrics

import { createApp } from 'vue'
import App from '@/pages/footer/component/lyrice-float/electron-lyrice'
import EasyComponents from '@/app/plugin/v-easy-components'
import Antd from '@/app/plugin/antd'
import GlobalComponent from '@/components-global/index'
import { errorHandle } from '@/components/error-boundary/index'
import '@/iconfont/index'
import './index.less'
import '@/theme/index'

const app = createApp(App)
  .use(Antd)
  .use(EasyComponents)
  .use(GlobalComponent)

errorHandle(app)

app.mount('#app')
