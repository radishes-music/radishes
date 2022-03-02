import { defineComponent } from 'vue'
import './index.less'

export const $404 = defineComponent({
  name: '$404',
  setup() {
    return () => (
      <div class="not-found">
        <icon icon="not-found" size={480} color="var(--base-color)"></icon>
        <div>
          <router-link to="/music/recommend" replace>
            去听会歌
          </router-link>
        </div>
      </div>
    )
  }
})
