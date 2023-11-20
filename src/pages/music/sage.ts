import { ActionTree, MutationTree } from 'vuex'
import {
  LocalMusicState,
  LocalMusicMutations,
  SongsDetail,
  LocalMusicPath
} from '@/interface'
import { RootState } from '@/store/index'

export const actions: ActionTree<LocalMusicState, RootState> = {}

export const mutations: MutationTree<LocalMusicState> = {
  [LocalMusicMutations.SET_NORMAL_PATH](state, path: string) {
    state.normalPath = path
  },
  [LocalMusicMutations.SET_LOCAL_MUSIC](state, songs: SongsDetail[]) {
    state.localMusic = songs
  },
  [LocalMusicMutations.SET_LOCAL_PATH](state, paths: LocalMusicPath[]) {
    state.localPath = paths
  },
  [LocalMusicMutations.SET_LOCAL_INCREMENT_PATH](state, path: LocalMusicPath) {
    state.localPath.push(path)
  }
}
