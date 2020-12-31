import { SongsDetail } from '@/interface'

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
