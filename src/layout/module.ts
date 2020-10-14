import { createNamespacedHelpers } from 'vuex'
import { state } from './state'
import { actions, mutations } from './sage'

export const NAMESPACED = 'Layout'

export const { mapState, mapActions } = createNamespacedHelpers(NAMESPACED)

const layout = {
  namespaced: true,
  state,
  actions,
  mutations
}

export default layout
