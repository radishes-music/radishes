import {
  defineComponent,
  VNode,
  Teleport,
  PropType,
  watchEffect,
  ref
} from 'vue'
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
    const slot = context.slots as unknown as Slots
    const visible = ref(props.visible)
    const teleportContanier = ref<HTMLElement | null>(null)

    watchEffect(() => {
      visible.value = props.visible
    })

    return () => (
      <Teleport to={props.container}>
        <div
          v-show={visible.value}
          ref={teleportContanier}
          class={
            props.class ||
            classnames('cover-container', {
              'cover-container-show': visible.value
            })
          }
        >
          {slot.default()}
        </div>
      </Teleport>
    )
  }
})
