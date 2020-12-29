import { ActionTree, MutationTree } from 'vuex'
import { LocalMusicState, LocalMusicMutations, SongsDetail } from '@/interface'
import { RootState } from '@/store/index'

export const actions: ActionTree<LocalMusicState, RootState> = {}

export const mutations: MutationTree<LocalMusicState> = {
  [LocalMusicMutations.SET_NORMAL_PATH](state, path: string) {
    state.normalPath = path
  },
  [LocalMusicMutations.SET_LOCAL_MUSIC](state, songs: SongsDetail[]) {
    state.localMusic = songs
  }
}
