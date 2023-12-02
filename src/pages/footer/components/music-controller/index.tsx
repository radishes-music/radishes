import {
  defineComponent,
  ref,
  toRefs,
  onMounted,
  computed,
  watch,
  watchEffect
} from 'vue'
import {
  toFixed,
  formatTime,
  sleep,
  isElectron,
  isWindows
} from '@/utils/index'
import { Block } from '@/components/process-bar/block'
import { ProgressBar } from '@/components/process-bar/index'
import { useFooterModule, useSettingModule } from '@/modules'
import {
  FooterActions,
  FooterMutations,
  Direction,
  BasicEffect,
  PlayMode
} from '@/interface'
import { asyncIpc, asyncIpcOrigin } from '@/electron/event/ipc-browser'
import { MiddlewareView, LyricsAction } from '@/electron/event/action-types'
import './index.less'
import classNames from 'classnames'
import eventBus from '@/utils/eventBus'
import {
  EVENT_MUSICCONTROL_LIKE_EMITTER,
  EVENT_MUSICCONTROL_LYRICS_OPEN_OR_CLOSE_EMITTER,
  EVENT_MUSICCONTROL_NEXT_EMITTER,
  EVENT_MUSICCONTROL_PLAYMODE_EMITTER,
  EVENT_MUSICCONTROL_PLAY_OR_PAUSE_EMITTER,
  EVENT_MUSICCONTROL_PREV_EMITTER,
  EVENT_MUSICCONTROL_VOLDOWN_EMITTER,
  EVENT_MUSICCONTROL_VOLUP_EMITTER
} from '@/constants'
import { MusicControllUtils } from '@/utils/musicControl'
import { Toast } from 'vant'

const prefix = 'music'

