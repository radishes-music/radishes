import { state } from './state'
import { mutations } from './sage'
import { uesModuleStore } from '@/hooks/index'
import { LayoutState, LayoutActions } from '@/interface'

export const LayoutNameSpaced = 'Layout'

export const useLayoutModule = () =>
  uesModuleStore<LayoutState, {}, LayoutActions>(LayoutNameSpaced)

export default {
  namespaced: true,
  state,
  mutations
}
