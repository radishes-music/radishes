import { ActionTree, MutationTree, ActionContext } from 'vuex'
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

type IActions<T = ActionContext<ArtistState, RootState>> = {
  [k in ArtistActions]: (k: T, payload: string) => void
}

export const actions: IActions = {
  async [ArtistActions.SET_ACTION_ARTIST_DETAIL]({ commit }, id) {
    const data = await getArtist(id)
    commit(ArtistMutations.SET_ARTIST_DETAIL, data)
  },
  async [ArtistActions.SET_ACTION_ARTIST_ALBUM]({ commit }, id) {
    const data = await getArtistAlbums(id)
    commit(ArtistMutations.SET_ARTIST_ALBUM, data)
  },
  async [ArtistActions.SET_ACTION_ARTIST_DESC]({ commit }, id) {
    const data = await getArtistDesc(id)
    commit(ArtistMutations.SET_ARTIST_DESC, data)
  },
  async [ArtistActions.SET_ACTION_ARTIST_SIMI]({ commit }, id) {
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
