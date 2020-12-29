import { defineComponent } from 'vue'
import { MusicLayout } from '@/layout/music/music'

export const Cloud = defineComponent({
  name: 'Cloud',
  setup() {
    return () => (
      <MusicLayout
        class="cloud"
        v-slots={{
          title: () => <div>音乐云盘</div>
        }}
      />
    )
  }
})
