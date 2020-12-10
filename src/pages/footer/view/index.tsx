import { defineComponent, ref, toRefs, computed } from 'vue'
import { NAMESPACED, State, LayoutActions } from '@/layout/module'
import { uesModuleStore } from '@/hooks/index'
import { MusicControl } from '../components/music-controller'
import { VolumeAndHistory } from '../components/volume-history/index'
import {
  NAMESPACED as FooterNamespace,
  FooterState,
  Getter as FooterGetter
} from '../module'
import {
  NAMESPACED as MainNamespace,
  State as MainState,
  Mutations as MainMutations
} from '@/pages/main/module'
import {
  NAMESPACED as LayoutNamespace,
  State as LayoutState,
  Size
} from '@/layout/module'
import { AsyncComponent } from '../components/lyrice-embed/index'
import { BrowserLyriceFlash } from '../components/lyrice-float/browser-lyrice'
import classnames from 'classnames'
import './index.less'

// Fix JSX element type "AsyncComponent" does not have any construction signature or call signature.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BrowserLyrice = AsyncComponent as any

export const Footer = defineComponent({
  name: 'Footer',
  setup() {
    const visibleLyrice = ref(false)

    const { useState, useMutations } = uesModuleStore<State>(NAMESPACED)
    const FooterModule = uesModuleStore<FooterState, FooterGetter>(
      FooterNamespace
    )
    const MainModule = uesModuleStore<MainState>(MainNamespace)
    const LayoutModule = uesModuleStore<LayoutState>(LayoutNamespace)

    const footerState = FooterModule.useState()
    const layoutState = LayoutModule.useState()

    const musicDes = computed(() => FooterModule.useGetter('musicDes'))

    const { rebackSize } = toRefs(useState())

    const canShowSongDetail = computed(
      () => footerState.music && layoutState.screenSize !== Size.SM
    )

    const unfoldLyrice = () => {
      if (canShowSongDetail.value) {
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
                'music-pic-active': canShowSongDetail.value
              })}
              style={{
                backgroundImage: `url(${footerState.music?.al.picUrl})`
              }}
              onClick={unfoldLyrice}
            ></div>
            <div class="footer-music-des">
              <div class="footer-music-des--title">{musicDes.value.title}</div>
              <div class="footer-music-des--author">
                {musicDes.value.author}
              </div>
            </div>
          </div>
          <BrowserLyrice visible={visibleLyrice.value} />
          <BrowserLyriceFlash />
          {/* Failed to locate Teleport target with selector "#cover-container" */}
          {/* {<PlayLyrice visible={visibleLyrice.value}></PlayLyrice>} */}
        </div>
        <div class="footer-right">
          <MusicControl />
          <VolumeAndHistory />
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
