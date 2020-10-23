import { createNamespacedHelpers } from 'vuex'
import { state } from './state'
import { actions, mutations } from './sage'
export { LayoutActions } from './sage'

export const NAMESPACED = 'Layout'

export const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  NAMESPACED
)

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
