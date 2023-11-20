import { state } from './state'
import { actions, mutations } from './sage'

export const NAMESPACED = 'TopList'

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
