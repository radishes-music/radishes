import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { DownloadState } from '@/interface'

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
