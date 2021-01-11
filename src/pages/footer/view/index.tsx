import { defineComponent, ref, computed, watchEffect, onUnmounted } from 'vue'
import { useRouter } from '@/hooks/index'
import { MusicControl } from '../components/music-controller'
import { VolumeAndHistory } from '../components/volume-history/index'
import { useFooterModule, useLayoutModule, useMainModule } from '@/modules'
import { AsyncComponent } from '../components/lyrice-embed/index'
import { BrowserLyriceFlash } from '../components/lyrice-float/browser-lyrice'
import {
  Artists,
  LayoutSize,
  LayoutActions,
  MainMutations,
  FooterMutations,
  FooterActions,
  Direction
} from '@/interface'
import { getAverageRGB } from '@/theme/color'
import { Swipe, SwipeItem } from 'vant'
import classnames from 'classnames'
import './index.less'

// Fix JSX element type "AsyncComponent" does not have any construction signature or call signature.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BrowserLyrice = AsyncComponent as any

export const Footer = defineComponent({
  name: 'Footer',
  setup() {
    const color = ref('rgb(243, 243, 243)')

    const router = useRouter()
    const FooterModule = useFooterModule()
    const MainModule = useMainModule()
    const LayoutModule = useLayoutModule()

    const footerState = FooterModule.useState()
    const layoutState = LayoutModule.useState()

    const musicDes = computed(() => FooterModule.useGetter('musicDes'))
    const index = computed(() =>
      footerState.musicStack.findIndex(
        item => item.id === footerState.music?.id
      )
    )

    const canShowSongDetail = computed(
      () => footerState.music && layoutState.screenSize !== LayoutSize.SM
    )

    const stopColor = watchEffect(async () => {
      if (window.isMobile) {
        const src = footerState.music?.al.picUrl
        if (src) {
          const { r, g, b } = await getAverageRGB(src)
          color.value = `rgb(${r}, ${g}, ${b})`
        }
      }
    })

    onUnmounted(() => {
      stopColor()
    })

    const unfoldLyrice = () => {
      if (canShowSongDetail.value) {
        const visible = !footerState.visibleLyrice
        FooterModule.useMutations(FooterMutations.VISIBLE_EMBED, visible)
        MainModule.useMutations(MainMutations.IS_SHOW_COVER_CONTAINER, visible)
      }
    }

    const toArtist = (artist: Artists) => {
      router.push({
        path: '/artist/' + artist.id + '/album'
      })
    }

    const handleRebackSize = () => {
      LayoutModule.useMutations(
        LayoutActions.CHANGE_WINDOW_SIZE,
        layoutState.rebackSize
      )
    }

    const handleSwitch = (i: number) => {
      if (i > index.value) {
        FooterModule.useActions(FooterActions.CUTOVER_TRACK, Direction.NEXT)
      } else {
        FooterModule.useActions(FooterActions.CUTOVER_TRACK, Direction.PREV)
      }
    }

    return () => (
      <footer
        class={classnames('footer', {
          'footer--mobile': window.isMobile
        })}
        style={{
          backgroundColor: color.value
        }}
      >
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
              {window.isMobile ? (
                <Swipe
                  show-indicators={false}
                  initial-swipe={index.value}
                  onChange={handleSwitch}
                >
                  {footerState.musicStack.map(item => (
                    <SwipeItem>
                      <>
                        <div class="footer-music-des--title">{item.name}</div>
                        <div class="footer-music-des--author">
                          {item.ar.map(artist => (
                            <div onClick={() => toArtist(artist)}>
                              {artist.name}
                            </div>
                          ))}
                        </div>
                      </>
                    </SwipeItem>
                  ))}
                </Swipe>
              ) : (
                <>
                  <div class="footer-music-des--title">
                    {musicDes.value.title}
                  </div>
                  <div class="footer-music-des--author">
                    {musicDes.value.author.map(artist => (
                      <div onClick={() => toArtist(artist)}>{artist.name}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <BrowserLyrice visible={footerState.visibleLyrice} />
          {!window.isMobile && <BrowserLyriceFlash />}

          {/* Failed to locate Teleport target with selector "#cover-container" */}
          {/* {<PlayLyrice visible={visibleLyrice.value}></PlayLyrice>} */}
        </div>
        <div class="footer-right">
          <MusicControl />
          {!window.isMobile && <VolumeAndHistory />}
        </div>
        {!window.isMobile && (
          <div class="footer-reduction">
            <ve-button size="small" onClick={handleRebackSize}>
              <icon icon="fullscreen2" color="#000"></icon>
            </ve-button>
          </div>
        )}
      </footer>
    )
  }
})
