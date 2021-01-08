/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, PropType } from 'vue'
import { Image } from '@/components/image/index'
import { noop } from '@/utils'
import classnames from 'classnames'
import './grid.less'

export const Grid = defineComponent({
  name: 'Grid',
  props: {
    source: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    onClick: {
      type: Function as PropType<(value: any) => void>,
      default: noop
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (item: any) => {
      emit('click', item)
    }
    return () => (
      <ul
        class={classnames('grid-contanier', {
          'grid-contanier--mobile': window.isMobile
        })}
      >
        {props.source.map(item => (
          <li onClick={() => handleClick(item)}>
            <Image
              name="grid-contanier-picurl"
              src={item.blurPicUrl || item.picUrl}
            />
            <div>{item.name}</div>
          </li>
        ))}
      </ul>
    )
  }
})
