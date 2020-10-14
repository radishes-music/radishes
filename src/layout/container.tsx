import { defineComponent, computed, reactive } from 'vue'
import { Header } from '@/pages/header/view/index'
import { Main } from '@/pages/main/view/index'
import { Footer } from '@/pages/footer/view/index'
import { mapState, mapActions } from './module'
import { ENV } from '@/interface/app'
import { State } from './state'
import './container.less'

const { VUE_APP_PLATFORM } = window as ENV

export const Container = defineComponent({
  computed: {
    ...mapState(['screenSize'])
  },
  render(this: State) {
    const { screenSize } = this
    return (
      <div
        class={[
          'container',
          'container-' + screenSize,
          'container-' + VUE_APP_PLATFORM,
          'container-' + VUE_APP_PLATFORM + '-' + screenSize
        ]}
      >
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
      </div>
    )
  }
})
