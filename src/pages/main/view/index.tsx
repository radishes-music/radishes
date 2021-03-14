import {
  defineComponent,
  KeepAlive,
  Component,
  resolveDynamicComponent
} from 'vue'
import { RouterView } from 'vue-router'
import { Sidebar } from '@/pages/sidebar/view/index'
import { AuthBox } from '@/pages/auth/views'
import './index.less'

export const Main = defineComponent({
  name: 'Main',
  setup() {
    const Slots = {
      default: (component: { Component: Component }) => {
        return (
          <KeepAlive exclude={['FollowView']}>
            {resolveDynamicComponent(component.Component)}
          </KeepAlive>
        )
      }
    }

    return () => (
      <div class="main-container" id="cover-container">
        <Sidebar></Sidebar>
        <div class="content">
          <RouterView v-slots={Slots}></RouterView>
        </div>
        {/* Store the content that needs to be displayed in the main content area, and cover the default content */}
        <AuthBox></AuthBox>
      </div>
    )
  }
})
