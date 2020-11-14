import { defineComponent } from 'vue'

export const MaskView = defineComponent({
  name: 'MaskView',
  setup(props, { slots, attrs }) {
    return () => {
      return <div class="mask-wrapper">{slots.default?.()}</div>
    }
  }
})
