import { MutationTree } from 'vuex'
import { State } from './state'

export const enum Mutations {
  IS_SHOW_COVER_CONTAINER = 'IS_SHOW_COVER_CONTAINER'
}

export const mutations: MutationTree<State> = {
  [Mutations.IS_SHOW_COVER_CONTAINER](state, show: boolean) {
    state.isCoverContainer = show
  }
}
export const actions = {}
