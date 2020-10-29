import { createNamespacedHelpers, useStore } from 'vuex'
import { actions, mutations } from './sage'
import { state, State } from './state'

export * from './state'
export * from './sage'

export const NAMESPACED = 'Header'

export const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  NAMESPACED
)

export const createUesHook = () => {
  const store = useStore()
  const useActions = (type: string, payload: string) => {
    return store.dispatch(NAMESPACED + '/' + type, payload)
  }
  const useState = (): State => {
    return store.state[NAMESPACED]
  }
  return {
    useActions: useActions,
    useState: useState
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
