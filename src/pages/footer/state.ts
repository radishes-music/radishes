import { SongsDetail } from '@/interface/index'
import { PostData } from './component/lyrice-flash/electron-lyrice'
import { Size } from '@/layout/module'
import { storage } from '@/utils/index'
import { LocalKey } from './sage'

const { get } = storage()

export type Music = SongsDetail

export interface Lyrics {
  time: number
  lyric: string
  duration: number
}

export interface State {
  // audio: AudioType
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
}

export const state: State = {
  // audio: new BackgroundAudio(),
  musicUrl: '',
  musicLyricsOrigin: '',
  musciHistory:
    ((get(LocalKey.MUSIC_HISTORY, {
      parser: 'object'
    }) as unknown) as SongsDetail[]) || [],
  musicStack:
    ((get(LocalKey.MUSIC_HISTORY, {
      parser: 'object'
    }) as unknown) as SongsDetail[]) || [],
  currentTime: 0,
  playing: false,
  canplay: false,
  audioElement: null,
  sourceElement: null,
  visibleFlash: false,
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
  duration: number
  musicLyrics: Lyrics[]
  musicDes: {
    author: string
    title: string
  }
}
