import { defineComponent } from 'vue'
import { Sidebar } from '@/pages/sidebar/view/index'
import './index.less'

export const Main = defineComponent({
  name: 'Main',
  render() {
    return (
      <div class="main-container">
        <Sidebar></Sidebar>
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    )
  }
})
