import { state } from './state'
import { actions, mutations } from './sage'
export { LayoutActions } from './sage'

export * from './state'

export const NAMESPACED = 'Layout'

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
