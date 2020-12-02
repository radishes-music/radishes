import {
  defineComponent,
  defineAsyncComponent,
  PropType,
  ref,
  toRefs,
  onUnmounted,
  watch,
  Transition
} from 'vue'
import { uesModuleStore } from '@/hooks/index'
import {
  NAMESPACED,
  State,
  Getter,
  Music,
  Mutations,
  Actions
} from '../../module'
import { Table } from '@/components/table'
import { formatTime } from '@/utils/index'
import classnames from 'classnames'
import { SongsDetail } from '@/interface'
import { TeleportToAny } from '@/components/teleport-layout/index'
import { on, off } from '@/utils/index'
import './history.less'

const prefix = 'history-music'
const { VUE_APP_PLATFORM } = process.env

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    ellipsis: true
  },
  {
    dataIndex: 'ar',
    key: 'ar',
    ellipsis: true,
    customRender: ({ text }: { text: Music[] }) => {
      return <div>{text.map(ar => ar.name).join(' / ')}</div>
    }
  },
  {
    dataIndex: 'dt',
    key: 'dt',
    width: 80,
    customRender: ({ text }: { text: number }) => (
      <div>{formatTime(text, 'millisecond')}</div>
    )
  }
]

export const MusicHistory = defineComponent({
  name: 'MusicHistory',
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const { visible } = toRefs(props)

    const transition = ref(visible.value)
    const isPlayListVisible = ref(true)

    const { useState, useActions, useMutations } = uesModuleStore<
      State,
      Getter
    >(NAMESPACED)

    const { musicStack, musciHistory } = toRefs(useState())

    const handleDbClick = (item: Music) => {
      useMutations(Mutations.PAUES_MUSIC)
      useActions(Actions.SET_MUSIC, item.id)
    }

    const trigger = () => {
      emit('update:visible', false)
    }

    const unWatch = watch(visible, v => {
      if (v) {
        on(document.documentElement, 'click', trigger)
      } else {
        off(document.documentElement, 'click', trigger)
      }
    })

    onUnmounted(() => {
      unWatch()
    })

    return () => (
      <TeleportToAny visible={transition.value}>
        <Transition
          name="visible-right-bottom"
          onBeforeEnter={() => (transition.value = true)}
          onAfterLeave={() => (transition.value = false)}
        >
          <div
            v-show={visible.value}
            class={classnames(prefix, `${prefix}-${VUE_APP_PLATFORM}`)}
            onClick={e => e.stopPropagation()}
          >
            <div class={`${prefix}-control`}>
              <a-button-group>
                <a-button
                  type={isPlayListVisible.value ? 'primary' : 'default'}
                  onClick={() =>
                    (isPlayListVisible.value = !isPlayListVisible.value)
                  }
                >
                  播放列表
                </a-button>
                <a-button
                  type={!isPlayListVisible.value ? 'primary' : 'default'}
                  onClick={() =>
                    (isPlayListVisible.value = !isPlayListVisible.value)
                  }
                >
                  历史记录
                </a-button>
              </a-button-group>
            </div>
            {isPlayListVisible.value ? (
              <div class={`${prefix}-content`}>
                <Table
                  list={musicStack.value}
                  columns={columns}
                  showHeader={false}
                  onDblClick={handleDbClick}
                  rowClassName={(record: SongsDetail) => {
                    const { music } = useState()
                    if (record.id === music?.id) {
                      return 'active-play'
                    }
                  }}
                />
              </div>
            ) : (
              <div class={`${prefix}-content`}>
                <Table
                  list={musciHistory.value}
                  columns={columns}
                  showHeader={false}
                  onDblClick={handleDbClick}
                />
              </div>
            )}
          </div>
        </Transition>
      </TeleportToAny>
    )
  }
})

// Fixed the to property of Teleport component could not find Element
export const AsyncComponent = defineAsyncComponent({
  loader: async () => {
    // Parameter penetration
    return <MusicHistory></MusicHistory>
  }
})
