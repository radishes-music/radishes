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
import { useFooterModule } from '@/modules'
import { Table } from '@/components-business/table'
import { formatTime, on, off } from '@/utils/index'
import classnames from 'classnames'
import { SongsDetail, FooterMutations } from '@/interface'
import { TeleportToAny } from '@/components/teleport-layout/index'
import { Button } from 'ant-design-vue'
import { playMusic } from '@/shared/music-shared'
import remove from 'lodash/remove'
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
    customRender: ({ text }: { text: SongsDetail[] }) => {
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
  },
  {
    width: 40,
    customRender: ({ text }: { text: SongsDetail }) => {
      const { useMutations, useState } = useFooterModule()

      return (
        <div>
          <ve-button
            type="text"
            onClick={() => {
              if (text.type === 'stack') {
                useMutations(FooterMutations.REMOVE_STACK, text.id)
              }
              if (text.type === 'history') {
                const { musciHistory } = useState()
                remove(musciHistory, (item: SongsDetail) => item.id === text.id)
                useMutations(FooterMutations.REMOVE_HISTORY, text.id)
              }
            }}
          >
            <icon icon="remove" color="#000000a6" size={18}></icon>
          </ve-button>
        </div>
      )
    }
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

    const { useState } = useFooterModule()

    const { musicStack, musciHistory } = toRefs(useState())

    const play = playMusic()
    const handleDbClick = (item: SongsDetail) => {
      play({
        url: item.url,
        id: item.id
      })
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
              <Button.Group>
                <Button
                  type={isPlayListVisible.value ? 'primary' : 'default'}
                  onClick={() =>
                    (isPlayListVisible.value = !isPlayListVisible.value)
                  }
                >
                  播放列表
                </Button>
                <Button
                  type={!isPlayListVisible.value ? 'primary' : 'default'}
                  onClick={() =>
                    (isPlayListVisible.value = !isPlayListVisible.value)
                  }
                >
                  历史记录
                </Button>
              </Button.Group>
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
                    return 'row-music'
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
