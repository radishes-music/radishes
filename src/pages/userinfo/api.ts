/**
 * Created by buddy on 2021/2/18.
 */

import http from '@/utils/http'

// TODO 用户动态[可分页]
export const getEventList = (uid: string, limit = 40, lasttime = -1) =>
  http.get('/api/user/event', {
    params: {
      uid,
      limit,
      lasttime
    }
  })

// TODO 用户关注列表[可分页]
export const getFollowList = (uid: string, offset = 0, limit = 40) =>
  http.get('/api/user/follows', {
    params: {
      uid,
      offset,
      limit
    }
  })

// TODO 用户粉丝列表[可分页]
export const getFansList = (uid: string, limit = 40, lasttime = -1) =>
  http.get('/api/user/followeds', {
    params: {
      uid,
      limit,
      lasttime
    }
  })

export const uploadAvatar = (file: any) => {
  const data = new FormData()
  data.append('imgFile', file)
  return http.post(`/api/avatar/upload?imgSize=1024`, data, {
    headers: {
      ['Content-Type']: 'multipart/form-data'
    }
  })
}

interface ProfileData {
  gender: number
  signature: string
  city: string
  province: string
  nickname: string
  birthday: number
}

export const updateProfile = (params: ProfileData) =>
  http.get('/api/user/update', {
    params
  })

export const getPlayList = (uid: string) =>
  http.get('/api/user/playlist', {
    params: {
      uid
    }
  })

export const getPlayRecord = (uid: string, type = 0) =>
  http.get('/api/user/record', {
    params: {
      uid,
      type
    }
  })

// TODO 获取收藏的专栏
export const getTopicSublist = (limit = 20, offset = 0) =>
  http.get('/api/topic/sublist', {
    params: {
      limit,
      offset
    }
  })
