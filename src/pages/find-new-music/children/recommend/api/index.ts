import { get } from '@/utils/http'
import { Banners, Song } from '../state'

export const getRecommend = () => {
  return get('/api/recommend/resource')
}

export const getBanner = async (type: number): Promise<Banners> => {
  const data = await get<{ banners: Banners }>('/api/banner', {
    type
  })
  return data.banners
}

export const getSongList = async (limit = 30): Promise<Song> => {
  const data = await get<{ result: Song }>('/api/personalized', {
    limit
  })
  return data.result
}
