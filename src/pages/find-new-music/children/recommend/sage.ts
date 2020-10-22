import {
  MutationTree,
  Action,
  ActionContext,
  ActionPayload,
  ActionTree
} from 'vuex'
import { State, Banners, Song } from './state'
import { RootState } from '@/store/index'
import { getSongList, getBanner } from './api/index'

export const enum Mutations {
  SET_BANNERS = 'SET_BANNERS',
  SET_SONG_LIST = 'SET_SONG_LIST'
}

export const enum Actions {
  SET_ACTION_BANNERS = 'SET_ACTION_BANNERS',
  SET_ACTION_SONG_LIST = 'SET_ACTION_SONG_LIST'
}

export const actions: ActionTree<State, RootState> = {
  async [Actions.SET_ACTION_BANNERS]({ commit }) {
    const data = await getBanner(0)
    commit(Mutations.SET_BANNERS, data.banners)
  },
  async [Actions.SET_ACTION_SONG_LIST]({ commit }) {
    const data = await getSongList(10)
    commit(Mutations.SET_SONG_LIST, data.result)
  }
}

export const mutations: MutationTree<State> = {
  [Mutations.SET_BANNERS](state, banners: Banners[]) {
    state.banners = banners
  },
  [Mutations.SET_SONG_LIST](state, song: Song[]) {
    state.songList = song
  }
}
