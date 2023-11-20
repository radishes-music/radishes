import { mutations, getters } from './sage'
import { state } from './state'

export const AuthNameSpaced = 'Auth'

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
