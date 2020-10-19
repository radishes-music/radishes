import {
  MutationTree,
  Action,
  ActionContext,
  ActionPayload,
  ActionTree
} from 'vuex'
import { State, Banners } from './state'
import { RootState } from '@/store/index'
import { getRecommend, getBanner } from './api/index'

export const enum Mutations {
  SET_RESOURCE = 'SET_RESOURCE'
}

export const enum Actions {
  SET_ACTION_RESOURCE = 'SET_ACTION_RESOURCE'
}

export const actions: ActionTree<State, RootState> = {
  async [Actions.SET_ACTION_RESOURCE]({ commit }) {
    const data = await getBanner(0)
    commit(Mutations.SET_RESOURCE, data.banners)
  }
}

export const mutations: MutationTree<State> = {
  [Mutations.SET_RESOURCE](state, banners: Banners[]) {
    state.banners = banners
  }
}
