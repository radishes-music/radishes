import { state } from './state'
import { mutations } from './sage'
import { uesModuleStore } from '@/hooks/index'
import { LayoutState, LayoutMutations } from '@/interface'

export const LayoutNameSpaced = 'Layout'

export const useLayoutModule = () => {
  return uesModuleStore<LayoutState, {}, {}, LayoutMutations>(LayoutNameSpaced)
}

export default {
  namespaced: true,
  state,
  mutations
}
