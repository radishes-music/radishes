import { ActionTree, MutationTree } from 'vuex'
import { searchSuggest } from '@/api/search'
import {
  HeaderState,
  SearchSuggest,
  HeaderActions,
  HeaderMutations
} from '@/interface'
import { RootState } from '@/store/index'

export const actions: ActionTree<HeaderState, RootState> = {
  async [HeaderActions.GET_SEARCH_SUGGEST]({ commit }, keywords: string) {
    const result = await searchSuggest(keywords)
    commit(HeaderMutations.SET_SEARCH_SUGGEST, result)
  }
}
export const mutations: MutationTree<HeaderState> = {
  [HeaderMutations.SET_SEARCH_SUGGEST](state, payload: SearchSuggest) {
    state.searchSuggest = payload
  },
  [HeaderMutations.SET_THEME_COLOR](state, payload: string) {
    state.themeColor = payload
  }
}
