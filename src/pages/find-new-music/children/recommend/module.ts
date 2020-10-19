import { createNamespacedHelpers } from 'vuex'
import { state } from './state'
import { actions, mutations } from './sage'

export const NAMESPACED = 'Recommend'

export const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  NAMESPACED
)

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
