import { SongsDetail, Artists } from '@/interface'

export interface LocalMusicDetail {
  buffer: Buffer
  path: string
  picture: { data: Buffer; type: string; format: string }[]
  pic: string
  comment: string[]
  ar: Artists[]
  artists: Artists[]
  al: string
  id: number
  name: string
}

export interface LocalMusicPath {
  name: string
  path: string
  check: boolean
}

export interface LocalMusicState {
  normalPath: string
  localMusic: SongsDetail[]
  localPath: LocalMusicPath[]
}

export const enum LocalMusicActions {}

export const enum LocalMusicMutations {
  SET_NORMAL_PATH = 'SET_NORMAL_PATH',
  SET_LOCAL_MUSIC = 'SET_LOCAL_MUSIC',
  SET_LOCAL_PATH = 'SET_LOCAL_PATH',
  SET_LOCAL_INCREMENT_PATH = 'SET_LOCAL_INCREMENT_PATH'
}
