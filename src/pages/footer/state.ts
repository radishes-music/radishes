import { Artists, Albums, SongsDetail } from '@/interface/index'

export interface Music {
  id: number
  name: string
  url: string
  picUrl: string
  artists: Artists
  albums: Albums
}

export interface State {
  music?: SongsDetail
  musicUrl: string
  musciHistory: Music[]
  musicStack: Music[]
  playing: boolean
  canplay: boolean
  currentTime: number
  audioElement: HTMLAudioElement | null
  sourceElement: HTMLSourceElement | null
}

export const state: State = {
  musicUrl: '',
  musciHistory: [],
  musicStack: [],
  playing: false,
  canplay: false,
  currentTime: 0,
  audioElement: new Audio(),
  sourceElement: null
}

export interface Getter {
  musicDetail: {
    url: string
  } & SongsDetail
}
