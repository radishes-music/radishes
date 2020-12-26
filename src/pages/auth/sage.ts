import { AuthState } from './state'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore

export const AUTH_MUTATIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SHOW_VIEW: 'SHOW_VIEW',
  HIDE_VIEW: 'HIDE_VIEW'
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
