import { ActionTree, MutationTree } from 'vuex'
import { RootState } from '@/store/index'
import {
  Artist,
  ArtistState,
  ArtistActions,
  ArtistMutations
} from '@/interface'
import {
  getArtist,
  getArtistAlbums,
  getArtistDesc,
  getArtistSimi
} from './api/index'

export const actions: ActionTree<ArtistState, RootState> = {
  async [ArtistActions.SET_ACTION_ARTIST_DETAIL]({ commit }, id: string) {
    const data = await getArtist(id)
    commit(ArtistMutations.SET_ARTIST_DETAIL, data)
  },
  async [ArtistActions.SET_ACTION_ARTIST_ALBUM]({ commit }, id: string) {
    const data = await getArtistAlbums(id)
    commit(ArtistMutations.SET_ARTIST_ALBUM, data)
  },
  async [ArtistActions.SET_ACTION_ARTIST_DESC]({ commit }, id: string) {
    const data = await getArtistDesc(id)
    commit(ArtistMutations.SET_ARTIST_DESC, data)
  },
  async [ArtistActions.SET_ACTION_ARTIST_SIMI]({ commit }, id: string) {
    const data = await getArtistSimi(id)
    commit(ArtistMutations.SET_ARTIST_SIMI, data)
  }
}
export const mutations: MutationTree<ArtistState> = {
  [ArtistMutations.SET_ARTIST_DETAIL](state, artist: Artist) {
    state.artist = artist
  },
  [ArtistMutations.SET_ARTIST_ALBUM](state, album) {
    state.album = album
  },
  [ArtistMutations.SET_ARTIST_DESC](state, { introduction, briefDesc }) {
    state.introduction = introduction
    state.briefDesc = briefDesc
  },
  [ArtistMutations.SET_ARTIST_SIMI](state, simi) {
    state.simi = simi
  }
}
