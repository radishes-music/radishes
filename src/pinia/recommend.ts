import type { Banners } from '@/pages'
import {
  getBanner,
  getDailyRecommendSongList,
  getRecommendSongList,
  getRecommendNewsong
} from '@/pages/recommend/api'
import { wrapperReFetch } from '@/utils'
import { defineStore } from 'pinia'

const dailyAlbum: any = {
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

export const useRecommend = defineStore<
  'songList',
  {
    banners: Banners[]
    songList: any
    dailySongList: any
    runningSwiper: boolean
    songs: any
  },
  {},
  {
    getRecommendBanner: any
    getRecommendSongList: any
    getDailyRecommendSongList: any
    getRecommendSong: any
  }
>('songList', {
  state: () => ({
    banners: [],
    songList: [],
    songs: [],
    dailySonglist: [],
    runningSwiper: false
  }),
  getters: {},
  actions: {
    async getRecommendBanner() {
      this.banners = await wrapperReFetch<Banners[]>(() => getBanner(0))
    },
    async getRecommendSongList() {
      const list: any = await wrapperReFetch(() => getRecommendSongList(8))
      this.songList = list
    },
    async getDailyRecommendSongList() {
      const list = await wrapperReFetch<any[]>(getDailyRecommendSongList)
      this.dailySongList = [dailyAlbum, ...list]
      console.log(this.dailySongList)
    },
    async getRecommendSong() {
      this.songs = await wrapperReFetch(getRecommendNewsong)
    }
  }
})
