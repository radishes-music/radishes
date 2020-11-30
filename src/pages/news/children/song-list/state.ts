import { Song } from '@/interface/index'
import { GlobalBase } from '@/interface/index'

export interface Catlist {
  name: string
  resourceCount: number
  type: number
  category: number
  resourceType: number
  hot: boolean
  activity: boolean
}

export interface Catlists {
  all: Catlist
  sub: Catlist[]
  categories: string[]
}

export interface Tags extends GlobalBase {
  type: number
  category: number
}

export interface SongListState {
  songList: Song[]
  tags: Tags[]
  tagsHot: Tags[]
  catlists?: Catlists
}

export const state: SongListState = {
  songList: [],
  tags: [],
  tagsHot: []
}
