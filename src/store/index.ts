import { createStore, MutationTree, createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import modules from '../modules/index'
import { FooterMutations } from '@/pages/footer/module'
import { AllMutations } from '@/interface/index'
import { getNodeEnv } from '@/utils/index'

export const enum Mutations {
  SET_HISTORY_ROUTE = 'SET_HISTORY_ROUTE',
  BACK_HISTORY_ROUTE = 'BACK_HISTORY_ROUTE',
  FORWARD_HISTORY_ROUTE = 'FORWARD_HISTORY_ROUTE',
  CAN_BE_COLLECT = 'CAN_BE_COLLECT'
}

interface HistoryRoute {
  before: string[]
  after: string[]
  needRoute: string
  canBeCollect: boolean
}

export interface RootState {
  historyRoute: HistoryRoute
}

const state: RootState = {
  historyRoute: {
    canBeCollect: false,
    needRoute: '',
    before: [],
    after: []
  }
}

const mutations: MutationTree<RootState> = {
  [Mutations.SET_HISTORY_ROUTE](state, { oldRoute }) {
    state.historyRoute.before.push(oldRoute)
  },
  [Mutations.BACK_HISTORY_ROUTE](state, route: string) {
    const before = state.historyRoute.before.pop() as string
    state.historyRoute.after.push(route)
    state.historyRoute.needRoute = before
  },
  [Mutations.FORWARD_HISTORY_ROUTE](state, route: string) {
    const after = state.historyRoute.after.pop() as string
    state.historyRoute.before.push(route)
    state.historyRoute.needRoute = after
  },
  [Mutations.CAN_BE_COLLECT](state, collect: boolean) {
    state.historyRoute.canBeCollect = collect
  }
}

const plugins = []

if (getNodeEnv() === 'development') {
  plugins.push(
    createLogger({
      filter(mutation) {
        return [
          FooterMutations.CURRENT_TIME,
          FooterMutations.SET_VOLUME
        ].includes(mutation.type as AllMutations)
      }
    })
  )
}

plugins.push(
  createPersistedState({
    key: 'RADISHES-VUEX',
    paths: [
      'Auth.user',
      'Header.themeColor',
      'Footer.musciHistory',
      'Footer.volume',
      'Download.downloaded'
    ]
  })
)

export default createStore<RootState>({
  state,
  mutations,
  actions: {},
  modules,
  plugins
})
