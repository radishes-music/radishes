import { ActionTree, MutationTree } from 'vuex'
import { searchSuggest } from './api/search'
import { HeaderState, SearchSuggest } from './state'
import { RootState } from '@/store/index'

export const enum Actions {
  GET_SEARCH_SUGGEST = 'GET_SEARCH_SUGGEST'
}

export const enum Mutations {
  SET_SEARCH_SUGGEST = 'SET_SEARCH_SUGGEST',
  SET_THEME_COLOR = 'SET_THEME_COLOR'
}

export const actions: ActionTree<HeaderState, RootState> = {
  async [Actions.GET_SEARCH_SUGGEST]({ commit }, keywords: string) {
    const result = await searchSuggest(keywords)
    commit(Mutations.SET_SEARCH_SUGGEST, result)
  }
}
export const mutations: MutationTree<HeaderState> = {
  [Mutations.SET_SEARCH_SUGGEST](state, payload: SearchSuggest) {
    state.searchSuggest = payload
  },
  [Mutations.SET_THEME_COLOR](state, payload: string) {
    state.themeColor = payload
  }
}
