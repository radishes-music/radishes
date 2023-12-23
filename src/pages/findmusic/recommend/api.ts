import { get } from '@/utils/http'
import { Banners } from '@/interface'
import { Song } from '@/interface/index'

export const getBanner = async (type: number): Promise<Banners[]> => {
  const data = await get<{ banners: Banners[] }>('/api/banner', {
    type
  })
  return data.banners
}

export const getRecommendSongList = async (limit = 30): Promise<Song[]> => {
  const data = await get<{ result: Song[] }>('/api/personalized', {
    limit
  })
  return data.result
}

export const getDailyRecommendSongList = async () => {
  const data = await get<{ recommend: Song[] }>(
    '/api/recommend/resource',
    { limit: 10 },
    {
      auths: true
    }
  )
  return data.recommend.map(item => ({
    ...item,
    playCount: item.playcount
  }))
}

export const getRecommendNewsong = async (): Promise<any> => {
  const data = await get<any>('/api/personalized/newsong')
  return data.result
}
