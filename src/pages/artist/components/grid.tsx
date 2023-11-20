import { defineComponent, PropType } from 'vue'
import { Image } from '@/components/image/index'
import './grid.less'
import { noop } from '@/utils'

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
      <ul class="grid-contanier">
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
