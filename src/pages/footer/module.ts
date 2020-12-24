import { actions, mutations, getters } from './sage'
import { state, FooterState, FooterGetter } from './state'
import { uesModuleStore } from '@/hooks/index'

export * from './state'
export * from './sage'

export const NAMESPACED = 'Footer'

export const useFooterModule = () => {
  return uesModuleStore<FooterState, FooterGetter>(NAMESPACED)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
