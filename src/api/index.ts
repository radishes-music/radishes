import { get } from '@/utils/http'
import { SongsBase, SongsDetail } from '@/interface/index'

export const getSongUrl = async (
  id: number | number[]
): Promise<SongsBase[]> => {
  const data = await get<{ data: SongsBase[] }>('/api/song/url', {
    id: typeof id === 'number' ? id : id.join(',')
  })
  return data.data
}

export const getSongDetail = async (
  id: number | number[]
): Promise<SongsDetail[]> => {
  const data = await get<{ songs: SongsDetail[] }>('/api/song/detail', {
    ids: typeof id === 'number' ? id : id.join(',')
  })
  return data.songs
}
