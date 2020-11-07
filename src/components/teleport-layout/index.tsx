import { defineComponent, VNode, Teleport, PropType } from 'vue'
import classnames from 'classnames'
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
    },
    visible: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    class: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props, context) {
    const slot = (context.slots as unknown) as Slots
    return () => (
      <Teleport to={props.container}>
        <div
          class={
            props.class ||
            classnames('cover-container', {
              'cover-container-show': props.visible
            })
          }
        >
          {slot.default()}
        </div>
      </Teleport>
    )
  }
})
