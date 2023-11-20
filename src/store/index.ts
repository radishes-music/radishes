import { createStore, MutationTree, createLogger } from 'vuex'
import { FooterMutations } from '@/interface'
import { AllMutations } from '@/interface/index'
import { getNodeEnv, toFixed } from '@/utils/index'
import { clone } from 'lodash-es'
import { each } from 'lodash-es'
import { pull } from 'lodash-es'
import { uniqBy } from 'lodash-es'
import createPersistedState from 'vuex-persistedstate'
import modules from '@/modules/index'

export const enum RootMutations {
  SET_HISTORY_ROUTE = 'SET_HISTORY_ROUTE',
  BACK_HISTORY_ROUTE = 'BACK_HISTORY_ROUTE',
  FORWARD_HISTORY_ROUTE = 'FORWARD_HISTORY_ROUTE',
  CAN_BE_COLLECT = 'CAN_BE_COLLECT',
  UPDATE_PERECENTAGE = 'UPDATE_PERECENTAGE'
}

export interface CustomRouter {
  life: number
  url: string
}

interface HistoryRoute {
  [x: string]: any
  before: CustomRouter[]
  after: CustomRouter[]
  needRoute?: string
  canBeCollect: boolean
}

export interface RootState {
  [x: string]: any
  historyRoute: HistoryRoute
  percentage: number
}

function removeExpired(route: CustomRouter[]) {
  const life = 2 * 24 * 60 * 60 * 1000
  const heap = 20
  // Maximum capacity
  // Reverse the array before deduplication
  const routeTp = uniqBy(clone(route.reverse()), 'url')
    .reverse()
    .slice(-1 * (heap - 1))
  each(routeTp, value => {
    if (value && Date.now() - value.life > life) {
      pull(routeTp, value)
    }
  })
  return routeTp
}

function customRouterBase(state: RootState, originKey: string, route: string) {
  const origin = state.historyRoute[originKey] as CustomRouter[]
  const last = origin[origin.length - 1]
  if (last?.url !== route) {
    state.historyRoute[originKey].push({
      life: Date.now(),
      url: route
    })
    state.historyRoute[originKey] = removeExpired(origin)
  }
}

function customRouterBack(state: RootState, route: string) {
  customRouterBase(state, 'after', route)
}

function customRouterForward(state: RootState, route: string) {
  customRouterBase(state, 'before', route)
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
  [RootMutations.SET_HISTORY_ROUTE](state, route: string) {
    customRouterForward(state, route)
  },
  [RootMutations.BACK_HISTORY_ROUTE](state, route: string) {
    const before = state.historyRoute.before.pop()
    state.historyRoute.needRoute = before?.url
    customRouterBack(state, route)
  },
  [RootMutations.FORWARD_HISTORY_ROUTE](state, route: string) {
    const after = state.historyRoute.after.pop()
    state.historyRoute.needRoute = after?.url
    customRouterForward(state, route)
  },
  [RootMutations.CAN_BE_COLLECT](state, collect: boolean) {
    state.historyRoute.canBeCollect = collect
  },
  [RootMutations.UPDATE_PERECENTAGE](state, percentage: number) {
    state.percentage = toFixed(percentage * 100, 2)
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
      'Auth.playlist',
      'Header.themeColor',
      'Layout',
      'Footer.musicStack',
      'Footer.musciHistory',
      'Footer.volume',
      'Footer.music',
      'Footer.musicLyricsOrigin',
      'Footer.currentTime',
      'Footer.visibleLyrics',
      'Footer.playMode',
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
