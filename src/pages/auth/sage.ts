/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthState } from './state'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore

export const AUTH_MUTATIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SHOW_VIEW: 'SHOW_VIEW',
  HIDE_VIEW: 'HIDE_VIEW',
  UPDATE_USER: 'UPDATE_USER'
}

export const mutations = {
  [AUTH_MUTATIONS.LOGIN]: (state: AuthState, info: AuthState['user']) => {
    // Set cookies manually
    // see https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie
    // see https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/block-all-mixed-content
    // if (info) {
    //   info.cookie.split(';;').forEach(str => {
    //     document.cookie = str
    //   })
    // }
    state.user = info
  },
  [AUTH_MUTATIONS.UPDATE_USER]: (state: AuthState, { key, value }: any) => {
    if (!state.user) {
      return
    }
    const info = state.user[key]
    state.user[key] = { ...info, ...value }
  },
  [AUTH_MUTATIONS.LOGOUT]: (state: AuthState) => {
    state.user = null
  },
  [AUTH_MUTATIONS.SHOW_VIEW]: (state: AuthState) => {
    state.show = true
  },
  [AUTH_MUTATIONS.HIDE_VIEW]: (state: AuthState) => {
    state.show = false
  }
}

export const getters = {
  isLogin: (state: AuthState) => !!state.user
}
