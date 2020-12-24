import { Artists, SongsDetail } from '@/interface/index'
import { PostData } from './components/lyrice-float/electron-lyrice'
import { Size } from '@/layout/module'

export type Music = SongsDetail

export interface Lyrics {
  time: number
  lyric: string
  duration: number
}

export const enum PlayMode {
  TURN = 'turn'
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
  volume: number
  lyriceEmbedMinWidth: number
  lyriceFloatMinWidth: number
}

export const state: FooterState = {
  // audio: new BackgroundAudio(),
  playMode: PlayMode.TURN,
  musicUrl: '',
  musicLyricsOrigin: '',
  musciHistory: [],
  musicStack: [],
  currentTime: 0,
  volume: 1,
  playing: false,
  canplay: false,
  audioElement: null,
  sourceElement: null,
  visibleFlash: false,
  duration: 0,
  lyriceEmbedMinWidth: 0,
  lyriceFloatMinWidth: 0,
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

export interface FooterGetter {
  musicDetail: {
    url: string
  } & SongsDetail
  musicLyrics: Lyrics[]
  musicDes: {
    author: Artists[]
    title: string
  }
}
