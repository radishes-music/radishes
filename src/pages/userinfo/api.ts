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
