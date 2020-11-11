import { defineComponent } from 'vue'
import { Sidebar } from '@/pages/sidebar/view/index'
import './index.less'

export const Main = defineComponent({
  name: 'Main',
  setup() {
    return () => (
      <div class="main-container" id="cover-container">
        <Sidebar></Sidebar>
        <div class="content">
          <router-view></router-view>
        </div>
        {/* Store the content that needs to be displayed in the main content area, and cover the default content */}
      </div>
    )
  }
})
