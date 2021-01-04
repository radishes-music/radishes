import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import { SettingMutations, SettingState, PlaySource } from '@/interface'

export const actions: ActionTree<SettingState, RootState> = {}

export const mutations: MutationTree<SettingState> = {
  [SettingMutations.SET_SOURCE](state, source: PlaySource[]) {
    state.source = source
  },
  [SettingMutations.SET_BIT_RATE](state, bit: number) {
    state.bitRate = bit
  }
}
