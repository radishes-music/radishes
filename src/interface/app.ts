import { ComponentPublicInstance, App } from 'vue'
import { FooterMutations, RecommendMutations } from '@/interface'

export interface Music extends ComponentPublicInstance {
  $app: App
}

export type ENV = Window & typeof globalThis

export interface GlobalBase {
  id: number
  name: string
}

export interface Pagination {
  offset: number
  limit: number
  total?: number
  slice?: number
}

export interface ElectronWindowEventMap extends WindowEventMap {
  maximize: Event
  unmaximize: Event
  minimize: Event
  restore: Event
}

export interface ListFormat extends GlobalBase {
  ar: GlobalBase[]
  al: GlobalBase
  noCopyright: boolean
  dt: number
  size: number
}

export interface FormatSource extends GlobalBase {
  src: string
  type: 'album' | 'song'
  author?: {
    src: string
  } & GlobalBase
  time?: number
  trackCount?: number
  playCount?: number
  description: string
  tags?: string[]
  list: ListFormat[]
  subscribed?: boolean
}

export type SongListColumnsType =
  | 'index'
  | 'control'
  | 'lyrics'
  | 'picUrl'
  | 'count'
  | 'creator'
  | 'artist'
  | 'name'
  | 'ar'
  | 'al'
  | 'dt'
  | 'remove'
  | 'size'
  | 'dlt'

export type AllMutations = FooterMutations & RecommendMutations
