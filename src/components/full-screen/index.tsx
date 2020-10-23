import { defineComponent } from 'vue'

export const FullScreen = defineComponent({
  setup() {
    return () => <router-view></router-view>
  }
})
