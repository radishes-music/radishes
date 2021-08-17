import { defineComponent } from 'vue'

export const Moments = defineComponent({
  name: 'Moments',
  setup() {
    return () => (
      <div class="moments">
        <h1>{$t('src__pages__moments__view__index___7')}</h1>
      </div>
    )
  }
})
