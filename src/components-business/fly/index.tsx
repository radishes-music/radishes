import {
  defineComponent,
  PropType,
  createApp,
  onMounted,
  ref,
  reactive
} from 'vue'
import Icon from '@/components-global/icon/main/index'
import './index.less'

export const Fly = defineComponent({
  name: 'Fly',
  props: {
    begin: {
      type: Object as PropType<Element>,
      default: null
    },
    end: {
      type: Object as PropType<Element>,
      default: null
    },
    duartion: {
      type: Number as PropType<number>,
      default: 0.3
    }
  },
  setup(props) {
    const begin = props.begin.getBoundingClientRect()
    const end = props.end.getBoundingClientRect()
    const style = reactive<any>({
      contanier: {
        transition: `transform ${props.duartion}s linear`
      },
      child: {
        transition: `transform ${props.duartion}s cubic-bezier(0.55, 0, 0.85, 0.36)`
      }
    })

    onMounted(() => {
      setTimeout(() => {
        style.contanier = {
          left: begin.left + begin.width / 2 - 15 + 'px',
          top: begin.top - 30 + 'px',
          transform: `translateX(${Math.abs(
            begin.left + begin.width / 2 - (end.left + end.width / 2)
          )}px)`,
          transition: `transform ${props.duartion}s linear`
        }
        style.child = {
          transform: `translateY(${Math.abs(
            begin.top + 30 - (end.top + end.height)
          )}px)`,
          transition: `transform ${props.duartion}s cubic-bezier(0.55, 0, 0.85, 0.36)`
        }
      }, 0)
    })

    return () => (
      <div class="fly" style={style.contanier}>
        <div class="fly-content vh-center" style={style.child}>
          <Icon icon="icomoonmusic" color="#333" size={18}></Icon>
        </div>
      </div>
    )
  }
})

interface Config {
  begin: Element
  end: Element
  duartion: number
}

export const instance = function (config: Config) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const app = createApp({
    setup() {
      const fly = ref()
      onMounted(() => {
        if (fly.value && fly.value.$el) {
          fly.value.$el.addEventListener('transitionend', () => {
            app.unmount()
            if (div.parentNode) {
              div.parentNode.removeChild(div)
            }
          })
        }
      })
      return () => <Fly ref={fly} {...config} />
    }
  })
  app.mount(div)
}
