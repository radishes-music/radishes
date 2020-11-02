import { Artists } from './artists'
import { GlobalBase } from '../app'

export interface Songs extends GlobalBase {
  artists: Artists[]
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

export interface SongsDetail extends GlobalBase {
  alia: string[]
  dt: number // duration
  al: {
    picUrl: string
  }
  ar: Record<string, string> & GlobalBase
  mv: number // mv id
}
