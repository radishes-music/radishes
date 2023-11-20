import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { ArtistState, ArtistActions, ArtistMutations } from '@/interface'

export const ArtistNameSpaced = 'Artist'

export const useArtistModule = () => {
  return uesModuleStore<ArtistState, {}, typeof actions, ArtistMutations>(
    ArtistNameSpaced
  )
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
