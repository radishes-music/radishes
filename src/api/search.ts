import { get } from '@/utils/http'
import { SearchSuggest, SearchType, Pagination } from '@/interface'

interface SearchApiResult {
  [SearchType.SONG]: {
    songs: SearchSuggest['songs']
    songCount: number
  }
  [SearchType.PLAY_LIST]: {
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
  [SearchType.LYRICS]: {
    songs: SearchSuggest['lyrics']
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

export const getSearchDefaultKeyword = () =>
  get<{ data: { realkeyword: string } }>('/api/search/default')

export const getSearchHotKeywords = () =>
  get<{
    data: {
      searchWord: string
      score: number
      content: string
      source: string
      iconType: number
      iconUrl: string
      url: string
      alg: string
    }[]
  }>('/api/search/hot/detail')
