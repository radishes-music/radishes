import { Artists } from './artists'

export interface Songs {
  id: number
  name: string
  artists: Artists[]
}

export interface FreeTrialInfo {
  start: number
  end: number
}

export interface SongsUrl {
  id: number
  url: string
  br: number
  size: number
  expi: number
  freeTrialInfo: FreeTrialInfo
}
