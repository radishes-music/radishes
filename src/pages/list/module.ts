import { actions, mutations } from './sage'
import { state } from './state'
import { uesModuleStore } from '@/hooks/index'
import { SongState } from '@/interface'

export const SongNameSpaced = 'Song'

export const useSongModule = () => {
  return uesModuleStore<SongState>(SongNameSpaced)
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
