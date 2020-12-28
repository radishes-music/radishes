import { defineComponent } from 'vue'
import './music.less'

export const MusicLayout = defineComponent({
  name: 'MusicLayout',
  setup(_, { slots }) {
    return () => (
      <div class="music-layout">
        <div class="music-layout--title">{slots.title && slots.title()}</div>
        <div class="music-layout--head">{slots.head && slots.head()}</div>
        <div class="music-layout--body">{slots.body && slots.body()}</div>
      </div>
    )
  }
})
