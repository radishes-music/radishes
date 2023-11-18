import {
  defineComponent,
  Component,
  KeepAlive,
  resolveDynamicComponent
} from 'vue'
import { MusicLayout } from '@/layout/music/music'
import { contentRouter } from '@/router/index'
import { RouterView } from 'vue-router'
import {
  SecondaryBar,
  renderNavList
} from '@/components-business/secondary-bar/index'
import './search.less'
import { useSearchModule } from '@/modules'

export const Search = defineComponent({
  name: 'Search',
  setup() {
    const { useState } = useSearchModule()
    const state = useState()

    const nav = renderNavList(contentRouter, Search.name)

    return () => (
      <MusicLayout
        v-slots={{
          title: () => <div>{state.searchTitle}</div>,
          head: () => <SecondaryBar nav={nav} size="small" />,
          body: () => (
            <RouterView
              v-slots={{
                default: (component: { Component: Component }) => (
                  <KeepAlive>
                    {resolveDynamicComponent(component.Component)}
                  </KeepAlive>
                )
              }}
            ></RouterView>
          )
        }}
      />
    )
  }
})
