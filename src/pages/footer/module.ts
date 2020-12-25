import { actions, mutations, getters } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { FooterState, FooterGetter } from '@/interface'

export { findMusicIndex } from './sage'

export const FooterNameSpaced = 'Footer'

export const useFooterModule = () => {
  return uesModuleStore<FooterState, FooterGetter>(FooterNameSpaced)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
