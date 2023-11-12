import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import { useRoute } from '@/hooks/index'
import Source from './source'
import Download from './download'
import Author from './author'
import About from './about'
import Effect from './effect'
import Upgrade from './upgrade'
import classnames from 'classnames'
import { debounce } from 'lodash-es'
import { TweenMap } from 'v-easy-components/src/utils/tween'
import { scrollAnmation } from '@/utils/index'
import './index.less'

const tween = TweenMap['Quad-easeOut']

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
        name: '播放源',
        component: <Source />
      },
      {
        location: 'download',
        name: '下载设置',
        component: <Download />
      },
      {
        location: 'upgrade',
        name: '自动更新',
        component: <Upgrade />
      },
      {
        location: 'effect',
        name: '音效',
        component: <Effect />
      },
      {
        location: 'author',
        name: '作者',
        component: <Author />
      },
      {
        location: 'about',
        name: '关于Radishes',
        component: <About />
      }
    ]

    const jumpTop = (top: number | string) => {
      let to = 0
      if (contanier.value) {
        if (typeof top === 'number') {
          to = top
        }
        if (typeof top === 'string') {
          const currentArea = areaFormat.value.find(
            item => item.location === top
          )
          if (currentArea) {
            to = currentArea.top + 10
          }
        }
        nextTick(() => {
          if (contanier.value) {
            const from = contanier.value.scrollTop
            scrollAnmation(from, to, {
              tween: tween,
              duration: 200,
              cb: n => {
                contanier.value && (contanier.value.scrollTop = n)
              }
            })
          }
        })
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
          const top = Math.floor(
            area.getBoundingClientRect().top - contanierTop
          )
          const location = area.dataset.location
          if (location) {
            areaFormat.value[i] = {
              location,
              top: i === 0 ? 0 : top
            }
          }
        }
        jumpTop(currentLocation.value as string)
      }
    })

    const onScroll = () => {
      const el = contanier.value
      if (el) {
        const top = Math.floor(el.scrollTop)
        for (let i = 0; i < areaFormat.value.length; i++) {
          const area = areaFormat.value[i]
          const areaNext = areaFormat.value[i + 1]
          if (areaNext && top >= area.top && top < areaNext.top) {
            currentLocation.value = area.location
            break
          }
          currentLocation.value = markNav[markNav.length - 1].location
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
          {markNav.map(mark => mark.component)}
        </div>
      </div>
    )
  }
})
