import { defineComponent, PropType } from 'vue'
import { noop } from '@/utils/index'

export const Image = defineComponent({
  name: 'Image',
  props: {
    src: {
      type: String as PropType<string>,
      default: ''
    },
    name: {
      type: String as PropType<string>,
      default: ''
    },
    onClick: {
      type: Function as PropType<() => void>,
      default: noop
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () => (
      <div class={`${props.name} bg-img`} onClick={e => emit('click', e)}>
        {/* @ts-ignore */}
        {props.src && <img src={props.src} alt="not found" loading="lazy" />}
      </div>
    )
  }
})
