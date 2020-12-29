import { defineComponent } from 'vue'

export const LocalMusicDir = defineComponent({
  name: 'LocalMusicDir',
  setup() {
    return () => (
      <div class="local-music-dir">
        <div>本地目录</div>
      </div>
    )
  }
})
