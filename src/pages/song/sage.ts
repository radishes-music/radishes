import { MutationTree, ActionTree } from 'vuex'
import { SongState } from './state'
import { RootState } from '@/store/index'
import { getPlayList } from '@/api/index'

export enum Actions {
  GET_PLAYLIST = 'GET_PLAYLIST'
}
export enum Mutations {
  SET_PLAYLIST = 'SET_PLAYLIST'
}

export const actions: ActionTree<SongState, RootState> = {
  async [Actions.GET_PLAYLIST]({ commit }, id: number) {
    const data = await getPlayList(id)
    commit(Mutations.SET_PLAYLIST, data)
  }
}
export const mutations: MutationTree<SongState> = {
  [Mutations.SET_PLAYLIST](state, playlist: SongState['playlist']) {
    state.playlist = playlist
  }
}
