import { actions, mutations } from './sage'
import { state, DownloadState } from './state'
import { uesModuleStore } from '@/hooks/index'

export { DownloadState } from './state'
export { DownloadActions, DownloadMutations } from './sage'

export const DownloadNameSpaced = 'Download'

export const useDownloadModule = () => {
  return uesModuleStore<DownloadState>(DownloadNameSpaced)
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
