import { createNamespacedHelpers } from 'vuex'
import { state } from './state'
import { actions, mutations } from './sage'
export { LayoutActions } from './sage'

export * from './state'

export const NAMESPACED = 'Layout'

export const {
  mapState,
  mapActions,
  mapMutations,
  mapGetters
} = createNamespacedHelpers(NAMESPACED)

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
