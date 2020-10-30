import { get } from '@/utils/http'
import { SongsUrl } from '@/interface/index'

export const getSongUrl = async (id: number): Promise<SongsUrl[]> => {
  const data = await get<{ data: SongsUrl[] }>('/api/song/url', {
    id
  })
  return data.data
}
