import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { SearchMutations, SearchState } from '@/interface'

export const actions: ActionTree<SearchState, RootState> = {}

export const mutations: MutationTree<SearchState> = {
  [SearchMutations.SET_SEARCH_TITLE](state, txt) {
    state.searchTitle = txt
  }
}
