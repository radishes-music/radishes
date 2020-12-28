import { defineComponent } from 'vue'
import {
  SecondaryBar,
  renderNavList
} from '@/components-business/secondary-bar/index'
import { navRouter } from '@/router/index'
import { RouterView } from 'vue-router'
import './index.less'

export const LocalMusic = defineComponent({
  name: 'LocalMusic',
  render() {
    const nav = renderNavList(navRouter, LocalMusic.name)
    return (
      <div class="local-music">
        <h1>本地音乐</h1>
        <SecondaryBar nav={nav} size="small" />
        <RouterView />
      </div>
    )
  }
})
