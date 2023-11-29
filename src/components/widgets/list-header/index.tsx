/**
 * Created by buddy on 2021/2/26.
 */
import { defineComponent } from 'vue'
import { isNumber } from 'lodash-es'
import Icon from '@/components-global/icon/main'
import './index.less'

export const ListHeader = defineComponent({
  name: 'ListHeader',
  props: {
    title: {
      type: String
    },
    count: {
      type: Number
    },
    canLayout: {
      type: Boolean,
      default: false
    },
    layoutType: {
      type: Number
    },
    onLayoutChange: {
      type: Function,
      default: () => {
        /**/
      }
    }
  },
  setup(props) {
    return function () {
      const { count, title, canLayout, layoutType, onLayoutChange }: any = props

      return (
        <div class="list-header">
          <div>
            {title}
            {isNumber(count) && (
              <span class="list-header__count">({count})</span>
            )}
          </div>
          {canLayout && (
            <div class="list-header__select">
              {[
                'liebiaoshipailie',
                'duogongnengbiaodan_duohangwenben',
                'pailie'
              ].map((icon: string, index) => (
                <div
                  class={`list-header__option ${
                    layoutType === index ? 'active' : ''
                  }`}
                  onClick={onLayoutChange}
                >
                  <Icon icon={icon} color="auto" size={14}></Icon>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
  }
})
