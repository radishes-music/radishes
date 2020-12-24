import { mutations, getters } from './sage'
import { state } from './state'

export const NAMESPACED = 'Auth'

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
