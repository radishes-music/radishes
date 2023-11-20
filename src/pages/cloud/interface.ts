import { GlobalBase, Songs, Artists, Pagination } from '@/interface/index'

export interface SimpleSong extends GlobalBase {
  ar: Artists
  al: unknown[]
}

export interface CloudList extends Partial<Songs> {
  simpleSong: SimpleSong
  version: string
  fileName: string // .mp3
  songName: string
  addTime: number
  songId: number
  fileSize: number
  artist: string
  uid?: string
}

export interface CloudState {
  cloudList: CloudList[]
  pagination: Pagination
}

export const enum CloudActions {
  CLOUD_LIST_ACTION = 'CLOUD_LIST_ACTION'
}

export const enum CloudMutations {
  SET_CLOUD_LIST = 'SET_CLOUD_LIST',
  UNSHIFT_CLOUD_LIST = 'UNSHIFT_CLOUD_LIST',
  REMOVE_UNSHIFT_CLOUD_LIST = 'REMOVE_UNSHIFT_CLOUD_LIST'
}
