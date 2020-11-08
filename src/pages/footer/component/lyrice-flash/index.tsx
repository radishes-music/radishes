import { defineComponent, toRefs, ref, onMounted, PropType } from 'vue'
import { useDrag } from '@/hooks/index'
import { TeleportToAny } from '@/components/teleport-layout/index'
import { ENV } from '@/interface/app'
import { Size } from '@/layout/module'
import { Getter } from '@/pages/footer/module'
import classnames from 'classnames'
import './index.less'
import { Platform } from '@/config/build'

const { VUE_APP_PLATFORM } = window as ENV

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
      type: Array as PropType<Getter['musicLyrics']>,
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
          lyriceEl.value as HTMLElement,
          lyriceEl.value as HTMLElement,
          {
            moveCB(x, y) {
              requestAnimationFrame(() => {
                lyriceEl.value.style.transform = `matrix(1, 0, 0, 1, ${x}, ${y}) translateZ(0)`
              })
            }
          }
        )
        start()
      }
    })

    return () => (
      <TeleportToAny
        container="body"
        class={classnames('lyrice-flash-contanier', [
          'lyrice-flash-' + screenSize.value,
          'lyrice-flash-' + VUE_APP_PLATFORM
        ])}
        visible={visibleFlash.value}
      >
        <div ref={lyriceEl} class="lyrice-flash">
          {lyrice.value.map((item, i) => (
            <div
              data-time={item.time}
              data-duration={item.duration}
              class={classnames({
                'lyrice-flash-active': index.value === i,
                'lyrice-flash-pause': !playing.value && index.value === i
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
})

export default LyriceFlash
