import { defineComponent, toRefs, ref, onMounted, PropType } from 'vue'
import { useDrag } from '@/hooks/index'
import { TeleportToAny } from '@/components/teleport-layout/index'
import { LayoutSize, FooterGetter } from '@/interface'
import classnames from 'classnames'
import './index.less'
import { isBrowser, isElectron } from '@/utils'

const { VUE_APP_PLATFORM } = import.meta.env

export const LyricsFlash = defineComponent({
  name: 'LyricsFlash',
  props: {
    screenSize: {
      type: String as PropType<LayoutSize>,
      required: true
    },
    visibleFlash: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    lyrics: {
      type: Array as PropType<FooterGetter['musicLyrics']>,
      required: true
    },
    index: {
      type: Number as PropType<number>,
      required: true
    },
    playing: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    flashMagic: {
      type: Object as PropType<{
        animationDuration: string
      }>,
      required: true
    }
  },
  setup(props) {
    const lyriceEl = ref()

    const { screenSize, visibleFlash, lyrics, index, playing, flashMagic } =
      toRefs(props)

    onMounted(() => {
      if (isBrowser) {
        const { start } = useDrag(
          lyriceEl.value.parentElement as HTMLElement,
          lyriceEl.value as HTMLElement,
          {
            moveCB(x, y) {
              requestAnimationFrame(() => {
                lyriceEl.value.parentElement.style.transform = `matrix(1, 0, 0, 1, ${x}, ${y}) translateZ(0)`
              })
            }
          }
        )
        start()
      }
    })

    return () => {
      const visible = isElectron ? true : visibleFlash.value
      return (
        <TeleportToAny
          container="body"
          class={classnames('lyrics-float-contanier', [
            'lyrics-float-' + screenSize.value,
            'lyrics-float-' + VUE_APP_PLATFORM
          ])}
          visible={visible}
        >
          <div ref={lyriceEl} class="lyrics-float">
            {lyrics.value.map((item, i) => (
              <div
                data-time={item.time}
                data-duration={item.duration}
                class={classnames('vh-center', {
                  'lyrics-float-active': index.value === i,
                  'lyrics-float-pause': !playing.value && index.value === i
                })}
              >
                <div style={index.value === i ? flashMagic.value : ''}>
                  {item.lyric}
                </div>
              </div>
            ))}
          </div>
        </TeleportToAny>
      )
    }
  }
})

export default LyricsFlash
