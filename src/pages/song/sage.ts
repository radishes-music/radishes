import { MutationTree, ActionTree } from 'vuex'
import { State } from './state'
import { RootState } from '@/store/index'
import { getPlayList } from './api/index'

export enum Actions {
  GET_PLAYLIST = 'GET_PLAYLIST'
}
export enum Mutations {
  SET_PLAYLIST = 'SET_PLAYLIST'
}

export const actions: ActionTree<State, RootState> = {
  async [Actions.GET_PLAYLIST]({ commit }, id: number) {
    const data = await getPlayList(id)
    commit(Mutations.SET_PLAYLIST, data)
  }
}
export const mutations: MutationTree<State> = {
  [Mutations.SET_PLAYLIST](state, playlist: State['playlist']) {
    state.playlist = playlist
  }
}
