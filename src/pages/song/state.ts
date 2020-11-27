import { Avatar, GlobalBase } from '@/interface/index'

type Merage<P, T = {}> = P & T
export type RequiredPartial<P, T> = Merage<Required<P>, Partial<T>>

export interface Tracks extends GlobalBase {
  al: Merage<
    {
      picUrl: string
    },
    GlobalBase
  >
  ar: Merage<GlobalBase>[]
}

export interface State {
  playlist: RequiredPartial<
    {
      tracks: Tracks[]
      tags: string[]
      description: string
    },
    Merage<
      {
        subscribers: Avatar[]
        creator: Avatar
        userId: number
        createTime: number
        coverImgUrl: string
        trackCount: number
        tags: string[]
        shareCount: number
        playCount: number
        dt: number
      },
      GlobalBase
    >
  >
}

export const state: State = {
  playlist: {
    tracks: [],
    tags: [],
    description: ''
  }
}
