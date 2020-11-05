import {
  defineComponent,
  PropType,
  toRefs,
  Transition,
  defineAsyncComponent
} from 'vue'
import { uesModuleStore } from '@/hooks/index'
import { TeleportToAny } from '@/components/teleport-layout/index'
import { NAMESPACED, State, Getter } from '../../module'
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
    const { useGetter } = uesModuleStore<State, Getter>(NAMESPACED)
    const lyrice = useGetter('musicLyrics')

    return () => (
      <TeleportToAny
        v-slots={{
          default: () => (
            <Transition name="visible">
              <div v-show={visible.value} class={`${prefix}`}>
                <div class={`${prefix}-left`}></div>
                <div class={`${prefix}-right`}>
                  <div class={`${prefix}-right--title`}></div>
                  <div class={`${prefix}-right--lyrice`}>
                    <ve-scroll>
                      <ul class={`${prefix}-right--lyrice-contanier`}>
                        {lyrice.map(item => (
                          <div data-time={item.time}>{item.lyric}</div>
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
    return <PlayLyrice></PlayLyrice>
  }
})
