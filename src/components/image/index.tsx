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
import { debounce } from 'lodash-es'

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
      w: 1,
      h: 1
    })
    const src = computed(() => {
      return `${props.src}?param=${contanierStyle.w * 2}y${
        contanierStyle.h * 2
      }`
    })

    const tn = (s: string) => {
      return Math.floor(Number(s.replace(/px/, '')))
    }

    const resize = debounce(() => {
      if (contanier.value) {
        const w = tn(getDomStyle(contanier.value, 'width') as string)
        const h = tn(getDomStyle(contanier.value, 'height') as string)
        if (w > contanierStyle.w && h > contanierStyle.h) {
          contanierStyle.w = w
          contanierStyle.h = h
        }
      }
    }, 1000)

    window.addEventListener('resize', resize)

    onMounted(() => {
      nextTick(resize)
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
