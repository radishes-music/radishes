import {
  defineComponent,
  KeepAlive,
  Component,
  resolveDynamicComponent,
  provide
} from 'vue'
import { RouteRecordRaw, RouterView } from 'vue-router'
import { SecondaryBar } from '@/components/secondary-bar/index'
import { navRouter } from '@/router/index'
import { ProvideInject } from '../constant'
import { useRouter } from '@/hooks/index'
import { Song } from '@/interface/index'
import './index.less'

export const navKey = Symbol('nav')

export const News = defineComponent({
  name: 'News',
  setup() {
    let nav = navRouter.filter(item => item.name === News.name)
    if (nav.length) {
      nav = nav[0].children?.filter(item => item.meta?.name) as RouteRecordRaw[]
    }

    const router = useRouter()
    function toPlaylist(payload: Song) {
      router.push({
        path: '/song-list/' + payload.id
      })
    }

    provide(ProvideInject.TO_PLAYLIST_DETAILS, toPlaylist)

    // eslint-disable-next-line
    const handleChangeRoute = (route: RouteRecordRaw) => {}

    const Slots = {
      default: (component: { Component: Component }) => (
        <KeepAlive>{resolveDynamicComponent(component.Component)}</KeepAlive>
      )
    }
    return () => (
      <div class="news">
        <SecondaryBar nav={nav}></SecondaryBar>
        {/* See https://github.com/vuejs/jsx-next/issues/161 */}
        <RouterView v-slots={Slots}></RouterView>
      </div>
    )
  }
})
