import { RecommendState } from '@/interface'

export const state: RecommendState = {
  songList: [
    {
      id: -1,
      type: -1,
      playCount: 0,
      playcount: 0,
      trackCount: 0,
      name: j18n.load('src__pages__news__children__recommend__state___10'),
      copywriter: j18n.load(
        'src__pages__news__children__recommend__state___11'
      ),
      picUrl: '',
      coverImgUrl: '',
      description: '',
      artists: []
    }
  ],
  banners: [],
  runningSwiper: true
}
