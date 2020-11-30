import {
  defineComponent,
  ComponentPublicInstance,
  ref,
  toRefs,
  onMounted,
  watch
} from 'vue'
import classnames from 'classnames'
import { Header } from '@/pages/header/view/index'
import { Main } from '@/pages/main/view/index'
import { Footer } from '@/pages/footer/view/index'
import { useDrag, uesModuleStore } from '@/hooks/index'
import { State, Size, NAMESPACED } from './module'
import { RecommendNameSpaced } from '@/modules/index'
import { FindMusicInteface } from '@/interface/index'
import { Platform } from '@/config/build'
import './container.less'

const { VUE_APP_PLATFORM } = process.env

export const Container = defineComponent({
  name: 'Container',
  setup() {
    const startDrag = ref()
    const stopDrag = ref()
    const draging = ref(false)
    const container = ref()
    const target = ref()

    const { useState } = uesModuleStore<State>(NAMESPACED)
    const RecommendStore = uesModuleStore<FindMusicInteface.RecommendState>(
      RecommendNameSpaced
    )

    const { screenSize } = toRefs(useState())

    watch(screenSize, v => {
      if (v === Size.MD) {
        startDrag.value()
      } else {
        stopDrag.value()
      }
    })

    onMounted(() => {
      if (VUE_APP_PLATFORM === Platform.BROWSER) {
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
                FindMusicInteface.RecommendMutations.SET_SWIPER_RINNING,
                false
              )
            },
            stopCB() {
              draging.value = false
              RecommendStore.useMutations(
                FindMusicInteface.RecommendMutations.SET_SWIPER_RINNING,
                true
              )
            }
          }
        )
        start()
        startDrag.value = start
        stopDrag.value = stop
      }
      if (VUE_APP_PLATFORM === Platform.ELECTRON) {
        // TODO
      }
    })

    return () => (
      <div
        ref={container}
        class={classnames(
          [
            'container',
            'container-' + screenSize.value,
            'container-' + VUE_APP_PLATFORM,
            'container-' + VUE_APP_PLATFORM + '-' + screenSize.value
          ],
          {
            'container-draging': draging.value
          }
        )}
      >
        <Header ref={target} />
        <Main />
        <Footer />
      </div>
    )
  }
})
