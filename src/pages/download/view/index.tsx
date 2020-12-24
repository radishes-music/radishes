import { defineComponent } from 'vue'
import {
  SecondaryBar,
  renderNavList
} from '@/components-business/secondary-bar/index'
import { navRouter } from '@/router/index'
import { RouterView } from 'vue-router'
import './index.less'

export const Download = defineComponent({
  name: 'Download',
  setup() {
    const nav = renderNavList(navRouter, Download.name)
    return () => (
      <div class="download">
        <h1>下载管理</h1>
        <SecondaryBar nav={nav} size="small"></SecondaryBar>
        <RouterView />
      </div>
    )
  }
})
