import { defineComponent, PropType } from 'vue'
import './secondary.less'

export const SecondaryLayout = defineComponent({
  name: 'Secondary',
  props: {
    src: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, { slots }) {
    return () => (
      <div class="secondary">
        <div class="secondary-head">{slots.head && slots.head()}</div>
        <div class="secondary-body">{slots.body && slots.body()}</div>
      </div>
    )
  }
})
