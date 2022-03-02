import { defineComponent, PropType } from 'vue'
import { Button } from 'ant-design-vue'
import { noop } from '@/utils'
import './index.less'

export const PlayAll = defineComponent({
  name: 'PlayAll',
  props: {
    onClick: {
      type: Function as PropType<() => void>,
      default: noop
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () => (
      <Button
        class="play-all"
        shape="round"
        v-slots={{
          icon: () => <icon icon="play-copy" size={18} />
        }}
        onClick={() => {
          emit('click')
        }}
      >
        播放全部
      </Button>
    )
  }
})
