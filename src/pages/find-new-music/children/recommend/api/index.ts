import { get } from '@/utils/http'

export const getRecommend = () => {
  return get('/api/recommend/resource')
}

export const getBanner = (type: number) => {
  return get('/api/banner', {
    type
  })
}
