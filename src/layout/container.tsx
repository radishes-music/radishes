import {
  defineComponent,
  ComponentPublicInstance,
  ref,
  toRefs,
  onMounted,
  watch
} from 'vue'
import { RecommendMutations, LayoutSize } from '@/interface/index'
import { Header } from '@/pages/header/view/index'
import { Main } from '@/pages/main/view/index'
import { Footer } from '@/pages/footer/view/index'
import { Schedule } from '@/components/schedule/index'
import AutoDwonload from '@/components-business/auto/auto'
import { useDrag } from '@/hooks/index'
import { useRecommendModule, useLayoutModule } from '@/modules/index'
import { message } from 'ant-design-vue'
import { isBrowser, isElectron } from '@/utils'
import { useOnline } from '@vueuse/core'
import Offline from '@/components-business/offline/offline'
import store from '@/store/index'
import classnames from 'classnames'
import './container.less'

const { VUE_APP_PLATFORM } = import.meta.env

export const Container = defineComponent({
  name: 'Container',
  setup() {
    const startDrag = ref()
    const stopDrag = ref()
    const draging = ref(false)
    const container = ref()
    const target = ref()

    const online = useOnline()
    const { useState } = useLayoutModule()
    const RecommendStore = useRecommendModule()

    const { screenSize } = toRefs(useState())

    if (isBrowser) {
      watch(screenSize, v => {
        if (v === LayoutSize.MD) {
          startDrag.value()
        } else {
          stopDrag.value()
        }
      })
    }

    onMounted(() => {
      message.config({
        top: container.value.getBoundingClientRect().top + 80 + 'px'
      })
      if (isBrowser) {
        const { start, stop } = useDrag(
          container.value as HTMLElement,
          (target.value as ComponentPublicInstance).$el,
          {
            moveCB(x, y) {
              requestAnimationFrame(() => {
                container.value.style.transform = `matrix(1, 0, 0, 1, ${x}, ${y}) translateZ(0)`
              })
            },
            startCB() {
              draging.value = true
              RecommendStore.useMutations(
                RecommendMutations.SET_SWIPER_RINNING,
                false
              )
            },
            stopCB() {
              draging.value = false
              RecommendStore.useMutations(
                RecommendMutations.SET_SWIPER_RINNING,
                true
              )
            }
          }
        )
        start()
        startDrag.value = start
        stopDrag.value = stop
      }
      if (isElectron) {
        // TODO
      }
    })

    return () => (
      <div
        ref={container}
        class={classnames(
          [
            'container',
            'container-' + (online.value ? 'online' : 'offline'),
            'container-' + screenSize.value,
            'container-' + VUE_APP_PLATFORM,
            'container-' + VUE_APP_PLATFORM + '-' + screenSize.value
          ],
          {
            'container-draging': draging.value,
            ' rounded-lg overflow-hidden': isBrowser
          }
        )}
      >
        <Header ref={target} />
        <Offline />
        <Schedule percentage={store.state.percentage}>
          <Main />
        </Schedule>
        <Footer />
        {isElectron && <AutoDwonload />}
      </div>
    )
  }
})
