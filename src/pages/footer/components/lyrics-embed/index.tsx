import {
  defineComponent,
  PropType,
  toRefs,
  Transition,
  defineAsyncComponent,
  watchEffect,
  computed,
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch
} from 'vue'
import { on, off, maxChildrenScollWidth } from '@/utils/index'
import { TeleportToAny } from '@/components/teleport-layout/index'
import { useFooterModule, useLayoutModule, useDownloadModule } from '@/modules'
import { Image } from '@/components/image'
import {
  LayoutSize,
  FooterMutations,
  DownloadActions,
  Lyrics
} from '@/interface'
import { useSubscribe } from '@/shared/subscribe'
import { debouncedWatch } from '@vueuse/core'
import { debounce } from 'lodash-es'
import classnams from 'classnames'
import './index.less'

const prefix = 'song-details'

export const PlayLyrics = defineComponent({
  name: 'PlayLyrics',
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      required: true,
      default: false
    }
  },
  setup(props) {
    const { visible } = toRefs(props)
    const transition = ref(visible.value)
    const disabled = ref(true)
    const contanier = ref()
    const lyriceContanier = ref<HTMLElement>()
    const offset = ref(0)

    const { useState, useGetter, useMutations } = useFooterModule()
    const LayoutModule = useLayoutModule()
    const DownloadModule = useDownloadModule()
    const subscribe = useSubscribe(true)

    const { screenSize } = toRefs(LayoutModule.useState())

    const lyrics = computed(() => useGetter('musicLyrics'))
    const state = useState()

    const url = computed(() => {
      return state.music?.al.picUrl
    })

    const index = ref(0)
    debouncedWatch(
      () => state.currentTime,
      () => {
        const len = lyrics.value.length
        index.value =
          lyrics.value.findIndex((value, index) => {
            return state.currentTime >= value.time && len - 1 === index
              ? true
              : state.currentTime < lyrics.value[index + 1]?.time
          }) || 0
      },
      {
        debounce: 200
      }
    )

    const updateOffset = () => {
      nextTick(() => {
        offset.value = contanier.value.clientHeight / 2 - 50
        disabled.value = !visible.value
      })
    }

    const updateWidth = () => {
      nextTick(() => {
        if (lyriceContanier.value) {
          const max = maxChildrenScollWidth(lyriceContanier.value)

          useMutations(
            FooterMutations.LYRICS_EMBED_MIN_WIDTH,
            Math.min(max, 530)
          )
        }
      })
    }

    watchEffect(() => {
      if (visible.value) {
        updateOffset()
      }
    })

    watch(visible, updateWidth)
    watch(lyrics, updateWidth)

    const resize = debounce(() => {
      if (visible.value && screenSize.value !== LayoutSize.SM) {
        updateOffset()
      }
    }, 100)

    const handleDownload = () => {
      if (state.music) {
        DownloadModule.useActions(DownloadActions.DOWNLOAD_MUSIC, state.music)
      }
    }

    const handleSubscribe = () => {
      if (state.music) {
        subscribe('1', state.music.id)
      }
    }

    const handleFlyTime = (item: Lyrics) => {
      useMutations(FooterMutations.CURRENT_TIME, item.time)
    }

    onMounted(() => {
      on(window, 'resize', resize)
    })

    onBeforeUnmount(() => {
      off(window, 'resize', resize)
    })

    return () => {
      const minWidth = state.lyriceEmbedMinWidth
      return (
        <TeleportToAny
          visible={transition.value}
          v-slots={{
            default: () => (
              <Transition
                name="visible-left-bottom"
                onBeforeEnter={() => (transition.value = true)}
                onAfterLeave={() => (transition.value = false)}
              >
                <div v-show={visible.value} class={`${prefix}`}>
                  <div class={`${prefix}-center`}>
                    <div class={`${prefix}-left`}>
                      <Image
                        name={classnams(`${prefix}-left-pic`, {
                          [`${prefix}-left-pic--playing`]: state.playing,
                          [`${prefix}-left-pic--pause`]: !state.playing
                        })}
                        src={url.value}
                      />
                      <div class={`${prefix}-left-extra`}>
                        <ve-button type="text" circle onClick={handleSubscribe}>
                          <icon icon="shoucang" size={22} color="#333"></icon>
                        </ve-button>
                        <ve-button type="text" circle onClick={handleDownload}>
                          <icon
                            icon="icondownload"
                            size={24}
                            color="#333"
                          ></icon>
                        </ve-button>
                      </div>
                    </div>
                    <div
                      class={`${prefix}-right`}
                      style={{
                        minWidth: minWidth + 'px'
                      }}
                    >
                      <div class={`${prefix}-right--title`}>
                        {state.music?.name}
                      </div>
                      <div ref={contanier} class={`${prefix}-right--lyrics`}>
                        <ve-scroll
                          duartion={200}
                          to={index.value}
                          disabled={disabled.value}
                          offset={offset.value}
                          onStart={() => (disabled.value = true)}
                          onStop={() => (disabled.value = false)}
                        >
                          <ul
                            ref={lyriceContanier}
                            class={`${prefix}-right--lyrics-contanier`}
                          >
                            {lyrics.value.map((item, i) => (
                              <div
                                class={classnams({
                                  'lyrics-active': index.value === i
                                })}
                                data-time={item.time}
                                onClick={() => handleFlyTime(item)}
                              >
                                {item.lyric}
                              </div>
                            ))}
                          </ul>
                        </ve-scroll>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            )
          }}
        ></TeleportToAny>
      )
    }
  }
})

// Fixed the to property of Teleport component could not find Element
export const AsyncComponent = defineAsyncComponent({
  loader: async () => {
    // Parameter penetration
    return <PlayLyrics></PlayLyrics>
  }
})
