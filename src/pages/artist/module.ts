import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { ArtistState } from '@/interface'

export const ArtistNameSpaced = 'Artist'

export const useArtistModule = () => {
  return uesModuleStore<ArtistState>(ArtistNameSpaced)
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
