/**
 * Created by buddy on 2021/2/23.
 */
import http from '@/utils/http'

// TODO 获取用户基本信息
export const userDetail = (uid: string) =>
  http.get('/api/user/detail', {
    params: { uid }
  })

// userDetail('1407747620').then(console.log)

// TODO 获取用户听歌记录
export enum ListenRecordType {
  weekData = 1,
  allData = 0
}
export const userListenRecord = (
  uid: string,
  type = ListenRecordType.allData
) =>
  http.get('/api/user/record', {
    params: {
      uid,
      type
    }
  })

// userListenRecord('263917831', ListenRecordType.weekData).then(console.log)

// TODO 获取用户歌单[可分页]
export const userPlaylist = (uid: string, offset = 0, limit = 20) =>
  http.get('/api/user/playlist', {
    params: { uid, offset, limit, cookie: 1 }
  })

// userPlaylist('263917831').then(console.log)

// TODO 歌单详情
export const userPlaylistDetail = (id: string) =>
  http.get('/api/playlist/detail', {
    params: { id }
  })

// TODO 用户创建电台
export const userAudio = (uid: string) =>
  http.get('/api/user/audio', {
    params: {
      uid
    }
  })

// userAudio('1407747620').then(console.log)

// TODO 用户关注列表[可分页]
export const userFollows = (uid: string, offset = 0, limit = 40) =>
  http.get('/api/user/follows', {
    params: {
      uid,
      offset,
      limit
    }
  })

// TODO 用户粉丝列表[可分页]
export const userFolloweds = (uid: string, limit = 40, lasttime = -1) =>
  http.get('/api/user/followeds', {
    params: {
      uid,
      limit,
      lasttime
    }
  })

// TODO 用户动态[可分页]
export const userEvent = (uid: string, limit = 40, lasttime = -1) =>
  http.get('/api/user/event', {
    params: {
      uid,
      limit,
      lasttime
    }
  })

// TODO 获取收藏的专栏
export const topicSublist = (limit = 20, offset = 0) =>
  http.get('/api/topic/sublist', {
    params: {
      limit,
      offset
    }
  })

// TODO 获取已收藏专辑列表[可分页] =》 专辑非歌单
export const albumSublist = (limit = 25, offset = 0) =>
  http.get('/api/album/sublist', {
    params: {
      limit,
      offset
    }
  })

// albumSublist().then(console.log)

// TODO 获取收藏的数量
export const userSubcount = () => http.get('/api/user/subcount')

// TODO 合成
export const userPlaylistPro = async (uid: string) => {
  const res: any = await userPlaylist(uid)
  //  TODO version "1613629837586"
  if (res.code !== 200) {
    throw new Error('userPlaylist-http-error')
  }
  const { playlist } = res
  const detailList: any = await Promise.all(
    playlist.map(({ id }: any) => userPlaylistDetail(id))
  )
  if (!detailList.every(({ code }: any) => code === 200)) {
    throw new Error('userPlaylistDetail-http-error')
  }

  return playlist.map((info: any, index: number) => ({
    ...info,
    ...detailList[index].playlist
  }))
}

export const getUserInfoApi = async (uid: string, isSelf = false) => {
  const requests = [userDetail(uid), userAudio(uid)]
  if (isSelf) {
    requests.push(userSubcount())
  }
  const res = await Promise.all(requests)

  const [detail, audios, subcount = {}]: any = res

  const { profile, level, listenSongs, peopleCanSeeMyPlayRecord, pcSign }: any =
    detail

  return {
    profile: {
      ...profile,
      level: level,
      pcSign: pcSign,
      listenSongs,
      peopleCanSeeMyPlayRecord,
      ...subcount
    },
    audio: audios.djRadios
  }
}

// getUserInfoApi('263917831').then(console.log)
