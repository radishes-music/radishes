import { get } from '@/utils/http'
import { Top } from '../state'

export const getTopList = async <
  T extends {
    list: Top[]
    artistToplist: Top
  }
>(): Promise<T> => {
  const data = await get<T>('/api/toplist/detail')
  return data
}
