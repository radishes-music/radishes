import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import { useRoute } from '@/hooks/index'
import { toFixed } from '@/utils/index'
import Source from './source'
import Download from './download'
import Author from './author'
import About from './about'
import Effect from './effect'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
import './index.less'

export const Setting = defineComponent({
  name: 'Setting',
  setup() {
    const route = useRoute()
    const contanier = ref<HTMLElement>()
    const currentLocation = ref(route.params.location)
    const areaFormat = ref<
      {
        location: string
        top: number
      }[]
    >([])

    const markNav = [
      {
        location: 'source',
        name: '播放源'
      },
      {
        location: 'download',
        name: '下载设置'
      },
      {
        location: 'effect',
        name: '音效设置'
      },
      {
        location: 'author',
        name: '作者'
      },
      {
        location: 'about',
        name: '关于 radishes'
      }
    ]

    const jumpTop = (top: number | string) => {
      if (contanier.value) {
        if (typeof top === 'number') {
          contanier.value.scrollTop = top
        }
        if (typeof top === 'string') {
          const currentArea = areaFormat.value.find(
            item => item.location === top
          )
          if (currentArea) {
            nextTick(() => {
              contanier.value && (contanier.value.scrollTop = currentArea.top)
            })
          }
        }
      }
    }

    const handleJump = (loc: string) => {
      jumpTop(loc)
    }

    const handleWatch = watch(
      () => route.params.location,
      loc => {
        if (loc) {
          jumpTop(loc as string)
        }
      }
    )

    onUnmounted(() => {
      handleWatch()
    })

    onMounted(() => {
      if (contanier.value) {
        const children = contanier.value.children
        const contanierTop = contanier.value.getBoundingClientRect().top + 20
        for (let i = 0; i < children.length; i++) {
          const area = children[i] as HTMLElement
          const top = toFixed(
            area.getBoundingClientRect().top - contanierTop,
            2
          )
          const location = area.dataset.location
          if (location) {
            areaFormat.value[i] = {
              location,
              top
            }
          }
        }
        jumpTop(currentLocation.value as string)
      }
    })

    const onScroll = () => {
      const el = contanier.value
      if (el) {
        const top = toFixed(el.scrollTop, 2)
        for (let i = 0; i < areaFormat.value.length; i++) {
          const area = areaFormat.value[i]
          const areaNext = areaFormat.value[i + 1]
          if (areaNext && top >= area.top && top < areaNext.top) {
            currentLocation.value = area.location
          }
        }
      }
    }

    return () => (
      <div class="setting-view">
        <h1>设置</h1>
        <div class="setting-view-route">
          <ul>
            {markNav.map(item => {
              return (
                <li
                  class={classnames('none-select', {
                    'setting-view-route--active':
                      item.location === currentLocation.value
                  })}
                  onClick={() => handleJump(item.location)}
                >
                  {item.name}
                </li>
              )
            })}
          </ul>
        </div>
        <div
          ref={contanier}
          onScroll={debounce(onScroll, 10)}
          class="setting-view-contanier"
        >
          <Source />
          <Download />
          <Effect />
          <Author />
          <About />
        </div>
      </div>
    )
  }
})
