import { defineComponent, ref, toRefs, onMounted, computed, watch } from 'vue'
import { toFixed, formatTime, sleep } from '@/utils/index'
import { Block } from '@/components/process-bar/block'
import { ProgressBar } from '@/components/process-bar/index'
import { useFooterModule, findMusicIndex } from '@/modules'
import { FooterActions, FooterMutations, PlayMode } from '@/interface'
import { Platform } from '@/config/build'
import { importIpc, importIpcOrigin } from '@/electron/event/ipc-browser'
import { MiddlewareView, LyriceAction } from '@/electron/event/action-types'
import './index.less'

const prefix = 'music'
const { VUE_APP_PLATFORM } = process.env

const enum Direction {
  FORWARD = 'FORWARD',
  BACK = 'BACK'
}

export const MusicControl = defineComponent({
  name: 'MusicControl',
  setup() {
    const playingIcon = ref('play')
    const currentIndicator = ref(0)
    const draging = ref(false)
    const block = ref<Block[]>([])

    const { useState, useMutations, useGetter, useActions } = useFooterModule()

    const {
      musicStack,
      playMode,
      audioElement,
      sourceElement,
      playing,
      canplay,
      currentTime,
      visibleFlash,
      duration
    } = toRefs(useState())

    const musicDes = computed(() => useGetter('musicDes'))

    if (VUE_APP_PLATFORM === Platform.ELECTRON) {
      importIpcOrigin().then(ipcRenderer => {
        ipcRenderer.on(LyriceAction.LYRICE_WIN_CLOSE, () => {
          useMutations(FooterMutations.VISIBLE_FLASH, false)
        })
      })
    }

    const durationTime = computed(() => {
      return formatTime(duration.value || 0, 's')
    })

    const currentTimeFormat = computed(() => {
      return formatTime(currentTime.value, 's')
    })

    const switchMusic = async (direction: Direction) => {
      const { music } = useState()

      if (music && musicStack.value.length > 1) {
        const index = findMusicIndex(musicStack.value, music)
        let next
        switch (playMode.value) {
          case PlayMode.TURN:
            if (direction === Direction.BACK) {
              next = index <= 0 ? musicStack.value.length - 1 : index - 1
            } else {
              next = index === musicStack.value.length - 1 ? 0 : index + 1
            }
            break
        }
        const nextMusic = musicStack.value[next]

        await useActions(FooterActions.SET_MUSIC_LYRICS, nextMusic.id)
        useMutations(FooterMutations.SET_MUSIC_URL, nextMusic)
        useMutations(FooterMutations.PAUES_MUSIC)
        useMutations(FooterMutations.PLAY_MUSIC)
      }
    }

    const prevMusic = () => {
      switchMusic(Direction.BACK)
    }
    const nextMusic = () => {
      switchMusic(Direction.FORWARD)
    }

    const handlePlayPaues = () => {
      if (playing.value) {
        useMutations(FooterMutations.PAUES_MUSIC)
      } else {
        useMutations(FooterMutations.PLAY_MUSIC)
      }
    }

    const handleVisibleFlash = () => {
      useMutations(FooterMutations.VISIBLE_FLASH, !visibleFlash.value)
      if (VUE_APP_PLATFORM === Platform.ELECTRON) {
        importIpc()
          .then(event => {
            event.sendAsyncIpcRendererEvent(
              MiddlewareView.CREATE_WINDOW,
              useGetter('musicLyrics').filter(value => value.lyric)
            )
          })
          .catch(e => {
            console.warn(e)
          })
      }
    }

    const setAudioCurrent = (indicatorX: number, indicatorW: number) => {
      const musicDetail = useGetter('musicDetail')
      const time = toFixed(
        (musicDetail.dt / 1000) * (indicatorX / indicatorW),
        6
      )
      useMutations(FooterMutations.CURRENT_TIME, time)
    }

    const loadedmetadata = () => {
      if (audioElement.value) {
        useMutations(FooterMutations.SET_DURATION, audioElement.value.duration)
      }
    }

    const canplaythrough = () => {
      block.value = [
        {
          left: 0,
          width: 100
        }
      ]
    }

    const timeUpdate = async () => {
      if (!playing.value) return false
      await sleep(1000)
      if (audioElement.value && duration.value && !draging.value) {
        const time = audioElement.value.currentTime
        const width = toFixed((time / (duration.value * 1000)) * 100 * 1000, 6)
        if (width) {
          currentIndicator.value = width > 100 ? 100 : width
        }
        useMutations(FooterMutations.UPDATE_CURRENT_TIME, time)
      }
      requestAnimationFrame(timeUpdate)
    }

    watch(
      () => playing.value,
      play => {
        if (play) {
          timeUpdate()
        }
      }
    )

    const loadstart = () => {
      block.value = []
    }

    const progress = () => {
      if (audioElement.value) {
        const timeRanges = audioElement.value.buffered
        try {
          const start = timeRanges.start(timeRanges.length - 1)
          const end = timeRanges.end(timeRanges.length - 1)
          block.value[timeRanges.length - 1] = {
            left: (start / duration.value) * 100,
            width: ((end - start) / duration.value) * 100
          }
        } catch (e) {
          console.warn(e)
        }
      }
    }

    const ended = async () => {
      useMutations(FooterMutations.ENDED_MUSIC)
      switchMusic(Direction.FORWARD)
    }

    onMounted(() => {
      if (audioElement.value && sourceElement.value) {
        audioElement.value.addEventListener('loadedmetadata', loadedmetadata)
        audioElement.value.addEventListener('canplaythrough', canplaythrough)
        audioElement.value.addEventListener('loadstart', loadstart)
        audioElement.value.addEventListener('progress', progress)
        // audioElement.value.addEventListener('timeupdate', timeUpdate)
        audioElement.value.addEventListener('ended', ended)
        audioElement.value.addEventListener('playing', () => {
          playingIcon.value = 'pause'
        })
        audioElement.value.addEventListener('pause', () => {
          playingIcon.value = 'play'
        })
        audioElement.value.addEventListener('canplay', () => {
          useMutations(FooterMutations.CAN_PLAY, true)
          useMutations(FooterMutations.PLAY_MUSIC)
        })
      }
    })

    return () => (
      <div class={`${prefix}-command`}>
        <audio
          class="audio-background"
          aria-title={musicDes.value.title}
          aria-author={musicDes.value.author.map(o => o.name).join(' / ')}
          ref={audioElement}
        >
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
              <icon
                icon="shangyishou"
                aria-title="上一首"
                onClick={prevMusic}
              ></icon>
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
            <ve-button type="text" class="theme-btn-color" onClick={nextMusic}>
              <icon icon="xiayishou" aria-title="下一首"></icon>
            </ve-button>
            <ve-button type="text">
              <icon
                icon="lyrics"
                color={visibleFlash.value ? 'var(--base-color)' : '#333'}
                size={16}
                aria-title="词"
                onClick={handleVisibleFlash}
              ></icon>
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
