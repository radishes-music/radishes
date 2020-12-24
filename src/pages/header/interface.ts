import { Albums, Songs, Artists, PlayLists } from '@/interface/index'

export interface SearchSuggest {
  albums?: Albums[]
  artists?: Artists[]
  songs?: Songs[]
  order?: string[]
  playlists?: PlayLists[]
}

export interface HeaderState {
  searchSuggest: SearchSuggest
  themeColor: string
}

export const enum HeaderActions {
  GET_SEARCH_SUGGEST = 'GET_SEARCH_SUGGEST'
}

export const enum HeaderMutations {
  SET_SEARCH_SUGGEST = 'SET_SEARCH_SUGGEST',
  SET_THEME_COLOR = 'SET_THEME_COLOR'
}
