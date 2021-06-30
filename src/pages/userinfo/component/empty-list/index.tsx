/**
 * Created by buddy on 2021/2/18.
 */
import { defineComponent } from 'vue'
import './index.less'

export const EmptyList = defineComponent({
  name: 'EmptyList',
  props: {
    text: {
      default: j18n.load(
        'src__pages__userinfo__component__empty-list__index___10'
      ),
      type: String
    }
  },
  setup() {
    return function(this: any) {
      return <div class="empty-list">{this.text}</div>
    }
  }
})
