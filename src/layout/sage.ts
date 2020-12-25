import { MutationTree } from 'vuex'
import { LayoutActions, LayoutState, LayoutSize } from '@/interface'

export const mutations: MutationTree<LayoutState> = {
  [LayoutActions.CHANGE_WINDOW_SIZE](state, size: LayoutSize) {
    state.rebackSize = state.screenSize
    state.screenSize = size
  }
}
