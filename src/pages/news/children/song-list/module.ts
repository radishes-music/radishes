import { state } from './state'
import { actions, mutations } from './sage'

export const NAMESPACED = 'SongList'

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
