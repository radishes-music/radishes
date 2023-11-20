import { get } from '@/utils/http'
import { Banners } from '../../../interface'
import { Song } from '@/interface/index'

export const getRecommend = () => {
  return get('/api/recommend/resource')
}

export const getBanner = async (type: number): Promise<Banners> => {
  const data = await get<{ banners: Banners }>('/api/banner', {
    type
  })
  return data.banners
}

export const getSongList = async (limit = 30): Promise<Song[]> => {
  const data = await get<{ result: Song[] }>('/api/personalized', {
    limit
  })
  return data.result
}

export const getRecommendSongList = async (): Promise<Song[]> => {
  const data = await get<{ recommend: Song[] }>(
    '/api/recommend/resource',
    {},
    {
      auths: true
    }
  )
  return data.recommend.map(item => ({
    ...item,
    playCount: item.playcount
  }))
}
