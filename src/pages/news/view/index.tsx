import {
  defineComponent,
  KeepAlive,
  Component,
  resolveDynamicComponent
} from 'vue'
import { RouterView } from 'vue-router'
import {
  SecondaryBar,
  renderNavList
} from '@/components-business/secondary-bar/index'
import { navRouter } from '@/router/index'
import { CustomizeRouteRecordRaw } from '@/interface'
import './index.less'

export const News = defineComponent({
  name: 'News',
  setup() {
    const nav = renderNavList(navRouter, News.name)

    // eslint-disable-next-line
    const handleChangeRoute = (route: CustomizeRouteRecordRaw) => {}

    const Slots = {
      default: (component: { Component: Component }) => (
        <KeepAlive>{resolveDynamicComponent(component.Component)}</KeepAlive>
      )
    }
    return () => (
      <div class="news">
        <SecondaryBar nav={nav}></SecondaryBar>
        {/* See https://github.com/vuejs/jsx-next/issues/161 */}
        <RouterView class="px-4" v-slots={Slots}></RouterView>
      </div>
    )
  }
})
