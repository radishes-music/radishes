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
import { on, off } from '@/utils/index'
import classnames from 'classnames'
import { FooterMutations, SongsDetail } from '@/interface'
import { TeleportToAny } from '@/components/teleport-layout/index'
import { Button } from 'ant-design-vue'
import { playMusic } from '@/shared/music-shared'

import './history.less'

const prefix = 'history-music'
const { VUE_APP_PLATFORM } = import.meta.env

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

    const { useState, useMutations } = useFooterModule()

    const { musicStack, musciHistory } = toRefs(useState())

    const handleDbClick = (item: SongsDetail) => {
      playMusic(item.id)
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
                <Button
                  type="link"
                  onClick={() => {
                    if (isPlayListVisible.value) {
                      useMutations(FooterMutations.REMOVE_STACK)
                    } else {
                      useMutations(FooterMutations.REMOVE_HISTORY)
                    }
                  }}
                >
                  删除全部
                </Button>
              </Button.Group>
            </div>
            {isPlayListVisible.value ? (
              <div class={`${prefix}-content`}>
                <Table
                  list={musicStack.value}
                  columnsTypes={['name', 'ar', 'dt', 'remove']}
                  showHeader={false}
                  onDblclick={handleDbClick}
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
                  columnsTypes={['name', 'ar', 'dt', 'remove']}
                  showHeader={false}
                  onDblclick={handleDbClick}
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
