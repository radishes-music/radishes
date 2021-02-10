import { Pagination, Song } from '@/interface/index'
import { Artist } from '@/interface/index'
import { GlobalBase } from '@/interface/index'

export const enum TargetType {
  EXTERNAL = 3000,
  LIST = 10,
  MUSIC = 1
}

export interface Banners {
  imageUrl: string
  typeTitle: string
  targetId: number
  targetType: number
  url: string
}

export interface RecommendState {
  banners: Banners[]
  songList: Song[]
  runningSwiper: boolean
}

export interface ArtistsState {
  artists: Artist[]
  completed: boolean
}

export interface PaginationHighquality extends Pagination {
  before: number
  cat: string
}

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

export const enum RecommendMutations {
  SET_BANNERS = 'SET_BANNERS',
  SET_SONG_LIST = 'SET_SONG_LIST',
  SET_SWIPER_RINNING = 'SET_SWIPER_RINNING',
  SET_RECOMMEND_SONG_LIST = 'SET_RECOMMEND_SONG_LIST'
}

export const enum RecommendActions {
  SET_ACTION_BANNERS = 'SET_ACTION_BANNERS',
  SET_ACTION_SONG_LIST = 'SET_ACTION_SONG_LIST',
  SET_ACTION_RECOMMEND_SONG_LIST = 'SET_ACTION_RECOMMEND_SONG_LIST'
}

export const enum ArtistsMutations {
  SET_ARTISTS = 'SET_ARTISTS'
}

export const enum ArtistsActions {
  SET_ACTION_ARTISTS = 'SET_ACTION_ARTISTS'
}

export const enum SongListMutations {
  SET_SONG_LIST = 'SET_SONG_LIST',
  SET_TAGS = 'SET_TAGS',
  SET_HOT_TAGS = 'SET_HOT_TAGS'
}

export const enum SongListActions {
  SET_ACTION_SONG_LIST = 'SET_ACTION_SONG_LIST',
  SET_ACTION_TAGS = 'SET_ACTION_TAGS',
  SET_ACTION_HOT_TAGS = 'SET_ACTION_HOT_TAGS'
}

export const enum TopListMutations {
  SET_TOP_LIST = 'SET_TOP_LIST'
}

export const enum TopListActions {
  SET_ACTION_TOP_LIST = 'SET_ACTION_TOP_LIST'
}
