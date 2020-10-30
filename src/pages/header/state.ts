import { Albums, Songs, Artists } from '@/interface/index'

export interface SearchSuggest {
  albums?: Albums[]
  artists?: Artists[]
  songs?: Songs[]
  order?: string[]
}

export interface State {
  searchSuggest: SearchSuggest
}

export const state: State = {
  searchSuggest: {}
}
