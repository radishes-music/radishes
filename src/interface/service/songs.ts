import { Artists } from './artists'
import { GlobalBase } from '../app'
import { Albums } from './albums'

export interface Songs extends GlobalBase {
  artists: Artists[]
  duration?: number
  album?: Albums
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
  specialType?: number
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
  type: 'stack' | 'history' | 'download'
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
  size: number
}
