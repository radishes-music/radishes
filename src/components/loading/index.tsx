/**
 * Created by buddy on 2021/2/23.
 */
import { defineComponent } from 'vue'
import { Loading as VantLoading } from 'vant'
import './index.less'

export const Loading = defineComponent({
  name: 'Loading',
  setup() {
    return function() {
      return (
        <div class="box-view">
          <VantLoading type="spinner"></VantLoading>
        </div>
      )
    }
  }
})
