import { defineComponent, computed, toRefs } from 'vue'
import { uesModuleStore } from '@/hooks/index'
import { TeleportToAny } from '@/components/teleport-layout/index'
import {
  NAMESPACED as LayoutNamespace,
  State as LayoutState,
  Size
} from '@/layout/module'
import classnames from 'classnames'
import { NAMESPACED, State, Getter } from '../../module'
import './index.less'

export const LyriceFlash = defineComponent({
  name: 'LyriceFlash',
  setup() {
    const { useState, useGetter } = uesModuleStore<State, Getter>(NAMESPACED)
    const LayoutModule = uesModuleStore<LayoutState>(LayoutNamespace)

    const { screenSize } = toRefs(LayoutModule.useState())
    const { currentTime } = toRefs(useState())

    const lyrice = computed(() =>
      useGetter('musicLyrics').filter(value => value.lyric)
    )
    const visible = computed(() => screenSize.value === Size.SM)

    const index = computed(() => {
      if (visible.value) {
        const len = lyrice.value.length
        return (
          lyrice.value.findIndex((value, index) => {
            return currentTime.value >= value.time && len - 1 === index
              ? true
              : currentTime.value < lyrice.value[index + 1]?.time
          }) || 0
        )
      }
    })

    return () => (
      <TeleportToAny
        container="body"
        class="lyrice-flash-contanier"
        visible={visible.value}
      >
        <div class="lyrice-flash">
          {lyrice.value.map((item, i) => (
            <div
              data-time={item.time}
              class={classnames({
                'lyrice-flash-active': index.value === i
              })}
            >
              {item.lyric}
            </div>
          ))}
        </div>
      </TeleportToAny>
    )
  }
})
