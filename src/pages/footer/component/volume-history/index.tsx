import { defineComponent, onMounted, ref } from 'vue'
import { ProgressBar as VolumeBar } from '@/components/process-bar/index'
import { uesModuleStore } from '@/hooks/index'
import { toFixed } from '@/utils/index'
import { NAMESPACED, State, Getter, Mutations } from '../../module'
import { AsyncComponent } from './history'
import './index.less'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MusicHistory = AsyncComponent as any

export const VolumeAndHistory = defineComponent({
  name: 'VolumeAndHistory',
  setup() {
    const draging = ref(false)
    const visible = ref(false)

    const { useGetter, useMutations } = uesModuleStore<State, Getter>(
      NAMESPACED
    )

    const volume = useGetter('volume')
    const current = ref(volume * 100)

    const slots = {
      prefix: () => (
        <ve-button type="text">
          <icon icon="volume" color="#333"></icon>
        </ve-button>
      )
    }

    const updateCurrent = (v: number) => {
      current.value = v
      const volume = toFixed(v / 100, 2)
      if (volume) {
        useMutations(Mutations.SET_VOLUME, volume < 0 ? 0 : volume)
      }
    }

    onMounted(() => {
      const volume = useGetter('volume')
      volume && useMutations(Mutations.SET_VOLUME, volume < 0 ? 0 : volume)
    })

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
        <div>
          <MusicHistory v-model={[visible.value, 'visible']} />
          <ve-button
            type="text"
            onClick={(e: Event) => {
              e.stopPropagation()
              visible.value = !visible.value
            }}
          >
            <icon icon="play-list-fill" color="#333"></icon>
          </ve-button>
        </div>
      </div>
    )
  }
})
