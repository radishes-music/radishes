import { ComponentPublicInstance, App } from 'vue'
import { FooterInteface, FindMusicInteface } from '@/pages/index'

export interface Music extends ComponentPublicInstance {
  $app: App
}

export type ENV = Window & typeof globalThis

export interface GlobalBase {
  id: number
  name: string
}

export interface ElectronWindowEventMap extends WindowEventMap {
  maximize: Event
  unmaximize: Event
  minimize: Event
  restore: Event
}

export type AllMutations = FooterInteface.Mutations &
  FindMusicInteface.RecommendMutations
