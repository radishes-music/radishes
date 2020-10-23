import { defineComponent } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { SecondaryBar } from '@/components/secondary-bar/index'
import { navRouter } from '@/router/index'
import './index.less'

export const navKey = Symbol('nav')

export const FindMusic = defineComponent({
  name: 'FindMusic',
  setup() {
    let nav = navRouter.filter(item => item.name === FindMusic.name)
    if (nav.length) {
      nav = nav[0].children?.filter(item => item.meta?.name) as RouteRecordRaw[]
    }
    // eslint-disable-next-line
    const handleChangeRoute = (route: RouteRecordRaw) => {}
    return () => (
      <div class="find-music">
        <SecondaryBar nav={nav}></SecondaryBar>
        <router-view></router-view>
      </div>
    )
  }
})
