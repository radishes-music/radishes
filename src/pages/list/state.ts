import { Avatar, GlobalBase, SongsDetail, Albums } from '@/interface/index'

type Merage<P, T = {}> = P & T
export type RequiredPartial<P, T> = Merage<Required<P>, Partial<T>>

export type Tracks = SongsDetail

export interface SongState {
  playlist: RequiredPartial<
    {
      tracks: SongsDetail[]
      tags: string[]
      description: string
      shareCount: number
      playCount: number
      dt: number
      createTime: number
      coverImgUrl: string
      trackCount: number
      creator: Avatar
    } & GlobalBase,
    Merage<{
      subscribers: Avatar[]

      userId: number
    }>
  >
  albumList: {
    song: SongsDetail[]
    album: {
      description: string
      publishTime: number
      size: number
      picUrl: string
      trackCount: number
      shareCount: number
      playCount: number
    } & Albums
  }
}

export const state = {
  playlist: {
    tracks: [],
    tags: [],
    description: ''
  },
  albumList: {
    song: [],
    album: {}
  }
}
