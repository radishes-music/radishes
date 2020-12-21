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

export const state: HeaderState = {
  searchSuggest: {},
  themeColor: '#4a6eef'
}
