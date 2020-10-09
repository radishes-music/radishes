import { defineComponent } from 'vue'
import { Sidebar } from '@/pages/sidebar/view/index'

export const Main = defineComponent({
  render() {
    return (
      <main>
        <Sidebar></Sidebar>
        <div class="main">
          <router-view></router-view>
        </div>
      </main>
    )
  }
})
