import { Songs as RootSong } from '@/interface/index'

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
  songList: [
    {
      id: -1,
      type: -1,
      playCount: 0,
      trackCount: 0,
      name: '每日歌曲推荐',
      copywriter: '每日歌曲推荐',
      picUrl: '',
      artists: []
    }
  ],
  banners: [],
  runningSwiper: true
}
