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
  [SettingMutations.SET_BASIC_EFFECT](state, basic: BasicEffect[]) {
    const { useState } = useFooterModule()
    const footerState = useState()
    footerState.effect?.clearBasicEffect()
    if (basic.includes(BasicEffect.D3)) {
      footerState.effect?.startSpatial()
    }
    if (basic.includes(BasicEffect.FADE)) {
      footerState.effect?.startInOut(true)
    }
    if (basic.includes(BasicEffect.TENDER)) {
      footerState.effect?.startTender()
    }
    state.basicEffect = basic
  },
  [SettingMutations.SET_CONVOLVER_EFFECT](state, convolver) {
    const { useState } = useFooterModule()
    const footerState = useState()
    if (convolver === j18n.load('src__pages__setting__sage___37')) {
      footerState.effect?.clearConvolver()
    } else {
      footerState.effect?.createConvolver(convolver)
    }
    state.convolver = convolver
  },
  [SettingMutations.SET_UPGRADE](state, upgrade) {
    state.upgrade = upgrade
  },
  [SettingMutations.SET_LANGUAGE](state, language) {
    state.language = language
  }
}
