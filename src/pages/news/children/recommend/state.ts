import { Song } from '@/interface/index'

export interface Banners {
  imageUrl: string
  typeTitle: string
  targetId: string
}

export interface RecommendState {
  banners: Banners[]
  songList: Song[]
  runningSwiper: boolean
}

export const state: RecommendState = {
  songList: [
    {
      id: -1,
      type: -1,
      playCount: 0,
      trackCount: 0,
      name: '每日歌曲推荐',
      copywriter: '每日歌曲推荐',
      picUrl: '',
      coverImgUrl: '',
      artists: []
    }
  ],
  banners: [],
  runningSwiper: true
}
