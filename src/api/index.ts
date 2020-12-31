import { get } from '@/utils/http'
import {
  SongsDetail,
  PlayList,
  Albums,
  Song,
  PlaySource
} from '@/interface/index'
import { SubscribeActionType } from '@/shared/subscribe'

export const getSongUrl = async <T>(
  id: number | number[],
  source?: PlaySource[]
): Promise<T> => {
  const data = await get<{ data: T }>('/api/song/url', {
    id: Array.isArray(id) ? id.join(',') : id,
    br: 9.99e5,
    source: source?.join(',')
  })
  return data.data
}

export const getSongDetail = async (
  id: number | number[]
): Promise<SongsDetail[]> => {
  const data = await get<{ songs: SongsDetail[] }>('/api/song/detail', {
    ids: typeof id === 'number' ? id : id.join(',')
  })
  return data.songs
}

export const getPlayList = async (id: number): Promise<PlayList> => {
  const data = await get<{ playlist: PlayList }>('/api/playlist/detail', {
    id
  })
  return data.playlist
}

export const getAlbumList = async (
  id: number
): Promise<{ songs: SongsDetail[]; album: Albums }> => {
  const data = await get<{ songs: SongsDetail[]; album: Albums }>(
    '/api/album',
    {
      id
    }
  )
  return data
}

export const userPlaylist = async (id: string | number): Promise<Song[]> => {
  const data = await get<{ playlist: Song[] }>('/api/user/playlist', {
    uid: id
  })
  return data.playlist
}

export const userSubscribeCount = async () => {
  return get('/api/user/subcount')
}

export const subscribePlaylist = async (
  type: SubscribeActionType,
  id: number | string
) => {
  return get('/api/playlist/subscribe', {
    t: type,
    id: id
  })
}

export const subscribeSingle = async (
  type: SubscribeActionType,
  pid: number | string,
  id: number[] | string[]
) => {
  return get('/api/playlist/tracks', {
    op: type === '1' ? 'add' : 'del',
    pid,
    tracks: id.join(',')
  })
}
