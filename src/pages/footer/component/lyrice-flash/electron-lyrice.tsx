import { defineComponent, reactive } from 'vue'
import LyriceFlash from './index'
import { Size } from '@/layout/module'
import { Lyrics } from '@/pages/footer/module'
import { ipcRenderer } from 'electron'
import { Lyrice } from '@/electron/event/action-types'

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

    ipcRenderer.on(Lyrice.LYRICE_UPDATE_RENDER, (event, any) => {
      postData.index = any.index
      if (any.lyrice?.length) {
        postData.lyrice = any.lyrice
      }
      postData.playing = any.playing
      postData.flashMagic = any.flashMagic
    })

    return () => (
      <LyriceFlash
        screenSize={postData.screenSize}
        visibleFlash={postData.visibleFlash}
        lyrice={postData.lyrice}
        index={postData.index}
        playing={postData.playing}
        flashMagic={postData.flashMagic}
      ></LyriceFlash>
    )
  }
})
