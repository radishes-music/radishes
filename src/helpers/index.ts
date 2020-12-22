import { AUTH_MUTATIONS } from './../pages/auth/sage'
import { AuthNameSpaced, HeaderNameSpaced } from '@/modules'
import store from '@/store'
import { Mutations as HEADER_MUTATIONS } from '@/pages/header/sage'

export const isLogin = () => store.getters['Auth/isLogin']

export const showLogin = () =>
  store.commit(`${AuthNameSpaced}/${AUTH_MUTATIONS.SHOW_VIEW}`)

export const hideAuth = () => {
  store.commit(`${AuthNameSpaced}/${AUTH_MUTATIONS.HIDE_VIEW}`)
}

export const setThemeColor = (color: string) => {
  store.commit(`${HeaderNameSpaced}/${HEADER_MUTATIONS.SET_THEME_COLOR}`, color)
}
