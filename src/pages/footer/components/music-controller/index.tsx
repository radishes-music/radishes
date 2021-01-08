import { defineComponent, ref, toRefs, onMounted, computed, watch } from 'vue'
import { toFixed, formatTime, sleep } from '@/utils/index'
import { Block } from '@/components/process-bar/block'
import { ProgressBar } from '@/components/process-bar/index'
import { useFooterModule } from '@/modules'
import { FooterActions, FooterMutations, Direction } from '@/interface'
import { Platform } from '@/config/build'
import { importIpc, importIpcOrigin } from '@/electron/event/ipc-browser'
import { MiddlewareView, LyriceAction } from '@/electron/event/action-types'

import classnames from 'classnames'
import './index.less'

const prefix = 'music'
const { VUE_APP_PLATFORM } = process.env

export const MusicControl = defineComponent({
  name: 'MusicControl',
  setup() {
    const playingIcon = ref('play')
    const draging = ref(false)
    const block = ref<Block[]>([])

    const { useState, useMutations, useGetter, useActions } = useFooterModule()

    const {
      playMode,
      audioElement,
      sourceElement,
      playing,
      music,
      canplay,
      currentTime,
      visibleFlash,
      duration
      // audio
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

    const showFooter = computed(() => {
      return window.isMobile ? musicDes.value : true
    })

    const prevMusic = () => {
      useActions(FooterActions.CUTOVER_TRACK, Direction.PREV)
    }
    const nextMusic = () => {
      useActions(FooterActions.CUTOVER_TRACK, Direction.NEXT)
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

    const currentIndicator = computed(() => {
      const time = currentTime.value
      const width = toFixed((time / (duration.value * 1000)) * 100 * 1000, 6)
      if (width) {
        return width > 100 ? 100 : width
      }
      return 0
    })

    const timeUpdate = async () => {
      if (!playing.value) return false
      await sleep(1000)
      // TODO
      if (window.isMobile) {
        // useMutations(
        //   FooterMutations.UPDATE_CURRENT_TIME,
        //   audio.value.currentTime
        // )
      }
      if (audioElement.value && duration.value && !draging.value) {
        useMutations(
          FooterMutations.UPDATE_CURRENT_TIME,
          audioElement.value.currentTime
        )
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
      useActions(FooterActions.CUTOVER_TRACK, Direction.NEXT)
    }

    onMounted(() => {
      if (music && music.value) {
        useActions(FooterActions.SET_MUSIC, music.value.id)
      }
      if (currentTime && currentTime.value) {
        useMutations(FooterMutations.CURRENT_TIME, currentTime.value)
      }
      if (audioElement.value && sourceElement.value) {
        audioElement.value.addEventListener('loadedmetadata', loadedmetadata)
        audioElement.value.addEventListener('canplaythrough', canplaythrough)
        audioElement.value.addEventListener('loadstart', loadstart)
        audioElement.value.addEventListener('progress', progress)
        audioElement.value.addEventListener('ended', ended)
        audioElement.value.addEventListener('playing', () => {
          playingIcon.value = 'pause'
        })
        audioElement.value.addEventListener('pause', () => {
          playingIcon.value = 'play'
        })
        audioElement.value.addEventListener('canplay', () => {
          useMutations(FooterMutations.CAN_PLAY, true)
        })
      }
    })

    return () => (
      <div class={`${prefix}-command`} v-show={showFooter.value}>
        <audio
          class="audio-background"
          aria-title={musicDes.value.title}
          aria-author={musicDes.value.author.map(o => o.name).join(' / ')}
          ref={audioElement}
        >
          <source ref={sourceElement} type="audio/mpeg" />
        </audio>
        <div
          class={classnames(`${prefix}-command-center`, {
            [`${prefix}-command-center--mobile`]: window.isMobile
          })}
        >
          <div
            class={classnames(`${prefix}-command-group`, {
              [`${prefix}-command-group--mobile`]: window.isMobile
            })}
          >
            <ve-button type="text" v-show={!window.isMobile}>
              <icon
                icon={playMode.value}
                color="#333"
                size={16}
                aria-title="播放顺序"
              ></icon>
            </ve-button>
            <ve-button
              type="text"
              class="theme-btn-color"
              v-show={!window.isMobile}
            >
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
            <ve-button
              type="text"
              class="theme-btn-color"
              onClick={nextMusic}
              v-show={!window.isMobile}
            >
              <icon icon="xiayishou" aria-title="下一首"></icon>
            </ve-button>
            <ve-button type="text" v-show={!window.isMobile}>
              <icon
                icon="lyrics"
                color={visibleFlash.value ? 'var(--base-color)' : '#333'}
                size={16}
                aria-title="词"
                onClick={handleVisibleFlash}
              ></icon>
            </ve-button>
          </div>
          <div class={`${prefix}-command-bottom`} v-show={!window.isMobile}>
            <ProgressBar
              v-model={[draging.value, 'draging']}
              current={currentIndicator.value}
              onCurrent={(v: number) => {
                useMutations(
                  FooterMutations.UPDATE_CURRENT_TIME,
                  (duration.value * v) / 100
                )
              }}
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
