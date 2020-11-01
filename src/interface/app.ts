import { ComponentPublicInstance, App } from 'vue'

export interface Music extends ComponentPublicInstance {
  $app: App
}

export type ENV = Window &
  typeof globalThis & {
    VUE_APP_PLATFORM: string
  }

export interface GlobalBase {
  id: number
  name: string
}
