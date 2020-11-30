import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { SongListState, Tags } from './state'
import { Song } from '@/interface/index'
import { getHighqualityPl, getHighqualityTags, getHotTags } from './api/index'

export interface Pagination {
  limit: number
  before: number
  cat: string
}

export const enum SongListMutations {
  SET_SONG_LIST = 'SET_SONG_LIST',
  SET_TAGS = 'SET_TAGS',
  SET_HOT_TAGS = 'SET_HOT_TAGS'
}

export const enum SongListActions {
  SET_ACTION_SONG_LIST = 'SET_ACTION_SONG_LIST',
  SET_ACTION_TAGS = 'SET_ACTION_TAGS',
  SET_ACTION_HOT_TAGS = 'SET_ACTION_HOT_TAGS'
}

export const actions: ActionTree<SongListState, RootState> = {
  async [SongListActions.SET_ACTION_SONG_LIST](
    { commit },
    pagination: Pagination
  ) {
    const result = await getHighqualityPl(pagination)
    commit(SongListMutations.SET_SONG_LIST, result)
  },
  async [SongListActions.SET_ACTION_TAGS]({ commit }) {
    const result = await getHighqualityTags()
    commit(SongListMutations.SET_TAGS, result)
  },
  async [SongListActions.SET_ACTION_HOT_TAGS]({ commit }) {
    const result = await getHotTags()
    commit(SongListMutations.SET_HOT_TAGS, result)
  }
}
export const mutations: MutationTree<SongListState> = {
  [SongListMutations.SET_SONG_LIST](state, songList: Song[]) {
    state.songList = songList
  },
  [SongListMutations.SET_TAGS](state, tags: Tags[]) {
    state.tags = tags
  },
  [SongListMutations.SET_HOT_TAGS](state, tags: Tags[]) {
    state.tagsHot = tags
  }
}
