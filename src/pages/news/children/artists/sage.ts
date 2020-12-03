import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { ArtistsState } from './state'
import { getArtistList } from './api/index'

export const enum ArtistsMutations {
  SET_ARTISTS = 'SET_ARTISTS'
}

export const enum ArtistsActions {
  SET_ACTION_ARTISTS = 'SET_ACTION_ARTISTS'
}

export const actions: ActionTree<ArtistsState, RootState> = {
  async [ArtistsActions.SET_ACTION_ARTISTS]({ commit }, params) {
    const data = await getArtistList(params)
    commit(ArtistsMutations.SET_ARTISTS, data)
  }
}
export const mutations: MutationTree<ArtistsState> = {
  [ArtistsMutations.SET_ARTISTS](state, artists) {
    if (artists.length) {
      state.completed = false
      state.artists = artists
    } else {
      state.completed = true
    }
  }
}
