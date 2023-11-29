// electron creates window entry, such as lyrics

import { createApp } from 'vue'
import App from '@/pages/footer/components/lyrics-desktop/electron-lyrics'
import { Components } from '@/app/plugin/v-easy-components'
import GlobalComponent from '@/components-global/index'
import { errorHandle } from '@/components/error-boundary/index'
import store from '@/store'
import '@/iconfont/index'
import './index.less'
import '@/theme/index'

const app = createApp(App).use(store).use(Components).use(GlobalComponent)

// errorHandle(app)

app.mount('#app')
