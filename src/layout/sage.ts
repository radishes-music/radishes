import { MutationTree } from 'vuex'
import { State, Size } from './state'
export const enum LayoutActions {
  CHANGE_WINDOW_SIZE = 'CHANGE_WINDOW_SIZE'
}

export interface Mutations {
  [LayoutActions.CHANGE_WINDOW_SIZE]: (state: State, size: Size) => void
}

export const actions = {}
export const mutations: MutationTree<State> = {
  [LayoutActions.CHANGE_WINDOW_SIZE](state, size: Size) {
    state.rebackSize = state.screenSize
    state.screenSize = size
  }
}
