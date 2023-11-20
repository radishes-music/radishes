import { get } from '@/utils/http'
import { Song, PaginationHighquality, Catlists, Tags } from '@/interface/index'

export const getHighqualityPl = async (
  pagination: PaginationHighquality
): Promise<Song[]> => {
  const data = await get<{ playlists: Song[] }>(
    '/api/top/playlist/highquality',
    pagination
  )
  return data.playlists
}

export const getHighqualityTags = async (): Promise<Tags[]> => {
  const data = await get<{ tags: Tags[] }>('/api/playlist/highquality/tags')
  return data.tags
}

export const getHotTags = async (): Promise<Tags[]> => {
  const data = await get<{ tags: Tags[] }>('/api/playlist/hot')
  return data.tags
}

export const getCatlist = async (): Promise<Catlists> => {
  return await get<Catlists>('/api/playlist/catlist')
}
