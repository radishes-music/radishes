import { MutationTree, ActionTree } from 'vuex'
import { State, Banners, Song } from './state'
import { RootState } from '@/store/index'
import { getSongList, getBanner } from './api/index'

export const enum Mutations {
  SET_BANNERS = 'SET_BANNERS',
  SET_SONG_LIST = 'SET_SONG_LIST',
  SET_SWIPER_RINNING = 'SET_SWIPER_RINNING'
}

export const enum Actions {
  SET_ACTION_BANNERS = 'SET_ACTION_BANNERS',
  SET_ACTION_SONG_LIST = 'SET_ACTION_SONG_LIST'
}

export const actions: ActionTree<State, RootState> = {
  async [Actions.SET_ACTION_BANNERS]({ commit }) {
    const banners = await getBanner(0)
    commit(Mutations.SET_BANNERS, banners)
  },
  async [Actions.SET_ACTION_SONG_LIST]({ commit }) {
    const result = await getSongList(14)
    commit(Mutations.SET_SONG_LIST, result)
  }
}

export const mutations: MutationTree<State> = {
  [Mutations.SET_BANNERS](state, banners: Banners[]) {
    state.banners = banners
  },
  [Mutations.SET_SONG_LIST](state, song: Song[]) {
    state.songList = state.songList.slice(0, 1).concat(song)
  },
  [Mutations.SET_SWIPER_RINNING](state, running: boolean) {
    state.runningSwiper = running
  }
}
