import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { RootState } from '@/store/index'
import { LanguageKey } from './interface'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

declare global {
  declare interface MediaMetadataTypeParams {
    title: string
    artist: string
    album: string
    artwork: {
      src: string
      sizes: string
      type: string
    }[]
  }

  declare interface MediaMetadataType {
    new (option: MediaMetadataTypeParams): MediaMetadataTypeParams
  }

  declare const MediaMetadata: MediaMetadataType

  declare const $t: <T extends keyof LanguageKey>(
    key: T,
    ...args: any[]
  ) => LanguageKey[T]

  interface Window {
    isMobile: boolean
    webkitAudioContext: AudioContext
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
