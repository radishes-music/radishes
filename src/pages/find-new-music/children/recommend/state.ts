import { Song as RootSong } from '@/interface/index'

export interface Song extends RootSong {
  type: number
  playCount: number
  trackCount: number
  name: string
  copywriter: string
  picUrl: string
}

export interface Banners {
  imageUrl: string
  typeTitle: string
  targetId: string
}

export interface State {
  banners: Banners[]
  songList: Song[]
  runningSwiper: boolean
}

export const state: State = {
  songList: [],
  banners: [],
  runningSwiper: true
}
