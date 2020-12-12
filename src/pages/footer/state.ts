import { Albums, Artists, SongsDetail } from '@/interface/index'
import { PostData } from './components/lyrice-float/electron-lyrice'
import { Size } from '@/layout/module'
import { storage } from '@/utils/index'

const { get } = storage()

export type Music = SongsDetail

export interface Lyrics {
  time: number
  lyric: string
  duration: number
}

export const enum PlayMode {
  TURN = 'turn'
}

export const enum LocalKey {
  VOLUME = 'volume',
  MUSIC_HISTORY = 'music_history'
}

export interface FooterState {
  // audio: AudioType
  playMode: PlayMode
  music?: SongsDetail
  musicUrl: string
  musicLyricsOrigin: string
  musciHistory: SongsDetail[]
  musicStack: SongsDetail[]
  currentTime: number
  playing: boolean
  canplay: boolean
  audioElement: HTMLAudioElement | null
  sourceElement: HTMLSourceElement | null
  visibleFlash: boolean
  electronLyrice: PostData
  duration: number
}

export const state: FooterState = {
  // audio: new BackgroundAudio(),
  playMode: PlayMode.TURN,
  musicUrl: '',
  musicLyricsOrigin: '',
  musciHistory:
    ((get(LocalKey.MUSIC_HISTORY, {
      parser: 'object'
    }) as unknown) as SongsDetail[]) || [],
  musicStack: [],
  currentTime: 0,
  playing: false,
  canplay: false,
  audioElement: null,
  sourceElement: null,
  visibleFlash: false,
  duration: 0,
  electronLyrice: {
    screenSize: Size.SM,
    visibleFlash: true,
    lyrice: [],
    index: 0,
    playing: true,
    flashMagic: {
      animationDuration: ''
    }
  }
}

export interface Getter {
  musicDetail: {
    url: string
  } & SongsDetail
  volume: number
  musicLyrics: Lyrics[]
  musicDes: {
    author: Artists[]
    title: string
  }
}
