import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { TopListState } from '@/interface'
import { getTopList } from './api/index'
import { TopListActions, TopListMutations } from '@/interface'

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
