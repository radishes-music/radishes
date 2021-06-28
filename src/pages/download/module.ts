import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { DownloadState, DownloadActions, DownloadMutations } from '@/interface'

export const DownloadNameSpaced = 'Download'

export const useDownloadModule = () => {
  return uesModuleStore<DownloadState, {}, typeof actions, DownloadMutations>(
    DownloadNameSpaced
  )
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
