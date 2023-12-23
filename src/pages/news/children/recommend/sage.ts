import { MutationTree, ActionTree } from 'vuex'
import {
  RecommendState,
  Banners,
  RecommendActions,
  RecommendMutations
} from '@/interface'
import { RootState } from '@/store/index'
import { getSongList, getBanner, getRecommendSongList } from './api/index'
import { Song } from '@/interface/index'
import { wrapperReFetch } from '@/utils'

export const actions: ActionTree<RecommendState, RootState> = {
  async [RecommendActions.SET_ACTION_BANNERS]({ commit }) {
    const banners = await wrapperReFetch(() => getBanner(0))
    commit(RecommendMutations.SET_BANNERS, banners)
  },
  async [RecommendActions.SET_ACTION_SONG_LIST]({ commit }) {
    const result = await wrapperReFetch(() => getSongList(14))
    commit(RecommendMutations.SET_SONG_LIST, result)
  },
  async [RecommendActions.SET_ACTION_RECOMMEND_SONG_LIST]({ commit }) {
    const result = await wrapperReFetch(getRecommendSongList)
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
