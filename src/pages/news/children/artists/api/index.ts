import { get } from '@/utils/http'
import { Artist } from '@/interface'

export const getArtistList = async (params: unknown): Promise<Artist[]> => {
  const data = await get<{ artists: Artist[] }>('/api/artist/list', params)
  return data.artists
}
