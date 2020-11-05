import {
  defineComponent,
  ref,
  toRefs,
  resolveDynamicComponent,
  resolveComponent
} from 'vue'
import { NAMESPACED, State, LayoutActions } from '@/layout/module'
import { uesModuleStore } from '@/hooks/index'
import { MusicControl } from '../component/music-controller'
import { VolumeAndHistory } from '../component/volume-history/index'
import {
  NAMESPACED as FooterNamespace,
  State as FooterState,
  Getter as FooterGetter
} from '../module'
import {
  NAMESPACED as MainNamespace,
  State as MainState,
  Mutations as MainMutations
} from '@/pages/main/module'
import { AsyncComponent } from '../component/lyrice/index'
import classnames from 'classnames'
import './index.less'

// Fix JSX element type "AsyncComponent" does not have any construction signature or call signature.
const Com = AsyncComponent as any

export const Footer = defineComponent({
  name: 'Footer',
  setup() {
    const visibleLyrice = ref(false)
    const { useState, useMutations } = uesModuleStore<State>(NAMESPACED)
    const FooterModule = uesModuleStore<FooterState, FooterGetter>(
      FooterNamespace
    )
    const MainModule = uesModuleStore<MainState>(MainNamespace)

    const footerState = FooterModule.useState()

    const { rebackSize } = toRefs(useState())

    const unfoldLyrice = () => {
      if (footerState.music) {
        visibleLyrice.value = !visibleLyrice.value
        MainModule.useMutations(
          MainMutations.IS_SHOW_COVER_CONTAINER,
          visibleLyrice.value
        )
      }
    }

    return () => (
      <footer class="footer">
        <div class="footer-left">
          <div class="footer-music-thumbnail">
            <div
              class={classnames('music-pic', {
                'music-pic-active': footerState.music
              })}
              style={{
                backgroundImage: `url(${footerState.music?.al.picUrl})`
              }}
              onClick={unfoldLyrice}
            ></div>
          </div>
          <Com visible={visibleLyrice.value}></Com>
          {/* Failed to locate Teleport target with selector "#cover-container" */}
          {/* {<PlayLyrice visible={visibleLyrice.value}></PlayLyrice>} */}
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
