import {
  defineComponent,
  ref,
  toRefs,
  onMounted,
  watchEffect,
  computed
} from 'vue'
import { uesModuleStore } from '@/hooks/index'
import { toFixed, formatTime } from '@/utils/index'
import { Block } from '@/components/process-bar/block'
import { ProgressBar } from '@/components/process-bar/index'
import { NAMESPACED, State, Getter, Mutations } from '../../module'
import './index.less'

const prefix = 'music'

export const MusicControl = defineComponent({
  name: 'MusicControl',
  setup() {
    const playMode = ref('turn')
    const playingIcon = ref('play')
    const currentIndicator = ref(0)
    const draging = ref(false)
    const block = ref<Block[]>([])

    const { useState, useMutations, useGetter } = uesModuleStore<State, Getter>(
      NAMESPACED
    )

    const {
      audioElement,
      sourceElement,
      playing,
      canplay,
      currentTime
    } = toRefs(useState())

    const durationTime = computed(() => {
      const duration = useGetter('duration')
      return formatTime(duration || 0, 's')
    })

    const currentTimeFormat = computed(() => {
      return formatTime(currentTime.value, 's')
    })

    const handlePlayPaues = () => {
      if (playing.value) {
        useMutations(Mutations.PAUES_MUSIC)
      } else {
        useMutations(Mutations.PLAY_MUSIC)
      }
    }

    const setAudioCurrent = (indicatorX: number, indicatorW: number) => {
      const musicDetail = useGetter('musicDetail')
      const time = toFixed(
        (musicDetail.dt / 1000) * (indicatorX / indicatorW),
        6
      )
      useMutations(Mutations.CURRENT_TIME, time)
    }

    const canplaythrough = () => {
      block.value = [
        {
          left: 0,
          width: 100
        }
      ]
    }

    const timeUpdate = () => {
      const musicDetail = useGetter('musicDetail')
      if (audioElement.value && musicDetail.dt && !draging.value) {
        const time = audioElement.value.currentTime
        const width = toFixed((time / musicDetail.dt) * 100 * 1000, 6)
        currentIndicator.value = width > 100 ? 100 : width
        useMutations(Mutations.UPDATE_CURRENT_TIME, time)
      }
    }

    const loadstart = () => {
      block.value = []
    }

    const progress = () => {
      if (audioElement.value) {
        const duration = useGetter('duration')
        const timeRanges = audioElement.value.buffered
        const start = timeRanges.start(timeRanges.length - 1)
        const end = timeRanges.end(timeRanges.length - 1)
        block.value[timeRanges.length - 1] = {
          left: (start / duration) * 100,
          width: ((end - start) / duration) * 100
        }
      }
    }

    const ended = () => {
      useMutations(Mutations.ENDED_MUSIC)
    }

    onMounted(() => {
      if (audioElement.value && sourceElement.value) {
        audioElement.value.addEventListener('canplaythrough', canplaythrough)
        audioElement.value.addEventListener('loadstart', loadstart)
        audioElement.value.addEventListener('progress', progress)
        audioElement.value.addEventListener('timeupdate', timeUpdate)
        audioElement.value.addEventListener('ended', ended)
        audioElement.value.addEventListener('playing', () => {
          playingIcon.value = 'pause'
        })
        audioElement.value.addEventListener('pause', () => {
          playingIcon.value = 'play'
        })
        audioElement.value.addEventListener('canplay', () => {
          useMutations(Mutations.CAN_PLAY, true)
          useMutations(Mutations.PLAY_MUSIC)
        })
      }
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
            <ProgressBar
              v-model={[draging.value, 'draging']}
              current={currentIndicator.value}
              onCurrent={(v: number) => (currentIndicator.value = v)}
              canDrage={canplay.value}
              onChange={setAudioCurrent}
              block={block.value}
              showTooltip={false}
              v-slots={{
                prefix: () => (
                  <div class={`${prefix}-time`}>{currentTimeFormat.value}</div>
                ),
                suffix: () => (
                  <div class={`${prefix}-time`}>{durationTime.value}</div>
                )
              }}
            ></ProgressBar>
          </div>
        </div>
      </div>
    )
  }
})
