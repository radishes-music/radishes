import { defineComponent, VNode, Teleport, PropType } from 'vue'
import './index.less'

interface Slots {
  default: () => VNode
}

export const TeleportToAny = defineComponent({
  name: 'TeleportLayout',
  props: {
    container: {
      type: String as PropType<string>,
      default: '#cover-container'
    }
  },
  setup(props, context) {
    const slot = (context.slots as unknown) as Slots
    return () => (
      <Teleport to={props.container}>
        <div class="cover-container">{slot.default()}</div>
      </Teleport>
    )
  }
})
