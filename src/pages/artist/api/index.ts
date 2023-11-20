import { get } from '@/utils/http'
import { Artists, Artist, Album, Desc } from '@/interface/index'

const artistCache = new Map()

export const getArtist = async (id: string): Promise<Artist> => {
  if (artistCache.has(id)) {
    return artistCache.get(id)
  }
  const data = await get<{ data: { artist: Artist } }>('/api/artist/detail', {
    id
  })
  artistCache.set(id, data.data.artist)
  return data.data.artist
}

export const getArtistAlbums = async (id: string): Promise<Album[]> => {
  const data = await get<{ hotAlbums: Album[] }>('/api/artist/album', {
    id
  })
  return data.hotAlbums
}

export const getArtistDesc = async (
  id: string
): Promise<{ introduction: Desc[]; briefDesc: string }> => {
  const data = await get<{ introduction: Desc[]; briefDesc: string }>(
    '/api/artist/desc',
    {
      id
    }
  )
  return data
}

export const getArtistSimi = async (id: string): Promise<Artists[]> => {
  const data = await get<{ artists: Artists[] }>('/api/simi/artist', {
    id
  })
  return data.artists
}
