import { defineComponent } from 'vue'

export const LocalMusicDir = defineComponent({
  name: 'LocalMusicDir',
  setup() {
    return () => (
      <div class="local-music-dir">
        <div>{$t('src__pages__music__children__directory___7')}</div>
      </div>
    )
  }
})
