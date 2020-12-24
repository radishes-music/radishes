import { actions, mutations } from './sage'
import { state } from './state'

export const NAMESPACED = 'Artist'

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
