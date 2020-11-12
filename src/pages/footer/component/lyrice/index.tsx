import {
  defineComponent,
  PropType,
  toRefs,
  Transition,
  defineAsyncComponent,
  watchEffect,
  computed,
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { on, off } from '@/utils/index'
import { uesModuleStore, useRoute } from '@/hooks/index'
import { TeleportToAny } from '@/components/teleport-layout/index'
import {
  NAMESPACED as LayoutNamespace,
  State as LayoutState,
  Size
} from '@/layout/module'
import { NAMESPACED, State, Getter } from '../../module'
import classnams from 'classnames'
import { debounce } from 'lodash'
import './index.less'

const prefix = 'song-details'

export const PlayLyrice = defineComponent({
  name: 'PlayLyrice',
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
      default: false
    }
  },
  setup(props) {
    const { visible } = toRefs(props)
    const disabled = ref(true)
    const contanier = ref()
    const offset = ref(0)

    const { useState, useGetter } = uesModuleStore<State, Getter>(NAMESPACED)
    const LayoutModule = uesModuleStore<LayoutState>(LayoutNamespace)

    const { screenSize } = toRefs(LayoutModule.useState())

    const lyrice = computed(() => useGetter('musicLyrics'))
    const { currentTime } = toRefs(useState())

    const url = computed(() => {
      const state = useState()
      return state.music?.al.picUrl
    })

    const index = computed(() => {
      const len = lyrice.value.length
      return (
        lyrice.value.findIndex((value, index) => {
          return currentTime.value >= value.time && len - 1 === index
            ? true
            : currentTime.value < lyrice.value[index + 1]?.time
        }) || 0
      )
    })

    const updateOffset = () => {
      nextTick(() => {
        offset.value = contanier.value.clientHeight / 2 - 50
        disabled.value = !visible.value
      })
    }

    watchEffect(() => {
      if (visible.value) {
        updateOffset()
      }
    })

    const resize = debounce(() => {
      if (visible.value && screenSize.value !== Size.SM) {
        updateOffset()
      }
    }, 100)

    onMounted(() => {
      on(window, 'resize', resize)
    })

    onBeforeUnmount(() => {
      off(window, 'resize', resize)
    })

    return () => (
      <TeleportToAny
        visible={visible.value}
        v-slots={{
          default: () => (
            <Transition name="visible">
              <div v-show={visible.value} class={`${prefix}`}>
                <div class={`${prefix}-left`}>
                  <div class={`${prefix}-left-pic`}>
                    <div style={{ backgroundImage: `url(${url.value})` }}></div>
                  </div>
                  <div class={`${prefix}-left-extra`}></div>
                </div>
                <div class={`${prefix}-right`}>
                  <div class={`${prefix}-right--title`}></div>
                  <div ref={contanier} class={`${prefix}-right--lyrice`}>
                    <ve-scroll
                      duartion={200}
                      to={index.value}
                      disabled={disabled.value}
                      offset={offset.value}
                      onStart={() => (disabled.value = true)}
                      onStop={() => (disabled.value = false)}
                    >
                      <ul class={`${prefix}-right--lyrice-contanier`}>
                        {lyrice.value.map((item, i) => (
                          <div
                            class={classnams({
                              'lyrice-active': index.value === i
                            })}
                            data-time={item.time}
                          >
                            {item.lyric}
                          </div>
                        ))}
                      </ul>
                    </ve-scroll>
                  </div>
                </div>
              </div>
            </Transition>
          )
        }}
      ></TeleportToAny>
    )
  }
})

// Fixed the to property of Teleport component could not find Element
export const AsyncComponent = defineAsyncComponent({
  loader: async () => {
    // Parameter penetration
    return <PlayLyrice></PlayLyrice>
  }
})
