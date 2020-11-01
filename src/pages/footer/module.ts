import { actions, mutations, getters } from './sage'
import { state } from './state'

export * from './state'
export * from './sage'

export const NAMESPACED = 'Footer'

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
