import {
  defineComponent,
  nextTick,
  ComponentPublicInstance,
  ref,
  toRefs,
  onMounted,
  watch
} from 'vue'
import { Header } from '@/pages/header/view/index'
import { Main } from '@/pages/main/view/index'
import { Footer } from '@/pages/footer/view/index'
import { ENV } from '@/interface/app'
import { useDrag, uesModuleStore } from '@/hooks/index'
import { State, Size, NAMESPACED } from './module'
import './container.less'

const { VUE_APP_PLATFORM } = window as ENV

export const Container = defineComponent({
  name: 'Container',
  setup() {
    const startDrag = ref()
    const stopDrag = ref()
    const container = ref()
    const target = ref()

    const { useState } = uesModuleStore<State>(NAMESPACED)

    const { screenSize } = toRefs(useState())

    watch(screenSize, v => {
      if (v === Size.MD) {
        startDrag.value()
      } else {
        stopDrag.value()
      }
    })

    onMounted(() => {
      if (VUE_APP_PLATFORM === 'browser') {
        const { start, stop } = useDrag(
          container.value as HTMLElement,
          (target.value as ComponentPublicInstance).$el
        )
        startDrag.value = start
        stopDrag.value = stop
      }
    })

    return () => (
      <div
        ref={container}
        class={[
          'container',
          'container-' + screenSize.value,
          'container-' + VUE_APP_PLATFORM,
          'container-' + VUE_APP_PLATFORM + '-' + screenSize.value
        ]}
      >
        <Header ref={target}></Header>
        <Main></Main>
        <Footer></Footer>
      </div>
    )
  }
})
