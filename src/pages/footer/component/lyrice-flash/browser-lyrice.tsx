import { defineComponent, computed, toRefs, watch, watchEffect } from 'vue'
import { uesModuleStore } from '@/hooks/index'
import { toFixed } from '@/utils/index'
import { ENV } from '@/interface/app'
import {
  NAMESPACED as LayoutNamespace,
  State as LayoutState,
  Size
} from '@/layout/module'
import { NAMESPACED, State, Getter, Mutations } from '../../module'
import { Platform } from '@/config/build'
import LyriceFlash from './index'
import './index.less'

const { VUE_APP_PLATFORM } = window as ENV

export const BrowserLyriceFlash = defineComponent({
  name: 'BrowserLyriceFlash',
  setup() {
    const { useState, useGetter, useMutations } = uesModuleStore<State, Getter>(
      NAMESPACED
    )
    const LayoutModule = uesModuleStore<LayoutState>(LayoutNamespace)

    const { currentTime, playing, visibleFlash, musicUrl } = toRefs(useState())
    const { screenSize } = toRefs(LayoutModule.useState())

    if (VUE_APP_PLATFORM === Platform.ELECTRON) {
      useMutations(Mutations.VISIBLE_FLASH, true)
    }

    const lyrice = computed(() =>
      useGetter('musicLyrics').filter(value => value.lyric)
    )

    watch(screenSize, v => {
      if (musicUrl.value) {
        useMutations(Mutations.VISIBLE_FLASH, v === Size.SM)
      }
    })

    const index = computed(() => {
      if (visibleFlash.value) {
        const len = lyrice.value.length
        return (
          lyrice.value.findIndex((value, index) => {
            return currentTime.value >= value.time && len - 1 === index
              ? true
              : currentTime.value < lyrice.value[index + 1]?.time
          }) || 0
        )
      }
      return 0
    })

    const flashMagic = computed(() => {
      if (visibleFlash.value) {
        const cur = lyrice.value[index.value]
        // const schedule = cur.duration - (currentTime.value - cur.time)
        const d = toFixed(cur?.duration, 2)
        if (d) {
          return {
            animationDuration: `${d}s`
          }
        } else {
          return {
            animationDuration: ''
          }
        }
      }
      return {
        animationDuration: ''
      }
    })

    watchEffect(() => {
      useMutations(Mutations.UPDATE_ELECTRON_LYRICE, {
        flashMagic: flashMagic.value,
        index: index.value,
        playing: playing.value,
        lyrice: lyrice.value
      })
    })

    return () => (
      <>
        {VUE_APP_PLATFORM === Platform.BROWSER && (
          <LyriceFlash
            screenSize={screenSize.value}
            visibleFlash={visibleFlash.value}
            lyrice={lyrice.value}
            index={index.value}
            playing={playing.value}
            flashMagic={flashMagic.value}
          ></LyriceFlash>
        )}
      </>
    )
  }
})
