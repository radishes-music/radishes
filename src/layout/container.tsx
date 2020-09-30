import { defineComponent } from 'vue'
import { Header } from '@/pages/header/view/index'
import { Main } from '@/pages/main/view/index'
import { Footer } from '@/pages/footer/view/index'
import './container.less'

export const Container = defineComponent({
  render() {
    console.log(this)
    return (
      <div class="container">
        {this.$slots.default ? (
          this.$slots.default()
        ) : (
          <span>
            <Header></Header>
            <Main></Main>
            <Footer></Footer>
          </span>
        )}
      </div>
    )
  }
})
