import { defineComponent } from 'vue'

export const Moments = defineComponent({
  name: 'Moments',
  setup() {
    return () => (
      <div class="moments">
        <h1>动态</h1>
      </div>
    )
  }
})
