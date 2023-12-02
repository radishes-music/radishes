import { defineComponent, onMounted, ref } from 'vue'
import { ProgressBar as VolumeBar } from '@/components/process-bar/index'
import { toFixed } from '@/utils/index'
import { useFooterModule } from '@/modules'
import { FooterMutations } from '@/interface'
import { AsyncComponent } from './history'
import { Tooltip } from 'ant-design-vue'
import './index.less'
import eventBus from '@/utils/eventBus'
import {
  EVENT_MUSICCONTROL_VOLDOWN_EMITTER,
  EVENT_MUSICCONTROL_VOLUP_EMITTER
} from '@/constants'

const MusicHistory = AsyncComponent as any

export const VolumeAndHistory = defineComponent({
  name: 'VolumeAndHistory',
  setup() {
    const draging = ref(false)
    const visible = ref(false)

    const { useMutations, useState } = useFooterModule()
    const { volume } = useState()
    const current = ref(volume * 100)

    const updateCurrent = (v: number) => {
      current.value = v
      const volume = toFixed(v / 100, 2)
      if (volume) {
        useMutations(FooterMutations.SET_VOLUME, volume < 0 ? 0 : volume)
      }
    }

    onMounted(() => {
      const { volume } = useState()
      volume &&
        useMutations(FooterMutations.SET_VOLUME, volume < 0 ? 0 : volume)

      eventBus.on(EVENT_MUSICCONTROL_VOLDOWN_EMITTER, () => {
        if (current.value === 0) {
          return
        }
        const x = Math.max(current.value - 25, 0)
        updateCurrent(x)
      })

      eventBus.on(EVENT_MUSICCONTROL_VOLUP_EMITTER, () => {
        if (current.value === 100) {
          return
        }
        const x = Math.min(current.value + 25, 100)
        updateCurrent(x)
      })
    })

    const slots = {
      prefix: () => (
        <ve-button type="text">
          <icon icon="volume" color="#333" size={26}></icon>
        </ve-button>
      )
    }

    return () => (
      <div class="volume">
        <div class="volume-bar">
          <VolumeBar
            // https://github.com/vuejs/jsx-next/issues/166
            // v-model={[draging.value, 'indicator']}
            v-model={[draging.value, 'draging']}
            current={current.value}
            onCurrent={updateCurrent}
            canDrage={true}
            v-slots={slots}
          ></VolumeBar>
        </div>
        <MusicHistory v-model={[visible.value, 'visible']} />
        <Tooltip
          v-slots={{
            title: () => <span>历史记录</span>
          }}
        >
          <ve-button
            id="history"
            type="text"
            onClick={(e: Event) => {
              e.stopPropagation()
              visible.value = !visible.value
            }}
          >
            <icon icon="play-list-fill" color="#333" size={20}></icon>
          </ve-button>
        </Tooltip>
      </div>
    )
  }
})
