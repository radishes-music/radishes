import { Avatar, GlobalBase, SongsDetail, Albums } from '@/interface/index'
import { Merage, RequiredPartial } from '@/interface/utils'

export type PlayList = RequiredPartial<
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
    subscribed: boolean
  } & GlobalBase,
  Merage<{
    subscribers: Avatar[]
    userId: number
  }>
>
export interface AlbumList {
  song: SongsDetail[]
  album: {
    description: string
    publishTime: number
    size: number
    picUrl: string
    trackCount: number
    shareCount: number
    playCount: number
    subscribed: boolean
  } & Albums
}

export interface SongState {
  playlist: PlayList
  albumList: AlbumList
}

export enum SongActions {
  SET_ACTION_PLAYLIST = 'SET_ACTION_PLAYLIST',
  SET_ACTION_ALBUMLIST = 'SET_ACTION_ALBUMLIST',
  SET_ACTION_RECOMMEND_SONG = 'SET_ACTION_RECOMMEND_SONG'
}
export enum SongMutations {
  SET_PLAYLIST = 'SET_PLAYLIST',
  SET_ALBUMLIST = 'SET_ALBUMLIST'
}
