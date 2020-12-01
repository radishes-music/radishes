import { defineComponent, reactive } from 'vue'
import LyriceFlash from './index'
import { Size } from '@/layout/module'
import { Lyrics } from '@/pages/footer/module'
import {
  MiddlewareView,
  LyriceAction,
  UpdateType
} from '@/electron/event/action-types'
import { ErrorBoundary } from '@/components/error-boundary/index'
import { isEqual } from 'lodash'
import './electron-lyrice.less'

import { ipcRenderer } from 'electron'

export interface PostData {
  screenSize: Size
  visibleFlash: boolean
  lyrice: Lyrics[]
  index: number
  playing: boolean
  flashMagic: {
    animationDuration: string
  }
}

export default defineComponent({
  name: 'Lyrice',
  setup() {
    const postData: PostData = reactive({
      screenSize: Size.SM,
      visibleFlash: true,
      lyrice: [
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
      LyriceAction.LYRICE_UPDATE_RENDER,
      (
        event,
        arg: {
          type: UpdateType
          payload: unknown
        }
      ) => {
        const { type, payload } = arg
        if (payload === undefined) return
        switch (type) {
          case UpdateType.UPDATE_INDEX:
            postData.index = payload as PostData['index']
            break
          case UpdateType.UPDATE_LYRICE:
            if (
              (payload as PostData['lyrice']).length !== 0 &&
              !isEqual(payload, postData.lyrice)
            ) {
              postData.lyrice = payload as PostData['lyrice']
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
        <div class="lyrice" onClick={() => console.log('click')}>
          <LyriceFlash
            screenSize={postData.screenSize}
            visibleFlash={postData.visibleFlash}
            lyrice={postData.lyrice}
            index={postData.index}
            playing={postData.playing}
            flashMagic={postData.flashMagic}
          ></LyriceFlash>
        </div>
      </ErrorBoundary>
    )
  }
})
