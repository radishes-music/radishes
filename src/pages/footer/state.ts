import { Artists, Albums, SongsDetail } from '@/interface/index'
import { AudioType, BackgroundAudio } from './component/music-controller/audio'
import { PostData } from './component/lyrice-flash/electron-lyrice'
import { Size } from '@/layout/module'

export interface Music {
  id: number
  name: string
  url: string
  picUrl: string
  artists: Artists
  albums: Albums
}

export interface Lyrics {
  time: number
  lyric: string
  duration: number
}

export interface State {
  audio: AudioType
  music?: SongsDetail
  musicUrl: string
  musicLyricsOrigin: string
  musciHistory: Music[]
  musicStack: Music[]
  currentTime: number
  playing: boolean
  canplay: boolean
  audioElement: HTMLAudioElement | null
  sourceElement: HTMLSourceElement | null
  visibleFlash: boolean
  electronLyrice: PostData
}

export const state: State = {
  audio: new BackgroundAudio(),
  musicUrl: '',
  musicLyricsOrigin: '',
  musciHistory: [],
  musicStack: [],
  currentTime: 0,
  playing: false,
  canplay: false,
  audioElement: new Audio(),
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
