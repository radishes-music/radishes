import { Song } from '@/interface/index'

export interface Top extends Song {
  tracks: {
    first: string
    second: string
  }[]
  coverImgUrl: string
  description: string
}

export interface TopListState {
  top: Top[]
  artistTop: Partial<Top>
}

export const state: TopListState = {
  top: [],
  artistTop: {}
}
