import { defineComponent, reactive } from 'vue'
import LyricsFlash from './index'
import { LayoutSize } from '@/interface'
import { Lyrics } from '@/interface'
import {
  MiddlewareView,
  LyricsAction,
  UpdateType
} from '@/electron/event/action-types'
import { ErrorBoundary } from '@/components/error-boundary/index'
import { isEqual } from 'lodash-es'
import './electron-lyrics.less'

export interface PostData {
  screenSize: LayoutSize
  visibleFlash: boolean
  lyrics: Lyrics[]
  index: number
  playing: boolean
  flashMagic: {
    animationDuration: string
  }
}

export default defineComponent({
  name: 'Lyrics',
  setup() {
    const postData: PostData = reactive({
      screenSize: LayoutSize.SM,
      visibleFlash: true,
      lyrics: [
        {
          lyric: 'Radishes Music @Link',
          time: 0,
          duration: 0
        }
      ],
      index: 0,
      playing: true,
      flashMagic: {
        animationDuration: ''
      }
    })

    ipcRenderer.on(MiddlewareView.UPDATE_THEME_COLOR, (event, arg) => {
      document.documentElement.style.setProperty('--base-color', arg)
      document.documentElement.style.setProperty('--primary-theme-text', arg)
    })

    ipcRenderer.on(
      LyricsAction.LYRICS_UPDATE_RENDER,
      (
        event,
        arg: {
          type: UpdateType
          payload: PostData[keyof PostData]
        }
      ) => {
        const { type, payload } = arg
        if (payload === undefined) return
        switch (type) {
          case UpdateType.UPDATE_INDEX:
            postData.index = (payload < 0 ? 0 : payload) as PostData['index']
            break
          case UpdateType.UPDATE_LYRICS:
            if (
              (payload as PostData['lyrics']).length !== 0 &&
              !isEqual(payload, postData.lyrics)
            ) {
              postData.lyrics = payload as PostData['lyrics']
            }
            break
          case UpdateType.UPDATE_MAGIC:
            postData.flashMagic = payload as PostData['flashMagic']
            break
          case UpdateType.UPDATE_PLAYING:
            postData.playing = payload as PostData['playing']
            break
          default:
            break
        }
      }
    )

    return () => (
      <ErrorBoundary ref="ErrorBoundary">
        <div class="lyrics" onClick={() => console.log('click')}>
          <LyricsFlash {...postData}></LyricsFlash>
        </div>
      </ErrorBoundary>
    )
  }
})
