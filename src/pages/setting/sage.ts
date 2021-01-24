import { MutationTree, ActionTree } from 'vuex'
import { RootState } from '@/store/index'
import {
  SettingMutations,
  SettingState,
  PlaySource,
  BasicEffect
} from '@/interface'
import { useFooterModule } from '@/modules'

export const actions: ActionTree<SettingState, RootState> = {}

export const mutations: MutationTree<SettingState> = {
  [SettingMutations.SET_SOURCE](state, source: PlaySource[]) {
    state.source = source
  },
  [SettingMutations.SET_BIT_RATE](state, bit: number) {
    state.bitRate = bit
  },
  [SettingMutations.SET_BASIC_EFFECT](state, basic: BasicEffect) {
    const { useState } = useFooterModule()
    const footerState = useState()
    if (basic === BasicEffect.D3) {
      footerState.effect?.clearFade()
    } else {
      footerState.effect?.clearSpatial()
    }
    state.basicEffect = basic
  },
  [SettingMutations.SET_CONVOLVER_EFFECT](state, convolver) {
    const { useState } = useFooterModule()
    const footerState = useState()
    if (convolver === '原唱') {
      footerState.effect?.clearConvolver()
    } else {
      footerState.effect?.createConvolver(convolver)
    }
    state.convolver = convolver
  }
}
