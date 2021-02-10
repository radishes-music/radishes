import { defineComponent } from 'vue'
import { MusicLayout } from '@/layout/music/music'
import { contentRouter } from '@/router/index'
import { RouterView } from 'vue-router'
import {
  SecondaryBar,
  renderNavList
} from '@/components-business/secondary-bar/index'
import './search.less'

export const Search = defineComponent({
  name: 'Search',
  setup() {
    const nav = renderNavList(contentRouter, Search.name)

    return () => (
      <MusicLayout
        v-slots={{
          title: () => <div>找到 {} 首歌曲</div>,
          head: () => <SecondaryBar nav={nav} size="small" />,
          body: () => <RouterView />
        }}
      />
    )
  }
})
