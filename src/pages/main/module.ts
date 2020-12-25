import { mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { MainState } from '@/interface'

export const MainNameSpaced = 'Main'

export const useMainModule = () => {
  return uesModuleStore<MainState>(MainNameSpaced)
}

export default {
  namespaced: true,
  state,
  mutations
}
