import { AuthState } from './state'
import { isObject } from 'lodash-es'
import { Song } from '@/interface'
export const AUTH_MUTATIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SHOW_VIEW: 'SHOW_VIEW',
  HIDE_VIEW: 'HIDE_VIEW',
  UPDATE_USER: 'UPDATE_USER',
  USER_INFO_LOADING: 'USER_INFO_LOADING',
  USER_PLAY_LIST: 'USER_PLAY_LIST'
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

    if (isObject(value)) {
      state.user[key] = { ...info, ...value }
    } else {
      state.user[key] = value
    }
  },
  [AUTH_MUTATIONS.LOGOUT]: (state: AuthState) => {
    state.user = null
  },
  [AUTH_MUTATIONS.SHOW_VIEW]: (state: AuthState) => {
    state.show = true
  },
  [AUTH_MUTATIONS.HIDE_VIEW]: (state: AuthState) => {
    state.show = false
  },
  [AUTH_MUTATIONS.USER_INFO_LOADING]: (state: AuthState, value: boolean) => {
    state.userInfoLoading = value
  },
  [AUTH_MUTATIONS.USER_PLAY_LIST]: (state: AuthState, value: Song[]) => {
    state.playlist = value
  }
}

export const getters = {
  isLogin: (state: AuthState) => !!state.user
}
