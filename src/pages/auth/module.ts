import { mutations, getters } from './sage'
import { state } from './state'

export * from './state'
export * from './sage'

export const NAMESPACED = 'Auth'

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
