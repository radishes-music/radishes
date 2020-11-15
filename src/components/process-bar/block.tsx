import { defineComponent, toRefs, PropType } from 'vue'
import './block.less'

export interface Block {
  left: number
  width: number
}

export const BufferBlock = defineComponent({
  name: 'BufferBlock',
  props: {
    block: {
      type: Array as PropType<Block[]>,
      required: true
    }
  },
  setup(props) {
    const { block } = toRefs(props)
    return () => (
      <div class="buffer-block">
        {block.value?.map(b => (
          <div style={{ left: b.left + '%', width: b.width + '%' }}></div>
        ))}
      </div>
    )
  }
})
