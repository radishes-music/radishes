/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Created by buddy on 2021/2/18.
 */

import http from '@/utils/http'

export const getEventList = (uid: string) =>
  http.get('/api/user/event', {
    params: {
      uid
    }
  })

export const getFollowList = (uid: string) =>
  http.get('/api/user/follows', {
    params: {
      uid
    }
  })

export const getFansList = (uid: string) =>
  http.get('/api/user/followeds', {
    params: {
      uid
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
