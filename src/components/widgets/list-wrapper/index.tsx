/**
 * Created by buddy on 2021/2/26.
 */
import { defineComponent } from 'vue'
import './index.less'

export const ListWrapper = defineComponent({
  name: 'ListWrapper',
  setup() {
    return function (this: any) {
      return <div class="list-wrapper">{this.$slots.default?.()}</div>
    }
  }
})
