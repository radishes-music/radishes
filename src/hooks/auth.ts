/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/camelcase */
import { onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import http from '@/utils/http'
import { doSignin, getUserDetail } from '@/pages/auth/api'

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

export const useLoadProfile = () => {
  const $store = useStore()

  return async () => {
    if (!$store.getters['Auth/isLogin']) {
      return
    }
    try {
      const res: any = await getUserDetail(
        $store.state.Auth.user.profile.userId
      )

      $store.commit('Auth/UPDATE_USER', {
        key: 'profile',
        value: { ...res.profile, level: res.level, pcSign: res.pcSign }
      })
    } catch (e) {
      Toast(e.message)
    }
  }
}

export const useAuthView = () => {
  const $store = useStore()
  return (flag: boolean) => $store.commit(`Auth/${flag ? 'SHOW' : 'HIDE'}_VIEW`)
}

export const useSignin = () => {
  const $store = useStore()
  return async () => {
    try {
      await doSignin()
      $store.commit('Auth/UPDATE_USER', {
        key: 'profile',
        value: { pcSign: true }
      })
    } catch (e) {
      if (e?.response.data.code === -2) {
        $store.commit('Auth/UPDATE_USER', {
          key: 'profile',
          value: { pcSign: true }
        })
      }
    }
  }
}
