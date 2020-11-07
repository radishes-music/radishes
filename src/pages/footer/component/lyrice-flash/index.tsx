import { defineComponent, computed, toRefs, ref, onMounted, watch } from 'vue'
import { uesModuleStore, useDrag } from '@/hooks/index'
import { toFixed } from '@/utils/index'
import { TeleportToAny } from '@/components/teleport-layout/index'
import {
  NAMESPACED as LayoutNamespace,
  State as LayoutState,
  Size
} from '@/layout/module'
import classnames from 'classnames'
import { NAMESPACED, State, Getter, Mutations } from '../../module'
import './index.less'

export const LyriceFlash = defineComponent({
  name: 'LyriceFlash',
  setup() {
    const lyriceEl = ref()

    const { useState, useGetter, useMutations } = uesModuleStore<State, Getter>(
      NAMESPACED
    )
    const LayoutModule = uesModuleStore<LayoutState>(LayoutNamespace)

    const { currentTime, playing, visibleFlash, musicUrl } = toRefs(useState())
    const { screenSize } = toRefs(LayoutModule.useState())

    const lyrice = computed(() =>
      useGetter('musicLyrics').filter(value => value.lyric)
    )

    watch(screenSize, v => {
      if (musicUrl.value) {
        useMutations(Mutations.VISIBLE_FLASH, v === Size.SM)
      }
    })

    const index = computed(() => {
      if (visibleFlash.value) {
        const len = lyrice.value.length
        return (
          lyrice.value.findIndex((value, index) => {
            return currentTime.value >= value.time && len - 1 === index
              ? true
              : currentTime.value < lyrice.value[index + 1]?.time
          }) || 0
        )
      }
      return 0
    })

    const flashMagic = computed(() => {
      if (visibleFlash.value) {
        const cur = lyrice.value[index.value]
        // const schedule = cur.duration - (currentTime.value - cur.time)
        return {
          animationDuration: `${toFixed(cur.duration, 2)}s`
        }
      }
    })

    onMounted(() => {
      const { start } = useDrag(
        lyriceEl.value as HTMLElement,
        lyriceEl.value as HTMLElement,
        {
          moveCB(x, y) {
            requestAnimationFrame(() => {
              lyriceEl.value.style.transform = `matrix(1, 0, 0, 1, ${x}, ${y}) translateZ(0)`
            })
          }
        }
      )
      start()
    })

    return () => (
      <TeleportToAny
        container="body"
        class="lyrice-flash-contanier"
        visible={visibleFlash.value}
      >
        <div ref={lyriceEl} class="lyrice-flash">
          {lyrice.value.map((item, i) => (
            <div
              data-time={item.time}
              data-duration={item.duration}
              class={classnames({
                'lyrice-flash-active': index.value === i,
                'lyrice-flash-pause': !playing.value && index.value === i
              })}
            >
              <div style={index.value === i ? flashMagic.value : ''}>
                {item.lyric}
              </div>
            </div>
          ))}
        </div>
      </TeleportToAny>
    )
  }
})
