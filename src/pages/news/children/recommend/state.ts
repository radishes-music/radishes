import { RecommendState } from '@/interface'

export const state: RecommendState = {
  songList: [
    {
      id: -1,
      type: -1,
      playCount: 0,
      playcount: 0,
      trackCount: 0,
      name: '每日歌曲推荐',
      copywriter: '每日歌曲推荐',
      picUrl: '',
      coverImgUrl: '',
      description: '',
      artists: []
    }
  ],
  banners: [],
  runningSwiper: true
}
