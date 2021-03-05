import { get } from '@/utils/http'
import { SearchSuggest, SearchType, Pagination } from '@/interface'

interface SearchApiResult {
  [SearchType.SONG]: {
    songs: SearchSuggest['songs']
    songCount: number
  }
  [SearchType.SONG_LIST]: {
    playlists: SearchSuggest['playlists']
    playlistCount: number
  }
  [SearchType.ALBUM]: {
    albums: SearchSuggest['albums']
    albumCount: number
  }
  [SearchType.ARTIST]: {
    artists: SearchSuggest['artists']
    artistCount: number
  }
  [SearchType.LYRICE]: {
    songs: SearchSuggest['lyrice']
    songCount: number
  }
}

export const search = async <T extends keyof SearchApiResult>(
  key: string,
  type: T,
  pagination: Pagination
): Promise<SearchApiResult[T]> => {
  const songs = await get<{
    result: SearchApiResult[T]
  }>('/api/search', {
    keywords: key,
    type: type,
    ...pagination
  })

  return songs.result
}

export const searchSuggest = async (key: string): Promise<SearchSuggest> => {
  const data = await get<{ result: SearchSuggest }>('/api/search/suggest', {
    keywords: key
  })
  return data.result
}
