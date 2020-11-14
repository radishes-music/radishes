import { defineComponent, toRefs } from 'vue'
import { Sidebar } from '@/pages/sidebar/view/index'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, State } from '../module'
import './index.less'
import { AuthBox } from '../../auth'

export const Main = defineComponent({
  name: 'Main',
  setup() {
    const { useState } = uesModuleStore<State>(NAMESPACED)
    const { isCoverContainer } = toRefs(useState())

    return () => (
      <div class="main-container" id="cover-container">
        <Sidebar></Sidebar>
        <div class="content">
          <router-view></router-view>
        </div>
        {/* Store the content that needs to be displayed in the main content area, and cover the default content */}
        <AuthBox></AuthBox>
      </div>
    )
  }
})
