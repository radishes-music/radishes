import { defineComponent } from 'vue'
import './index.less'

export const MaskView = defineComponent({
  name: 'MaskView',
  setup(props, { slots }) {
    return () => {
      return <div class="mask-wrapper">{slots.default?.()}</div>
    }
  }
})
