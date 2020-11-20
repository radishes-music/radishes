/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase */
import { useRouter } from 'vue-router'
import { computed } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { useStore } from 'vuex'
import { Toast } from 'vant'
import http from '@/utils/http'

export const useAuth = () => {
  const $store = useStore()

  const isLogin = computed(() => !!$store.state.Auth.user)

  const profile = computed(() =>
    isLogin.value ? $store.state.Auth.user.profile : null
  )

  const account = computed(() =>
    isLogin.value ? $store.state.Auth.user.account : null
  )

  const isShow = computed(() => $store.state.Auth.show)

  return {
    isLogin,
    profile,
    account,
    isShow
  }
}

export const useLogin = () => {
  const $store = useStore()
  return (info: any) => $store.commit('Auth/LOGIN', info)
}

export const useLogout = () => {
  const $store = useStore()
  const $router = useRouter()
  return async () => {
    try {
      await http.get('/api/logout')
      $store.commit('Auth/LOGOUT')
      $router.replace('/')
    } catch (e) {
      Toast(e.message)
    }
  }
}

export const useAuthView = () => {
  const $store = useStore()
  return (flag: boolean) => $store.commit(`Auth/${flag ? 'SHOW' : 'HIDE'}_VIEW`)
}
