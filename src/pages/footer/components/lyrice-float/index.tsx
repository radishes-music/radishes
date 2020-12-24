import { defineComponent, toRefs, ref, onMounted, PropType } from 'vue'
import { useDrag } from '@/hooks/index'
import { TeleportToAny } from '@/components/teleport-layout/index'
import { Size } from '@/layout/module'
import { FooterGetter } from '@/pages/footer/module'
import { Platform } from '@/config/build'
import classnames from 'classnames'
import './index.less'

const { VUE_APP_PLATFORM } = process.env

export const LyriceFlash = defineComponent({
  name: 'LyriceFlash',
  props: {
    screenSize: {
      type: String as PropType<Size>,
      required: true
    },
    visibleFlash: {
      type: Boolean as PropType<boolean>,
      required: true
    },
    lyrice: {
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

    const {
      screenSize,
      visibleFlash,
      lyrice,
      index,
      playing,
      flashMagic
    } = toRefs(props)

    onMounted(() => {
      if (VUE_APP_PLATFORM === Platform.BROWSER) {
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
      const visible =
        VUE_APP_PLATFORM === Platform.ELECTRON ? true : visibleFlash.value
      return (
        <TeleportToAny
          container="body"
          class={classnames('lyrice-float-contanier', [
            'lyrice-float-' + screenSize.value,
            'lyrice-float-' + VUE_APP_PLATFORM
          ])}
          visible={visible}
        >
          <div ref={lyriceEl} class="lyrice-float">
            {lyrice.value.map((item, i) => (
              <div
                data-time={item.time}
                data-duration={item.duration}
                class={classnames('vh-center', {
                  'lyrice-float-active': index.value === i,
                  'lyrice-float-pause': !playing.value && index.value === i
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

export default LyriceFlash
