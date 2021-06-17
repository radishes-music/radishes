import { defineComponent, computed, toRefs, watch, toRaw } from 'vue'
import { isBrowser, isElectron, toFixed } from '@/utils/index'
import { useFooterModule, useLayoutModule } from '@/modules'
import { asyncIpc } from '@/electron/event/ipc-browser'
import { LyricsAction, UpdateType } from '@/electron/event/action-types'
import LyricsFlash from './index'
import './index.less'

export const ipcUpdateLyrics = (type: UpdateType, payload?: unknown) => {
  asyncIpc().then(event => {
    event.sendAsyncIpcRendererEvent(LyricsAction.LYRICS_UPDATE, {
      type: type,
      payload: toRaw(payload)
    })
  })
}

export const BrowserLyricsFlash = defineComponent({
  name: 'BrowserLyricsFlash',
  setup() {
    const { useState, useGetter } = useFooterModule()
    const LayoutModule = useLayoutModule()

    const { currentTime, playing, visibleFlash } = toRefs(useState())
    const { screenSize } = toRefs(LayoutModule.useState())

    const lyrics = computed(() =>
      useGetter('musicLyrics').filter(value => value.lyric)
    )

    const index = computed(() => {
      if (visibleFlash.value) {
        const len = lyrics.value.length
        return (
          lyrics.value.findIndex((value, index) => {
            return currentTime.value >= value.time && len - 1 === index
              ? true
              : currentTime.value < lyrics.value[index + 1]?.time
          }) || 0
        )
      }
      return 0
    })

    const flashMagic = computed(() => {
      if (visibleFlash.value) {
        const cur = lyrics.value[index.value]
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

    if (isElectron) {
      watch(flashMagic, v => {
        ipcUpdateLyrics(UpdateType.UPDATE_MAGIC, v)
      })
      watch(index, v => {
        ipcUpdateLyrics(UpdateType.UPDATE_INDEX, v)
      })
      watch(lyrics, v => {
        ipcUpdateLyrics(UpdateType.UPDATE_LYRICS, v)
      })
      watch(playing, v => {
        ipcUpdateLyrics(UpdateType.UPDATE_PLAYING, v)
      })
    }

    return () => (
      <>
        {isBrowser && (
          <LyricsFlash
            screenSize={screenSize.value}
            visibleFlash={visibleFlash.value}
            lyrics={lyrics.value}
            index={index.value}
            playing={playing.value}
            flashMagic={flashMagic.value}
          ></LyricsFlash>
        )}
      </>
    )
  }
})
