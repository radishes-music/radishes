import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { TopListState } from './state'
import { getTopList } from './api/index'

export const enum TopListMutations {
  SET_TOP_LIST = 'SET_TOP_LIST'
}

export const enum TopListActions {
  SET_ACTION_TOP_LIST = 'SET_ACTION_TOP_LIST'
}

export const actions: ActionTree<TopListState, RootState> = {
  async [TopListActions.SET_ACTION_TOP_LIST]({ commit }) {
    const data = await getTopList()
    commit(TopListMutations.SET_TOP_LIST, data)
  }
}
export const mutations: MutationTree<TopListState> = {
  [TopListMutations.SET_TOP_LIST](state, data) {
    state.top = data.list
    state.artistTop = data.artistToplist
  }
}
