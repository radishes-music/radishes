import { defineComponent, ref, nextTick, ComponentPublicInstance } from 'vue'
import { Header } from '@/pages/header/view/index'
import { Main } from '@/pages/main/view/index'
import { Footer } from '@/pages/footer/view/index'
import { mapState, mapActions } from './module'
import { ENV } from '@/interface/app'
import { State } from './state'
import { dragHook } from '@/utils/hook'
import './container.less'

const { VUE_APP_PLATFORM } = window as ENV

export const Container = defineComponent({
  setup() {
    const start = ref(null)
    const stop = ref(null)

    return {
      start,
      stop
    }
  },
  computed: {
    ...mapState(['screenSize'])
  },
  mounted() {
    if (VUE_APP_PLATFORM === 'browser') {
      nextTick(() => {
        const { container, target } = this.$refs
        const { start, stop } = dragHook(
          container as HTMLElement,
          (target as ComponentPublicInstance).$el
        )
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
