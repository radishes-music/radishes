import { MutationTree, ActionTree } from 'vuex'
import { SongState } from './state'
import { RootState } from '@/store/index'
import { getPlayList, getAlbumList } from '@/api/index'
import { getRecommendSong } from './api/index'

export enum SongActions {
  SET_ACTION_PLAYLIST = 'SET_ACTION_PLAYLIST',
  SET_ACTION_ALBUMLIST = 'SET_ACTION_ALBUMLIST',
  SET_ACTION_RECOMMEND_SONG = 'SET_ACTION_RECOMMEND_SONG'
}
export enum SongMutations {
  SET_PLAYLIST = 'SET_PLAYLIST',
  SET_ALBUMLIST = 'SET_ALBUMLIST'
}

export const actions: ActionTree<SongState, RootState> = {
  async [SongActions.SET_ACTION_PLAYLIST]({ commit }, id: number) {
    const data = await getPlayList(id)
    commit(SongMutations.SET_PLAYLIST, data)
  },
  async [SongActions.SET_ACTION_ALBUMLIST]({ commit }, id: number) {
    const data = await getAlbumList(id)
    commit(SongMutations.SET_ALBUMLIST, data)
  },
  async [SongActions.SET_ACTION_RECOMMEND_SONG]({ commit }) {
    const data = await getRecommendSong()
    commit(SongMutations.SET_PLAYLIST, {
      tracks: data
    })
  }
}
export const mutations: MutationTree<SongState> = {
  [SongMutations.SET_PLAYLIST](state, playlist: SongState['playlist']) {
    state.playlist = playlist
  },
  [SongMutations.SET_ALBUMLIST](state, { songs, album }) {
    state.albumList.song = songs
    state.albumList.album = album
  }
}
