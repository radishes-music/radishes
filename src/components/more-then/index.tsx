import { defineComponent, nextTick, PropType, ref, toRefs, watch } from 'vue'
import './index.less'

const prefix = 'more-then'

// Use the rendered node to calculate the height, and then determine whether to shrink
export const MoreThen = defineComponent({
  name: 'MoreThen',
  props: {
    equal: {
      type: Number as PropType<number>,
      required: true
    },
    rely: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, context) {
    const { equal, rely } = toRefs(props)
    const contenier = ref<HTMLElement | null>(null)
    const visible = ref(true)
    const more = ref(false)

    const calcHeight = () => {
      if (contenier.value && contenier.value.offsetHeight > equal.value) {
        visible.value = false
        more.value = true
      }
    }

    watch(rely, rely => {
      if (rely) {
        nextTick().then(calcHeight)
      }
    })

    return () => (
      <div class={`${prefix}`}>
        {visible.value && (
          <div ref={contenier}>
            {context.slots.default && context.slots.default()}
          </div>
        )}
        {more.value && (
          <ve-button
            type="text"
            onClick={() => (visible.value = !visible.value)}
          >
            {visible.value ? '隐藏' : '显示更多'}
          </ve-button>
        )}
      </div>
    )
  }
})
