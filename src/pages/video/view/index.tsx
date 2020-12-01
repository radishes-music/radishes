import { defineComponent } from 'vue'

export const Video = defineComponent({
  name: 'Video',
  render() {
    return (
      <div class="video">
        <router-view></router-view>
      </div>
    )
  }
})
