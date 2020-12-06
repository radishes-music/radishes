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
}

export const state: HeaderState = {
  searchSuggest: {}
}
