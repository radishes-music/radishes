import { defineComponent, KeepAlive, Component } from 'vue'
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
    const Slots = {
      default: (component: { Component: Component }) => (
        <KeepAlive>
          <component is={component.Component}></component>
        </KeepAlive>
      )
    }
    return () => (
      <div class="find-music">
        <SecondaryBar nav={nav}></SecondaryBar>
        {/* See https://github.com/vuejs/jsx-next/issues/161 */}
        {/* <router-view v-slots={Slots}></router-view> */}
        <router-view></router-view>
      </div>
    )
  }
})
