import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { CloudState, CloudActions, CloudMutations } from '@/interface'

export const CloudNameSpaced = 'Cloud'

export const useCloudModule = () => {
  return uesModuleStore<CloudState, {}, typeof actions, CloudMutations>(
    CloudNameSpaced
  )
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
