import { SongsDetail } from '@/interface/index'
import { LayoutSize } from '@/interface'
import { PlayMode } from './interface'

export type Music = SongsDetail

export const state = {
  effect: null,
  playMode: PlayMode.TURN,
  musicUrl: '',
  musicLyricsOrigin: '',
  musciHistory: [],
  musicStack: [],
  currentTime: 0,
  volume: 1,
  playing: false,
  canplay: false,
  audioElement: null,
  visibleFlash: false,
  duration: 0,
  lyriceEmbedMinWidth: 0,
  electronLyrice: {
    screenSize: LayoutSize.SM,
    visibleFlash: true,
    lyrice: [],
    index: 0,
    playing: true,
    flashMagic: {
      animationDuration: ''
    }
  }
}
