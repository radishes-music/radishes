/**
 * Created by buddy on 2021/2/25.
 */
import { defineComponent, reactive } from 'vue'
import Icon from '@/components-global/icon/main'

import './index.less'

// TODO 执行操作，你说呢？
export const OverflowText = defineComponent({
  name: 'OverflowText',
  setup() {
    const state = reactive({
      show: false
    })

    return function (this: any) {
      return (
        <div class="overflow-text">
          <div class={`overflow-text__value ${state.show ? 'switchOn' : ''}`}>
            {this.$slots.default?.()}
          </div>
          <div
            class="overflow-text__switch"
            onClick={() => {
              state.show = !state.show
            }}
          >
            <Icon
              icon={state.show ? 'shang-sanjiao' : 'downAngle'}
              color="#999"
              size={18}
            ></Icon>
          </div>
        </div>
      )
    }
  }
})
