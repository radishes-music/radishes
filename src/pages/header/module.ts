import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { HeaderState } from '@/interface'

export const HeaderNameSpaced = 'Header'

export const useHeaderModule = () => {
  return uesModuleStore<HeaderState>(HeaderNameSpaced)
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
