import { state } from './state'
import { mutations } from './sage'
import { uesModuleStore } from '@/hooks/index'
import { LayoutState } from '@/interface'

export const LayoutNameSpaced = 'Layout'

export const useLayoutModule = () =>
  uesModuleStore<LayoutState>(LayoutNameSpaced)

export default {
  namespaced: true,
  state,
  mutations
}
