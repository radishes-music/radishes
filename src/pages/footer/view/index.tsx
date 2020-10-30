import { defineComponent, toRefs } from 'vue'
import { NAMESPACED, State, LayoutActions } from '@/layout/module'
import { uesModuleStore } from '@/hooks/index'
import { MusicControl } from '../component/music-controller'
import { VolumeAndHistory } from '../component/volume-history/index'
import './index.less'

export const Footer = defineComponent({
  name: 'Footer',
  setup() {
    const { useState, useMutations } = uesModuleStore<State>(NAMESPACED)

    const { rebackSize } = toRefs(useState())

    return () => (
      <footer class="footer">
        <div class="footer-left">
          <div class="footer-music-thumbnail"></div>
        </div>
        <div class="footer-right">
          <MusicControl></MusicControl>
          <VolumeAndHistory></VolumeAndHistory>
        </div>
        <div class="footer-reduction">
          <ve-button
            size="small"
            onClick={() =>
              useMutations(LayoutActions.CHANGE_WINDOW_SIZE, rebackSize.value)
            }
          >
            <icon icon="fullscreen2" color="#000"></icon>
          </ve-button>
        </div>
      </footer>
    )
  }
})
