import { defineComponent } from 'vue'

export const Mv = defineComponent({
  render() {
    return (
      <div class="video-mv">
        <router-view></router-view>
      </div>
    )
  }
})
