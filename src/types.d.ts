import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { RootState } from '@/store/index'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

declare module '*.png'
