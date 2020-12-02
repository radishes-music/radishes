import { get } from '@/utils/http'
import { SongsBase, SongsDetail, SongInteface } from '@/interface/index'

export const getSongUrl = async (
  id: number | number[]
): Promise<SongsBase[]> => {
  const data = await get<{ data: SongsBase[] }>('/api/song/url', {
    id: typeof id === 'number' ? id : id.join(','),
    br: 3.2e5
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

export const getPlayList = async (
  id: number
): Promise<SongInteface.SongState['playlist'][]> => {
  const data = await get<{ playlist: SongInteface.SongState['playlist'][] }>(
    '/api/playlist/detail',
    {
      id
    }
  )
  return data.playlist
}
