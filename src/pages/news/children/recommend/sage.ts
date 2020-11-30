import { MutationTree, ActionTree } from 'vuex'
import { RecommendState, Banners } from './state'
import { RootState } from '@/store/index'
import { getSongList, getBanner } from './api/index'
import { Song } from '@/interface/index'

export const enum RecommendMutations {
  SET_BANNERS = 'SET_BANNERS',
  SET_SONG_LIST = 'SET_SONG_LIST',
  SET_SWIPER_RINNING = 'SET_SWIPER_RINNING'
}

export const enum RecommendActions {
  SET_ACTION_BANNERS = 'SET_ACTION_BANNERS',
  SET_ACTION_SONG_LIST = 'SET_ACTION_SONG_LIST'
}

export const actions: ActionTree<RecommendState, RootState> = {
  async [RecommendActions.SET_ACTION_BANNERS]({ commit }) {
    const banners = await getBanner(0)
    commit(RecommendMutations.SET_BANNERS, banners)
  },
  async [RecommendActions.SET_ACTION_SONG_LIST]({ commit }) {
    const result = await getSongList(14)
    commit(RecommendMutations.SET_SONG_LIST, result)
  }
}

export const mutations: MutationTree<RecommendState> = {
  [RecommendMutations.SET_BANNERS](state, banners: Banners[]) {
    state.banners = banners
  },
  [RecommendMutations.SET_SONG_LIST](state, song: Song[]) {
    state.songList = state.songList.slice(0, 1).concat(song)
  },
  [RecommendMutations.SET_SWIPER_RINNING](state, running: boolean) {
    state.runningSwiper = running
  }
}
