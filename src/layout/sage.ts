import { MutationTree } from 'vuex'
import { LayoutMutations, LayoutState, LayoutSize } from '@/interface'

export const mutations: MutationTree<LayoutState> = {
  [LayoutMutations.CHANGE_WINDOW_SIZE](state, size: LayoutSize) {
    state.rebackSize = state.screenSize
    state.screenSize = size
  }
}
