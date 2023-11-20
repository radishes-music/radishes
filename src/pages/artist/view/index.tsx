import {
  defineComponent,
  watch,
  ref,
  onUnmounted,
  Component,
  resolveDynamicComponent,
  KeepAlive
} from 'vue'
import { SecondaryLayout } from '@/layout/secondary/secondary'
import { Image } from '@/components/image/index'
import { RouterView } from 'vue-router'
import { contentRouter } from '@/router/index'
import { SecondaryBar } from '@/components-business/secondary-bar/index'
import { ArtistActions, CustomizeRouteRecordRaw } from '@/interface'
import { parentAP } from '../logic/ap'
import './index.less'

const formatNav = (id: string | string[]): CustomizeRouteRecordRaw[] => {
  let tp = contentRouter.filter(route => route.path.includes('/artist'))
  if (tp[0]) {
    if (tp[0].children) {
      tp = tp[0].children
        .filter(route => route.path)
        .map(route => ({
          ...route,
          meta: {
            ...route.meta,
            path: route.path.replace(':id', id as string)
          }
        }))
    }
  }
  return tp
}

export default defineComponent({
  name: 'Artist',
  setup() {
    const nav = ref()
    const { state, route, useActions } = parentAP()

    const unwatch = watch(
      () => route.params.id,
      id => {
        if (id) {
          nav.value = formatNav(id)
          useActions(ArtistActions.SET_ACTION_ARTIST_DETAIL, id as string)
          useActions(ArtistActions.SET_ACTION_ARTIST_ALBUM, id as string)
        }
      },
      {
        immediate: true
      }
    )

    onUnmounted(() => {
      unwatch()
    })

    return () => (
      <div class="artist">
        <SecondaryLayout
          v-slots={{
            head: () => (
              <>
                <Image src={state.artist.cover} name="artist-coverimg" />
                <div class="artist-detail">
                  <h1>{state.artist.name}</h1>
                  <div class="artist-detail-authoring">
                    <p>单曲数: {state.artist.musicSize}</p>
                    <p>专辑数: {state.artist.albumSize}</p>
                    <p>MV数: {state.artist.mvSize}</p>
                  </div>
                </div>
              </>
            ),
            body: () => (
              <div class="artist-body">
                <SecondaryBar nav={nav.value} size="small" />
                <RouterView
                  v-slots={{
                    default: (component: { Component: Component }) => (
                      <KeepAlive>
                        {resolveDynamicComponent(component.Component)}
                      </KeepAlive>
                    )
                  }}
                ></RouterView>
              </div>
            )
          }}
        />
      </div>
    )
  }
})
