/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Created by buddy on 2021/2/18.
 */

import { useStore } from 'vuex'
import { Toast } from 'vant'
import { getEventList, getFansList, getFollowList } from '@/pages/userinfo/api'

export const useGetFollowList = () => {
  const $store = useStore()

  return async () => {
    if (!$store.getters['Auth/isLogin']) {
      return
    }
    try {
      const res: any = await getFollowList(
        $store.state.Auth.user.profile.userId
      )
      return res.follow.map((info: any) => {
        const {
          avatarDetail,
          avatarUrl,
          followeds,
          playlistCount,
          nickname,
          signature,
          vipRights
        } = info

        return {
          avatarIcon: avatarDetail?.identityIconUrl,
          avatar: avatarUrl,
          followeds,
          nickname,
          playlistCount,
          signature,
          vip: vipRights?.associator.rights ? vipRights.redVipLevel : 0
        }
      })
    } catch (e) {
      Toast(e.message)
    }
  }
}

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
