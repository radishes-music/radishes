import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { RootState } from '@/store/index'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

declare global {
  interface Window {
    isMobile: boolean
    webkitAudioContext: AudioContext
    j18n: any
  }
  type ActionTypeMap =
    | 'play'
    | 'pause'
    | 'seekbackward'
    | 'seekforward'
    | 'previoustrack'
    | 'nexttrack'
    | 'skipad'
    | 'stop'
    | 'seekto'
  interface PositionState {
    duration: number
    playbackRate: number
    position: number
  }
  interface Navigator {
    mediaSession: {
      metadata: MediaMetadataTypeParams
      playbackState: 'none' | 'paused' | 'playing'
      setActionHandler: (type: ActionTypeMap, handler: () => void) => void
      setPositionState: (state: PositionState) => void
    }
  }
}
