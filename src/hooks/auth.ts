import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import http from '@/utils/http'
import { doSignin } from '@/pages/auth/api'
import {
  getUserInfoApi,
  userDetail,
  userFollows,
  userPlaylist
} from '@/api/userinfo'
import { isFunction } from 'lodash-es'
import store from '@/store/index'

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

export const useAuthProfile = () => {
  const $store = useStore()

  const isLogin = computed(() => !!$store.state.Auth.user)

  const profile = computed(() =>
    isLogin.value ? $store.state.Auth.user.profile : null
  )

  return profile
}

export const useLogin = () => {
  const $store = useStore()
  return async (info: any) => {
    $store.commit('Auth/LOGIN', info)
    const res: any = await userPlaylist(info.account.id, 0, 1e4)
    $store.commit('Auth/USER_PLAY_LIST', res.playlist)
  }
}

export const useUserPlayList = () => {
  return computed(() => store.state.Auth.playlist)
}

export const useLogout = () => {
  const $store = useStore()
  const $router = useRouter()
  return async () => {
    try {
      await http.get('/api/logout')
      $store.commit('Auth/LOGOUT')
      $store.commit('Auth/USER_PLAY_LIST', [])
      $router.replace('/')
    } catch (e) {
      Toast(e.message)
    }
  }
}

export const useUpdateProfile = () => {
  const $store = useStore()

  return (value: any) => {
    if (!$store.getters['Auth/isLogin']) {
      return
    }
    try {
      $store.commit('Auth/UPDATE_USER', {
        key: 'profile',
        value
      })
    } catch (e) {
      Toast(e.message)
    }
  }
}

/*
  TODO Profile载入
    用户个人详情
    我的听歌排行
    我的歌单
* * */
export const useLoadProfile = () => {
  const $store = useStore()

  return async () => {
    if (!$store.getters['Auth/isLogin']) {
      return
    }
    try {
      const res: any = await userDetail($store.state.Auth.user.profile.userId)

      $store.commit('Auth/UPDATE_USER', {
        key: 'profile',
        value: {
          ...res.profile,
          level: res.level,
          pcSign: res.pcSign,
          listenSongs: res.listenSongs
        }
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

export const useUserInfoLoading = () => {
  const $store = useStore()

  return computed(() => !!$store.state.Auth.userInfoLoading)
}
/*
  TODO Profile载入
    用户个人详情
    我的听歌排行
    我的歌单
* * */
// export const useLoadUserInfo = () => {
//   const $store = useStore()
//
//   return async () => {
//     try {
//       $store.commit('Auth/USER_INFO_LOADING', true)
//       const res: any = await getUserInfoApi(
//         $store.state.Auth.user.profile.userId
//       )
//
//       const { info, playlist, listenRecord } = res
//       const {
//         profile,
//         createDays,
//         createTime,
//         level,
//         listenSongs,
//         peopleCanSeeMyPlayRecord,
//         pcSign
//       } = info
//
//       $store.commit('Auth/UPDATE_USER', {
//         key: 'profile',
//         value: {
//           ...profile,
//           level: level,
//           pcSign: pcSign,
//           listenSongs,
//           peopleCanSeeMyPlayRecord,
//           playlist,
//           listenRecord
//         }
//       })
//       $store.commit('Auth/USER_INFO_LOADING', false)
//     } catch (e) {
//       $store.commit('Auth/USER_INFO_LOADING', false)
//       Toast(e.message)
//     }
//   }
// }

export const useMyPlaylist = () => {
  const $store = useStore()

  return computed(() => ({
    listenRecord: {
      total: $store.state.Auth.user.profile.listenSongs,
      list: $store.state.Auth.user.profile.listenRecord
    },
    playlist: $store.state.Auth.user.profile.playlist
  }))
}

export const useUserValue = (key: string) => {
  const $store = useStore()
  return computed(() => $store.state.Auth.user[key])
}

export const useLoadUserInfo = () => {
  const $store = useStore()

  return async (uid: string) => {
    try {
      $store.commit('Auth/USER_INFO_LOADING', true)
      const res: any = await getUserInfoApi(
        uid,
        uid == $store.state.Auth.user.profile.userId
      )
      $store.commit('Auth/USER_INFO_LOADING', false)
      return res
    } catch (e) {
      $store.commit('Auth/USER_INFO_LOADING', false)
    }
  }
}

export const usePlaylist = (
  uid: string,
  needRecord = false,
  listenSongs = 0
) => {
  const $store = useStore()

  return async (offset = 0) => {
    const isLogin = !!$store.state.Auth.user
    const userId = isLogin ? $store.state.Auth.user.profile.userId : ''
    const isSelf = userId == uid

    const res: any = await userPlaylist(
      uid,
      offset > 0 ? offset - 1 : offset,
      offset > 0 ? 20 : offset === 0 && needRecord ? 18 : 19
    )

    // res.playlist = res.playlist.filter((info: any) => info.trackCount !== 0)

    if (offset === 0 && isSelf) {
      res.playlist[0].name = '我喜欢的音乐'
    }
    if (offset === 0 && needRecord) {
      res.playlist.unshift({
        coverImgUrl: require('@/assets/imgs/rank_me.png'),
        name: `${isSelf ? '我的' : ''}听歌排行`,
        trackCount: listenSongs,
        record: true,
        userId: uid
      })
    }

    return res
  }
}

export const useIsSelf = (uid: any) => {
  const $store = useStore()

  return computed(
    () =>
      (isFunction(uid) ? uid() : uid) == $store.state.Auth.user?.profile?.userId
  )
}

export const useUserFollows = (uid: string) => {
  return async (offset = 0) => userFollows(uid, offset, 20)
}
