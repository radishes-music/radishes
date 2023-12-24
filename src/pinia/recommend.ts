import type { NewSong, Song } from '@/interface'
import type { Banners } from '@/pages'

import { defineStore } from 'pinia'
import {
  getBanner,
  getDailyRecommendSongList,
  getRecommendSongList,
  getRecommendNewsong
} from '@/pages/findmusic/recommend/api'
import { wrapperReFetch } from '@/utils'

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

export const useRecommendStore = defineStore<
  'songList',
  {
    banners: Banners[]
    songList: Song[]
    dailySongList: Song[]
    runningSwiper: boolean
    songs: NewSong[]
  },
  {},
  {
    getRecommendBanner: () => Promise<void>
    getRecommendSongList: () => Promise<void>
    getDailyRecommendSongList: () => Promise<void>
    getRecommendNewSong: () => Promise<void>
  }
>('songList', {
  state: () => ({
    banners: [],
    songList: [],
    songs: [],
    dailySongList: [],
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
    },
    async getRecommendNewSong() {
      this.songs = await wrapperReFetch(getRecommendNewsong)
      console.log(this.songs)
    }
  }
})
