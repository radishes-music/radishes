import { defineComponent } from 'vue'
import { Sidebar } from '@/pages/sidebar/view/index'

export const Main = defineComponent({
  render() {
    return (
      <main>
        <Sidebar></Sidebar>
      </main>
    )
  }
})
