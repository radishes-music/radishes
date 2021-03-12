import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  reactive,
  ref
} from 'vue'
import { getDomStyle, noop } from '@/utils/index'

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
    const contanier = ref()
    const contanierStyle = reactive({
      w: 150,
      h: 150
    })
    const src = computed(() => {
      return `${props.src}?param=${contanierStyle.w}y${contanierStyle.h}`
    })

    onMounted(() => {
      nextTick(() => {
        if (contanier.value) {
          const w = getDomStyle(contanier.value, 'width') as string
          const h = getDomStyle(contanier.value, 'height') as string
          contanierStyle.w = Math.floor(Number(w.replace(/px/, '')))
          contanierStyle.h = Math.floor(Number(h.replace(/px/, '')))
        }
      })
    })

    return () => (
      <div
        class={`${props.name} bg-img`}
        onClick={e => emit('click', e)}
        ref={contanier}
      >
        {props.src && (
          <img
            src={src.value}
            alt="not found"
            // @ts-ignore
            loading="lazy"
          />
        )}
      </div>
    )
  }
})
