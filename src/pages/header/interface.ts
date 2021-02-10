import { SearchSuggest } from '@/interface'

export interface QQ {
  id: { song: number; file: number }
  name: string
  duration: number
  album: { id: string; name: string }
  artists: { id: number; name: string; alias: unknown[]; img1v1Url: string }[]
}

export interface HeaderState {
  searchSuggest: Partial<SearchSuggest>
  themeColor: string
}

export const enum HeaderActions {
  GET_SEARCH_SUGGEST = 'GET_SEARCH_SUGGEST'
}

export const enum HeaderMutations {
  SET_SEARCH_SUGGEST = 'SET_SEARCH_SUGGEST',
  SET_THEME_COLOR = 'SET_THEME_COLOR'
}
