import { MutationTree } from 'vuex'
import { MainState, MainMutations } from '@/interface'

export const mutations: MutationTree<MainState> = {
  [MainMutations.IS_SHOW_COVER_CONTAINER](state, show: boolean) {
    state.isCoverContainer = show
  }
}
