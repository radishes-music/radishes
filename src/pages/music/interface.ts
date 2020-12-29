import { SongsDetail } from '@/interface'

export interface LocalMusicState {
  normalPath: string
  localMusic: SongsDetail[]
}

export const enum LocalMusicActions {}

export const enum LocalMusicMutations {
  SET_NORMAL_PATH = 'SET_NORMAL_PATH',
  SET_LOCAL_MUSIC = 'SET_LOCAL_MUSIC'
}
