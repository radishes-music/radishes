import { defineComponent, nextTick, ComponentPublicInstance, ref } from 'vue'
import { Header } from '@/pages/header/view/index'
import { Main } from '@/pages/main/view/index'
import { Footer } from '@/pages/footer/view/index'
import { mapState } from './module'
import { ENV } from '@/interface/app'
import { State, Size } from './state'
import { dragHook } from '@/utils/hook'
import './container.less'

const { VUE_APP_PLATFORM } = window as ENV

export const Container = defineComponent({
  name: 'Container',
  setup() {
    return {
      start: ref(),
      stop: ref()
    }
  },
  computed: {
    ...mapState(['screenSize'])
  },
  watch: {
    screenSize(v) {
      if (v === Size.MD) {
        this?.start()
      } else {
        this?.stop()
      }
    }
  },
  mounted() {
    if (VUE_APP_PLATFORM === 'browser') {
      nextTick(() => {
        const { container, target } = this.$refs
        const { start, stop } = dragHook(
          container as HTMLElement,
          (target as ComponentPublicInstance).$el
        )
        this.start = start
        this.stop = stop
      })
    }
  },
  render(this: State) {
    const { screenSize } = this
    return (
      <div
        ref="container"
        class={[
          'container',
          'container-' + screenSize,
          'container-' + VUE_APP_PLATFORM,
          'container-' + VUE_APP_PLATFORM + '-' + screenSize
        ]}
      >
        <Header ref="target"></Header>
        <Main></Main>
        <Footer></Footer>
      </div>
    )
  }
})
