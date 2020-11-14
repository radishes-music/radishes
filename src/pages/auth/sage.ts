import { AuthState } from './state'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore

export const mutations = {
  ['LOGIN']: (state: AuthState, info: AuthState['user']) => {
    state.user = info
  },
  ['LOGOUT']: (state: AuthState) => {
    state.user = null
  },
  ['SHOW_VIEW']: (state: AuthState) => {
    state.show = true
  },
  ['HIDE_VIEW']: (state: AuthState) => {
    state.show = false
  }
}

export const getters = {
  isLogin: (state: AuthState) => !state.user
}
