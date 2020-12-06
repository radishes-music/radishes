import { get } from '@/utils/http'
import { SearchSuggest } from '../state'

interface QQ {
  id: { song: number; file: number }
  name: string
  duration: number
  album: { id: string; name: string }
  artists: { id: number; name: string; alias: unknown[]; img1v1Url: string }[]
}

export const searchSuggest = async (key: string): Promise<SearchSuggest> => {
  const data = await get<{ result: SearchSuggest }>('/api/search/suggest', {
    keywords: key
  })
  const songs = await get<{
    result: {
      songs: SearchSuggest['songs']
    }
  }>('/api/search', {
    keywords: key
  })
  data.result.songs = songs.result.songs
  return data.result
}
