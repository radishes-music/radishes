import { actions, mutations, getters } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import {
  FooterState,
  FooterGetter,
  FooterActions,
  FooterMutations
} from '@/interface'

export { findMusicIndex } from './sage'

export const FooterNameSpaced = 'Footer'

export const useFooterModule = () => {
  return uesModuleStore<
    FooterState,
    FooterGetter,
    typeof actions,
    typeof mutations
  >(FooterNameSpaced)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
