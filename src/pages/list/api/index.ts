import { get } from '@/utils/http'
import { Song } from '@/interface/index'

export const getRecommendSong = async (): Promise<Song> => {
  const data = await get<{ data: { dailySongs: Song } }>('/api/recommend/songs')
  return data.data.dailySongs
}
