import { defineComponent, ref, toRefs } from 'vue'
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
import './history.less'
import { SongsDetail } from '@/interface'

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
  setup() {
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

    return () => (
      <div class={classnames(prefix, `${prefix}-${VUE_APP_PLATFORM}`)}>
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
    )
  }
})
