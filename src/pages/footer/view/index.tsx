import { defineComponent, computed, watch } from 'vue'
import { useRouter, useRoute } from '@/hooks/index'
import { MusicControl } from '../components/music-controller'
import { VolumeAndHistory } from '../components/volume-history/index'
import { useFooterModule, useLayoutModule, useMainModule } from '@/modules'
import { AsyncComponent } from '../components/lyrice-embed/index'
import { BrowserLyriceFlash } from '../components/lyrice-float/browser-lyrice'
import Effect from '../components/effect/index'
import {
  Artists,
  LayoutSize,
  LayoutMutations,
  MainMutations,
  FooterMutations
} from '@/interface'
import classnames from 'classnames'
import './index.less'

// Fix JSX element type "AsyncComponent" does not have any construction signature or call signature.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BrowserLyrice = AsyncComponent as any

export const Footer = defineComponent({
  name: 'Footer',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const FooterModule = useFooterModule()
    const MainModule = useMainModule()
    const LayoutModule = useLayoutModule()

    const footerState = FooterModule.useState()
    const layoutState = LayoutModule.useState()

    const musicDes = computed(() => FooterModule.useGetter('musicDes'))

    const canShowSongDetail = computed(
      () => footerState.music && layoutState.screenSize !== LayoutSize.SM
    )

    const unfoldLyrice = () => {
      if (canShowSongDetail.value) {
        const visible = !footerState.visibleLyrice
        MainModule.useMutations(MainMutations.IS_SHOW_COVER_CONTAINER, visible)
        FooterModule.useMutations(FooterMutations.VISIBLE_EMBED, visible)
      }
    }

    const toArtist = (artist: Artists) => {
      router.push({
        path: '/artist/' + artist.id + '/album'
      })
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
              onClick={unfoldLyrice}
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
          <BrowserLyrice visible={footerState.visibleLyrice} />
          <BrowserLyriceFlash />
          {/* Failed to locate Teleport target with selector "#cover-container" */}
          {/* {<PlayLyrice visible={visibleLyrice.value}></PlayLyrice>} */}
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
