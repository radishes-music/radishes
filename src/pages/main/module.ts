import { mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { MainState, MainMutations } from '@/interface'

export const MainNameSpaced = 'Main'

export const useMainModule = () => {
  return uesModuleStore<MainState, {}, {}, MainMutations>(MainNameSpaced)
}

export default {
  namespaced: true,
  state,
  mutations
}
