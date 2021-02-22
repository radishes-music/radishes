/**
 * Created by buddy on 2021/2/18.
 */

import { useStore } from 'vuex'
import { Toast } from 'vant'
import { getEventList, getFansList, getFollowList } from '@/pages/userinfo/api'

export const useGetFansList = () => {
  const $store = useStore()

  return async () => {
    if (!$store.getters['Auth/isLogin']) {
      return
    }
    try {
      const res: any = await getFansList($store.state.Auth.user.profile.userId)

      return res.followeds
    } catch (e) {
      Toast(e.message)
    }
  }
}

export const useGetEventList = () => {
  const $store = useStore()

  return async () => {
    if (!$store.getters['Auth/isLogin']) {
      return
    }
    try {
      const res: any = await getEventList($store.state.Auth.user.profile.userId)

      return res.events
    } catch (e) {
      Toast(e.message)
    }
  }
}
