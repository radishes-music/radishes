import { PostData } from './components/lyrics-desktop/electron-lyrics'
import { Artists, SongsDetail } from '@/interface/index'
import { AudioEffect } from '@/shared/audio'

export const enum BasicEffect {
  D3 = '3D',
  FADE = 'FADE',
  TENDER = 'TENDER'
}

export const enum PlayMode {
  TURN = 'turn',
  RANDOM = 'random'
}

export const enum Direction {
  NEXT = 'NEXT',
  PREV = 'PREV'
}

export interface Lyrics {
  time: number
  lyric: string
  duration: number
}

export interface FooterState {
  effect: AudioEffect
  playMode: PlayMode
  music?: SongsDetail
  musicUrl: string
  musicUrlLoading: boolean
  musicSourceLoading: boolean
  musicLyricsOrigin: string
  musciHistory: SongsDetail[]
  musicStack: SongsDetail[]
  currentTime: number
  playing: boolean
  canplay: boolean
  audioElement: HTMLAudioElement | null
  visibleFlash: boolean
  electronLyrics: PostData
  duration: number
  volume: number
  lyriceEmbedMinWidth: number
  visibleLyrics: boolean
}

export interface FooterGetter {
  musicDetail: {
    url: string
  } & SongsDetail
  musicLyrics: Lyrics[]
  musicDes: {
    author: Artists[]
    title: string
  }
}

export const enum FooterActions {
  SET_MUSIC = 'SET_MUSIC',
  SET_LOCAL_MUSIC = 'SET_LOCAL_MUSIC',
  SET_MUSIC_DEFAILT = 'SET_MUSIC_DEFAILT',
  SET_MUSIC_LYRICS = 'SET_MUSIC_LYRICS',
  CUTOVER_TRACK = 'CUTOVER_TRACK'
}

export const enum FooterMutations {
  SET_MUSIC_URL = 'SET_MUSIC_SINGLE_URL',
  SET_MUSIC_URL_LOADING = 'SET_MUSIC_URL_LOADING',
  SET_LOCAL_MUSIC_URL = 'SET_LOCAL_MUSIC_URL',
  CLEAR_LOCAL_MUSIC_URL = 'CLEAR_LOCAL_MUSIC_URL',
  PLAY_MUSIC = 'PLAY_MUSIC',
  PAUES_MUSIC = 'PAUES_MUSIC',
  PLAYING = 'PLAYING',
  CURRENT_TIME = 'CURRENT_TIME',
  UPDATE_CURRENT_TIME = 'UPDATE_CURRENT_TIME',
  CAN_PLAY = 'CAN_PLAY',
  SET_VOLUME = 'SET_VOLUME',
  VISIBLE_FLASH = 'VISIBLE_FLASH',
  VISIBLE_EMBED = 'VISIBLE_EMBED',
  SET_PLAYLIST_TO_STACK = 'SET_PLAYLIST_TO_STACK',
  SET_DURATION = 'SET_DURATION',
  PUSH_STACK = 'PUSH_STACK',
  REMOVE_STACK = 'REMOVE_STACK',
  REMOVE_HISTORY = 'REMOVE_HISTORY',
  CLEAR_STACK = 'CLEAR_STACK',
  LYRICS_EMBED_MIN_WIDTH = 'LYRICS_EMBED_MIN_WIDTH',
  SEEKBACKWARD = 'SEEKBACKWARD',
  SEEKFORWARD = 'SEEKFORWARD',
  INIT_EFFECT = 'INIT_EFFECT',
  CHANGE_PLAYMODE = 'CHANGE_PLAYMODE'
}
