import { createNamespacedHelpers, useStore } from 'vuex'
import { actions, mutations } from './sage'
import { state } from './state'

export * from './state'
export * from './sage'

export const NAMESPACED = 'Header'

export const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  NAMESPACED
)

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
