import { createStore, MutationTree, createLogger } from 'vuex'
import { FooterMutations } from '@/interface'
import { AllMutations, PlaySource } from '@/interface/index'
import { getNodeEnv } from '@/utils/index'
import createPersistedState from 'vuex-persistedstate'
import modules from '@/modules/index'

export const enum RootMutations {
  SET_HISTORY_ROUTE = 'SET_HISTORY_ROUTE',
  BACK_HISTORY_ROUTE = 'BACK_HISTORY_ROUTE',
  FORWARD_HISTORY_ROUTE = 'FORWARD_HISTORY_ROUTE',
  CAN_BE_COLLECT = 'CAN_BE_COLLECT',
  UPDATE_PERECENTAGE = 'UPDATE_PERECENTAGE'
}

interface HistoryRoute {
  before: string[]
  after: string[]
  needRoute: string
  canBeCollect: boolean
}

export interface RootState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
  historyRoute: HistoryRoute
  percentage: number
}

const state: RootState = {
  historyRoute: {
    canBeCollect: false,
    needRoute: '',
    before: [],
    after: []
  },
  percentage: 0
}

const mutations: MutationTree<RootState> = {
  [RootMutations.SET_HISTORY_ROUTE](state, oldRoute: string) {
    const before = state.historyRoute.before
    const beforeLast = before[before.length - 1]
    if (beforeLast !== oldRoute) {
      state.historyRoute.before.push(oldRoute)
    }
  },
  [RootMutations.BACK_HISTORY_ROUTE](state, route: string) {
    const before = state.historyRoute.before.pop() as string
    const after = state.historyRoute.after
    const afterLast = after[after.length - 1]
    if (afterLast !== route) {
      state.historyRoute.after.push(route)
    }
    state.historyRoute.needRoute = before
  },
  [RootMutations.FORWARD_HISTORY_ROUTE](state, route: string) {
    const after = state.historyRoute.after.pop() as string
    const before = state.historyRoute.before
    const beforeLast = before[before.length - 1]
    if (beforeLast !== route) {
      state.historyRoute.before.push(route)
    }
    state.historyRoute.needRoute = after
  },
  [RootMutations.CAN_BE_COLLECT](state, collect: boolean) {
    state.historyRoute.canBeCollect = collect
  },
  [RootMutations.UPDATE_PERECENTAGE](state, percentage: number) {
    state.percentage = percentage * 100
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
      'historyRoute',
      'playSource',
      'Auth.user',
      'Header.themeColor',
      'Layout',
      'Footer.musicStack',
      'Footer.musciHistory',
      'Footer.volume',
      'Footer.music',
      'Footer.musicLyricsOrigin',
      'Footer.currentTime',
      'Setting',
      'Download',
      'LocalMusic'
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
