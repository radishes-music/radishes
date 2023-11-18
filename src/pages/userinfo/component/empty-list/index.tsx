/**
 * Created by buddy on 2021/2/18.
 */
import { defineComponent } from 'vue'
import './index.less'

export const EmptyList = defineComponent({
  name: 'EmptyList',
  props: {
    text: {
      default: '暂无数据',
      type: String
    }
  },
  setup() {
    return function (this: any) {
      return <div class="empty-list">{this.text}</div>
    }
  }
})
