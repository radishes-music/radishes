import { Albums, Song, Artists } from '@/interface/index'

export interface SearchSuggest {
  albums?: Albums[]
  artists?: Artists[]
  songs?: Song[]
  order?: string[]
}

export interface State {
  searchSuggest: SearchSuggest
}

export const state: State = {
  searchSuggest: {}
}
