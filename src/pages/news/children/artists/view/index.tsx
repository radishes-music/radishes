import { defineComponent } from 'vue'
import './index.less'

export const Artists = defineComponent({
  name: 'Artists',
  setup() {
    return () => <div class="artists"></div>
  }
})
