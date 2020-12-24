import { Artists } from './artists'
import { GlobalBase } from '../app'

export interface Songs extends GlobalBase {
  artists: Artists[]
}

export interface Song extends Songs {
  type: number
  playCount: number
  playcount: number
  trackCount: number
  name: string
  copywriter: string
  picUrl: string
  coverImgUrl: string
}

export interface FreeTrialInfo {
  start: number
  end: number
}

export interface SongsBase {
  id: number
  url: string
  br: number
  size: number
  expi: number
  freeTrialInfo: FreeTrialInfo
}

export interface PlayLists extends GlobalBase {
  playCount: number
  trackCount: number
  highQuality: boolean
  subscribed: boolean
  coverImgUrl: string
}

export interface SongsDetail extends GlobalBase {
  type: 'stack' | 'history'
  alia: string[]
  dt: number // duration
  al: {
    picUrl: string
  } & GlobalBase
  mv: number // mv id
  ar: Artists[]
  lrc: {
    version: number
    lyric: string
  }
  url: string
  copyright: number
  noCopyrightRcmd?: {
    type: number
    typeDesc: string
  }
  fee: number
  no: number
}
