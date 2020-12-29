import { defineComponent } from 'vue'
import {
  SecondaryBar,
  renderNavList
} from '@/components-business/secondary-bar/index'
import { navRouter } from '@/router/index'
import { RouterView } from 'vue-router'
import { MusicLayout } from '@/layout/music/music'
import './index.less'

export const LocalMusic = defineComponent({
  name: 'LocalMusic',
  render() {
    const nav = renderNavList(navRouter, LocalMusic.name)
    return (
      <MusicLayout
        v-slots={{
          title: () => (
            <>
              <div>本地音乐</div>
              <ve-button type="text">选择目录</ve-button>
            </>
          ),
          head: () => <SecondaryBar nav={nav} size="small" />,
          body: () => <RouterView />
        }}
      />
    )
  }
})
