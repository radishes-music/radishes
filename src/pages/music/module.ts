import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import {
  LocalMusicState,
  LocalMusicActions,
  LocalMusicMutations
} from '@/interface'

export const LocalMusicNameSpaced = 'LocalMusic'

export const useLocalMusicModule = () => {
  return uesModuleStore<
    LocalMusicState,
    {},
    LocalMusicActions,
    LocalMusicMutations
  >(LocalMusicNameSpaced)
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
