import {
  defineComponent,
  ref,
  toRefs,
  watch,
  onMounted,
  watchEffect
} from 'vue'
import classnames from 'classnames'
import { uesModuleStore, useDrag } from '@/hooks/index'
import { NAMESPACED, State, Getter, Mutations } from '../../module'
import './index.less'

const prefix = 'music'

const toFixed = (n: number, m: number) => {
  return Number(n.toFixed(m))
}

export const MusicControl = defineComponent({
  name: 'MusicControl',
  setup() {
    const playMode = ref('turn')
    const playingIcon = ref('play')
    const indicator = ref()
    const container = ref()
    const currentIndicator = ref('0%')
    const draging = ref(false)

    const { useState, useMutations, useGetter } = uesModuleStore<State, Getter>(
      NAMESPACED
    )

    const {
      audioElement,
      sourceElement,
      playing,
      currentTime,
      canplay
    } = toRefs(useState())

    watchEffect(() => {
      playingIcon.value = playing.value ? 'pause' : 'play'
    })

    watch(currentTime, time => {
      const musicDetail = useGetter('musicDetail')
      if (time && musicDetail.dt && !draging.value) {
        const width = toFixed((time / musicDetail.dt) * 100 * 1000, 6)
        currentIndicator.value = (width > 100 ? 100 : width) + '%'
      }
    })

    const handlePlayPaues = () => {
      if (playing.value) {
        useMutations(Mutations.PAUES_MUSIC)
      } else {
        useMutations(Mutations.PLAY_MUSIC)
      }
    }

    const timeUpdate = () => {
      if (audioElement.value) {
        const time = audioElement.value.currentTime
        useMutations(Mutations.CURRENT_TIME, time)
      }
    }

    const ended = () => {
      useMutations(Mutations.ENDED_MUSIC)
    }

    onMounted(() => {
      if (audioElement.value) {
        audioElement.value.addEventListener('timeupdate', timeUpdate)
        audioElement.value.addEventListener('ended', ended)
        audioElement.value.addEventListener('canplay', () => {
          useMutations(Mutations.CAN_PLAY)
          useMutations(Mutations.PLAY_MUSIC)
        })
      }
      const { offsetWidth } = container.value as HTMLElement
      const { start, stop } = useDrag(
        indicator.value as HTMLElement,
        indicator.value as HTMLElement,
        {
          moveCB(x) {
            requestAnimationFrame(() => {
              const w = toFixed((x / offsetWidth) * 100, 6)
              currentIndicator.value = (w > 100 ? 100 : w) + '%'
            })
          },
          startCB() {
            draging.value = true
          },
          stopCB(x) {
            const musicDetail = useGetter('musicDetail')
            draging.value = false
            const time = toFixed((musicDetail.dt / 1000) * (x / offsetWidth), 6)
            useMutations(Mutations.SET_CURRENT_TIME, time)
          }
        }
      )
      watch(canplay, canplay => {
        if (canplay) {
          stop()
          start()
        }
      })
    })

    return () => (
      <div class={`${prefix}-command`}>
        <audio class="audio-background" ref={audioElement}>
          <source ref={sourceElement} type="audio/mpeg" />
        </audio>
        <div class={`${prefix}-command-center`}>
          <div class={`${prefix}-command-group`}>
            <ve-button type="text">
              <icon
                icon={playMode.value}
                color="#333"
                size={16}
                aria-title="播放顺序"
              ></icon>
            </ve-button>
            <ve-button type="text" class="theme-btn-color">
              <icon icon="shangyishou" aria-title="上一首"></icon>
            </ve-button>
            <ve-button
              type="text"
              onClick={handlePlayPaues}
              class="theme-btn-color"
            >
              <icon
                icon={playingIcon.value}
                size={44}
                aria-title="播放/暂停"
              ></icon>
            </ve-button>
            <ve-button type="text" class="theme-btn-color">
              <icon icon="xiayishou" aria-title="下一首"></icon>
            </ve-button>
            <ve-button type="text">
              <icon icon="lyrics" color="#333" size={16} aria-title="词"></icon>
            </ve-button>
          </div>
          <div class={`${prefix}-command-bottom`}>
            <div
              ref={container}
              class={classnames(`${prefix}-command-progress`, {
                [`${prefix}-command-progress-active`]: draging.value
              })}
            >
              <div
                ref={indicator}
                class={`${prefix}-command-progress--indicator`}
                style={{ width: currentIndicator.value }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
