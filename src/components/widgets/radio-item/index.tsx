/**
 * Created by buddy on 2021/2/26.
 */
import { defineComponent } from 'vue'
import { Image } from 'vant'

import './index.less'
import { overNum } from '@/utils'

export const RadioItem = defineComponent({
  name: 'RadioItem',
  props: ['info'],
  setup(props) {
    return function () {
      const { info = {} } = props

      return (
        <div class="radio-item">
          <div class="radio-item__left">
            <div>
              <Image
                width={60}
                height={60}
                src={info.picUrl}
                class="radio-item__img"
              ></Image>
            </div>
            <div class="link-text">{info.name}</div>
            <div class="radio-item__tag">{info.category}</div>
          </div>
          <div class="radio-item__right">
            <div>节目{overNum(info.programCount)}</div>
            <div>订阅{overNum(info.subCount)}</div>
          </div>
        </div>
      )
    }
  }
})
