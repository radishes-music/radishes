import { defineComponent } from 'vue'

export const Video = defineComponent({
  name: 'Video',
  setup() {
    return () => (
      <div class="video">
        <router-view></router-view>
      </div>
    )
  }
})
