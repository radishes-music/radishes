import { defineComponent, computed, watch } from 'vue'
import { useRoute } from '@/hooks/index'
import { MusicControl } from '../components/music-controller'
import { VolumeAndHistory } from '../components/volume-history/index'
import { useFooterModule, useLayoutModule, useMainModule } from '@/modules'
import { AsyncComponent } from '../components/lyrics-embed/index'
import { BrowserLyricsFlash } from '../components/lyrics-desktop/browser-lyrics'
import Effect from '../components/effect/index'
import {
  Artists,
  LayoutSize,
  LayoutMutations,
  MainMutations,
  FooterMutations
} from '@/interface'
import classnames from 'classnames'
import { Jump } from '@/shared/jump-shared'
import './index.less'

// Fix JSX element type "AsyncComponent" does not have any construction signature or call signature.
const BrowserLyrics = AsyncComponent as any

export const Footer = defineComponent({
  name: 'Footer',
  setup() {
    const route = useRoute()
    const jump = new Jump()
    const FooterModule = useFooterModule()
    const MainModule = useMainModule()
    const LayoutModule = useLayoutModule()

    const footerState = FooterModule.useState()
    const layoutState = LayoutModule.useState()

    const musicDes = computed(() => FooterModule.useGetter('musicDes'))

    const canShowSongDetail = computed(
      () => footerState.music && layoutState.screenSize !== LayoutSize.SM
    )

    const unfoldLyrics = () => {
      if (canShowSongDetail.value) {
        const visible = !footerState.visibleLyrics
        MainModule.useMutations(MainMutations.IS_SHOW_COVER_CONTAINER, visible)
        FooterModule.useMutations(FooterMutations.VISIBLE_EMBED, visible)
      }
    }

    const toArtist = (artist: Artists) => {
      jump.artist(artist.id)
    }

    const handleRebackSize = () => {
      LayoutModule.useMutations(
        LayoutMutations.CHANGE_WINDOW_SIZE,
        layoutState.rebackSize
      )
    }

    let firstTime = true
    watch(
      () => route.path,
      () => {
        if (firstTime) {
          firstTime = false
        } else {
          MainModule.useMutations(MainMutations.IS_SHOW_COVER_CONTAINER, false)
          FooterModule.useMutations(FooterMutations.VISIBLE_EMBED, false)
        }
      }
    )

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
              onClick={unfoldLyrics}
            ></div>
            <div class="footer-music-des">
              <div class="footer-music-des--title">{musicDes.value.title}</div>
              <div class="footer-music-des--author">
                {musicDes.value.author.map(artist => (
                  <div onClick={() => toArtist(artist)}>{artist.name}</div>
                ))}
              </div>
            </div>
          </div>
          <BrowserLyrics visible={footerState.visibleLyrics} />
          <BrowserLyricsFlash />
          {/* Failed to locate Teleport target with selector "#cover-container" */}
          {/* {<PlayLyrics visible={visibleLyrics.value}></PlayLyrics>} */}
        </div>
        <div class="footer-right">
          <MusicControl />
          <Effect />
          <VolumeAndHistory />
        </div>
        <div class="footer-reduction">
          <ve-button size="small" onClick={handleRebackSize}>
            <icon icon="fullscreen2" color="#000"></icon>
          </ve-button>
        </div>
      </footer>
    )
  }
})
