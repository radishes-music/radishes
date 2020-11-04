import { Artists, Albums, SongsDetail } from '@/interface/index'
import { AudioType, BackgroundAudio } from './component/music-controller/audio'

export interface Music {
  id: number
  name: string
  url: string
  picUrl: string
  artists: Artists
  albums: Albums
}

export interface State {
  audio: AudioType
  music?: SongsDetail
  musicUrl: string
  musciHistory: Music[]
  musicStack: Music[]
  currentTime: number
  playing: boolean
  canplay: boolean
  audioElement: HTMLAudioElement | null
  sourceElement: HTMLSourceElement | null
}

export const state: State = {
  audio: new BackgroundAudio(),
  musicUrl: '',
  musciHistory: [],
  musicStack: [],
  currentTime: 0,
  playing: false,
  canplay: false,
  audioElement: new Audio(),
  sourceElement: null
}

export interface Getter {
  musicDetail: {
    url: string
  } & SongsDetail
  currentTime: number
  volume: number
  duration: number
}
