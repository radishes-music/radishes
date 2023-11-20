import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { getArtistList } from './api/index'
import { ArtistsActions, ArtistsMutations, ArtistsState } from '@/interface'

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
