import { defineComponent } from 'vue'

export const Moments = defineComponent({
  name: 'Moments',
  setup() {
    return () => (
      <div class="moments">
        <h1>{j18n.load('src__pages__moments__view__index___7')}</h1>
      </div>
    )
  }
})