export const MusicControl = defineComponent({
  name: 'MusicControl',
  setup() {
    const playingIcon = ref('play')
    const draging = ref(false)
    const block = ref<Block[]>([])

    const { useState, useMutations, useGetter, useActions } = useFooterModule()
    const settingModule = useSettingModule()

    const settingState = settingModule.useState()
    const {
      playMode,
      audioElement,
      playing,
      music,
      canplay,
      currentTime,
      visibleFlash,
      duration,
      effect,
      musicUrlLoading
    } = toRefs(useState())

    const musicDes = computed(() => useGetter('musicDes'))

    if (isElectron) {
      asyncIpcOrigin().then(ipcRenderer => {
        ipcRenderer.on(LyricsAction.LYRICS_WIN_CLOSE, () => {
          useMutations(FooterMutations.VISIBLE_FLASH, false)
        })
      })
    }

    let cacheIcon = playingIcon.value
    watchEffect(() => {
      if (musicUrlLoading.value) {
        cacheIcon = playingIcon.value
        playingIcon.value = 'loading'
      } else {
        playingIcon.value = cacheIcon
      }
    })

    const durationTime = computed(() => {
      return formatTime(duration.value || 0, 's')
    })

    const currentTimeFormat = computed(() => {
      return formatTime(currentTime.value, 's')
    })

    const changePlayMode = () => {
      useMutations(
        FooterMutations.CHANGE_PLAYMODE,
        playMode.value === PlayMode.RANDOM ? PlayMode.TURN : PlayMode.RANDOM
      )
    }
    const prevMusic = () => {
      useActions(FooterActions.CUTOVER_TRACK, Direction.PREV)
    }
    const nextMusic = () => {
      useActions(FooterActions.CUTOVER_TRACK, Direction.NEXT)
    }

    const handlePlayPaues = async () => {
      // loading disabled play/paues
      if (musicUrlLoading.value) return
      // It can be called after being triggered by the user
      if (!effect.value) {
        useMutations(FooterMutations.INIT_EFFECT)
      }

      effect.value.createConvolver(settingState.convolver)

      if (playing.value) {
        if (settingState.basicEffect.includes(BasicEffect.D3)) {
          effect.value.stopSpatial()
          // effect.value.clearSpatial()
        }
        if (settingState.basicEffect.includes(BasicEffect.TENDER)) {
          effect.value.clearTender()
        }
        if (settingState.basicEffect.includes(BasicEffect.FADE)) {
          // Change the icon directly when fading out to optimize the experience
          playingIcon.value = 'play'
          effect.value.startInOut(false).then(() => {
            playing.value && useMutations(FooterMutations.PAUES_MUSIC)
          })
        } else {
          useMutations(FooterMutations.PAUES_MUSIC)
        }
      } else {
        if (settingState.basicEffect.includes(BasicEffect.FADE)) {
          effect.value.startInOut(true)
        }
        if (settingState.basicEffect.includes(BasicEffect.TENDER)) {
          effect.value.startTender()
        }
        useMutations(FooterMutations.PLAY_MUSIC)
        if (settingState.basicEffect.includes(BasicEffect.D3)) {
          effect.value.stopSurround && effect.value.startSpatial()
        }
      }
    }

    const handleVisibleFlash = () => {
      useMutations(FooterMutations.VISIBLE_FLASH, !visibleFlash.value)
      if (isElectron) {
        asyncIpc()
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
      console.log(indicatorW, indicatorX)
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
      if (audioElement.value && duration.value && !draging.value) {
        useMutations(
          FooterMutations.UPDATE_CURRENT_TIME,
          audioElement.value.currentTime
        )
      }
      setTimeout(timeUpdate, 0)
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
      useMutations(FooterMutations.PLAYING, false)
      useActions(FooterActions.CUTOVER_TRACK, Direction.NEXT)
    }

    onMounted(() => {
      if (music?.value && music?.value) {
        useActions(FooterActions.SET_MUSIC, music?.value.id)
      }
      if (currentTime.value && currentTime.value) {
        useMutations(FooterMutations.CURRENT_TIME, currentTime.value)
      }
      if (audioElement.value) {
        audioElement.value.addEventListener('loadedmetadata', loadedmetadata)
        audioElement.value.addEventListener('canplaythrough', canplaythrough)
        audioElement.value.addEventListener('loadstart', loadstart)
        audioElement.value.addEventListener('progress', progress)
        audioElement.value.addEventListener('ended', ended)
        audioElement.value.addEventListener('playing', () => {
          if (effect.value) {
            if (settingState.basicEffect.includes(BasicEffect.FADE)) {
              effect.value.startInOut(true)
            }
            if (settingState.basicEffect.includes(BasicEffect.D3)) {
              effect.value.stopSurround && effect.value.startSpatial()
            }
          }
          playingIcon.value = 'pause'
        })
        audioElement.value.addEventListener('pause', () => {
          playingIcon.value = 'play'
        })
        audioElement.value.addEventListener('canplay', () => {
          useMutations(FooterMutations.CAN_PLAY, true)
        })
      }

      eventBus.on(EVENT_MUSICCONTROL_PLAY_OR_PAUSE_EMITTER, () =>
        handlePlayPaues()
      )
      eventBus.on(EVENT_MUSICCONTROL_NEXT_EMITTER, nextMusic)
      eventBus.on(EVENT_MUSICCONTROL_PREV_EMITTER, prevMusic)
      eventBus.on(EVENT_MUSICCONTROL_LIKE_EMITTER, () => {
        Toast('TODO: Control Like')
      })
      eventBus.on(EVENT_MUSICCONTROL_LYRICS_OPEN_OR_CLOSE_EMITTER, () => {
        handleVisibleFlash()
      })
      eventBus.on(EVENT_MUSICCONTROL_PLAYMODE_EMITTER, () => {
        changePlayMode()
      })

      // FIXME: handle Menu Event
    })

    return () => (
      <div class={`${prefix}-command`}>
        <audio
          class="audio-background"
          crossorigin="anonymous"
          aria-title={musicDes.value.title}
          aria-author={musicDes.value.author.map(o => o.name).join(' / ')}
          ref={audioElement}
        ></audio>
        <div class={`${prefix}-command-center`}>
          <div class={`${prefix}-command-group`}>
            <ve-button type="text" onClick={changePlayMode}>
              <icon
                icon={playMode.value}
                color="#333"
                size={16}
                aria-title="播放顺序"
              ></icon>
            </ve-button>
            <ve-button type="text" class="theme-btn-color" onClick={prevMusic}>
              <icon icon="shangyishou" aria-title="上一首"></icon>
            </ve-button>
            <ve-button
              type="text"
              onClick={() => {
                MusicControllUtils.doPlayOrPause()
              }}
              class={classNames('theme-btn-color', {
                'theme-btn-color--loading': musicUrlLoading.value
              })}
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
                onClick={() => MusicControllUtils.doOpenOrCloseLyrics()}
              ></icon>
            </ve-button>
          </div>
          <div class={`${prefix}-command-bottom`}>
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
