/**
 * Created by buddy on 2021/2/23.
 */
import { defineComponent } from 'vue'
import { Loading as VantLoading } from 'vant'
import './index.less'

export const Loading = defineComponent({
  name: 'Loading',
  props: {
    size: String
  },
  setup(props) {
    return function () {
      return (
        <div class="box-view">
          <VantLoading type="spinner" {...props}></VantLoading>
        </div>
      )
    }
  }
})
