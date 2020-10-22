import { get } from '@/utils/http'

export const getRecommend = () => {
  return get('/api/recommend/resource')
}

export const getBanner = (type: number) => {
  return get('/api/banner', {
    type
  })
}

export const getSongList = (limit = 30) => {
  return get('/api/personalized', {
    limit
  })
}
