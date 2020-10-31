import { defineComponent, ref, toRefs, onMounted, watchEffect } from 'vue'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, State, Mutations } from '../../module'
import './index.less'

const prefix = 'music'

export const MusicControl = defineComponent({
  name: 'MusicControl',
  setup() {
    const playMode = ref('turn')
    const playingIcon = ref('play')

    const { useState, useMutations } = uesModuleStore<State>(NAMESPACED)

    const { audioElement, sourceElement, playing } = toRefs(useState())

    watchEffect(() => {
      playingIcon.value = playing.value ? 'pause' : 'play'
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

    onMounted(() => {
      if (audioElement.value) {
        audioElement.value.addEventListener('timeupdate', timeUpdate)
        audioElement.value.addEventListener('canplay', () => {
          useMutations(Mutations.CAN_PLAY)
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
                aria-title="播放顺序"
              ></icon>
            </ve-button>
            <ve-button type="text">
              <icon icon="shangyishou" color="#333" aria-title="上一首"></icon>
            </ve-button>
            <ve-button type="text" onClick={handlePlayPaues}>
              <icon
                icon={playingIcon.value}
                color="#333"
                size={44}
                aria-title="播放/暂停"
              ></icon>
            </ve-button>
            <ve-button type="text">
              <icon icon="xiayishou" color="#333" aria-title="下一首"></icon>
            </ve-button>
            <ve-button type="text">
              <icon icon="lyrics" color="#333" aria-title="词"></icon>
            </ve-button>
          </div>
          <div class={`${prefix}-command-progress`}></div>
        </div>
      </div>
    )
  }
})
