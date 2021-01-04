import { defineComponent, PropType, toRefs, ref, computed } from 'vue'
import { Table as ATable } from 'ant-design-vue'
import {
  noop,
  formatTime,
  formatTimeToStandard,
  formatSize
} from '@/utils/index'
import {
  SongsDetail,
  ListFormat,
  FooterMutations,
  DownloadActions,
  SongListColumnsType,
  DownloadMutations
} from '@/interface/index'
import { useDownloadModule, useFooterModule } from '@/modules/index'
import { useSubscribe } from '@/shared/subscribe'
import { getMusicUrl } from '@/shared/music-shared'
import { instance } from '@/components-business/fly/index'
import remove from 'lodash/remove'
import './index.less'

const prefix = 'table'

const columns = [
  {
    width: 40,
    key: 'index',
    align: 'center',
    customRender: ({ index }: { index: number }) => (
      <div class="gay no-hover">{++index < 10 ? '0' + index : index}</div>
    )
  },
  {
    width: 102,
    key: 'control',
    align: 'center',
    customRender: ({ text }: { text: ListFormat }) => {
      const add = ref()
      const { useActions } = useDownloadModule()
      const { useState, useMutations } = useFooterModule()
      const state = useState()
      const subscribe = useSubscribe(true)
      const handleSubscribe = () => {
        subscribe('1', text.id)
      }
      return (
        <div class="vh-center">
          <ve-button type="text" onClick={handleSubscribe}>
            <icon icon="shoucang" className="gay" size={20} />
          </ve-button>
          <ve-button
            type="text"
            onClick={() => {
              useActions(DownloadActions.DOWNLOAD_MUSIC, text)
            }}
          >
            <icon icon="icondownload" className="gay" size={22} />
          </ve-button>
          <ve-button
            ref={add}
            disabled={
              state.musicStack.findIndex(item => item.id === text.id) !== -1
            }
            type="text"
            onDblClick={(e: Event) => e.stopPropagation()}
            onClick={async () => {
              const end = document.querySelector('#history')
              if (end) {
                instance({
                  begin: add.value.$el,
                  end: end,
                  duartion: 0.8
                })
                const data = await getMusicUrl(text.id)
                if (data.length) {
                  const music = {
                    ...text,
                    url: data[0].url,
                    type: 'stack'
                  }
                  useMutations(FooterMutations.SET_PLAYLIST_TO_STACK, [music])
                }
              }
            }}
          >
            <icon icon="add1" className="gay" size={16} />
          </ve-button>
        </div>
      )
    }
  },
  {
    title: '音乐标题',
    ellipsis: true,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '歌手',
    dataIndex: 'ar',
    key: 'ar',
    ellipsis: true,
    customRender: ({ text }: { text: ListFormat['ar'] }) => {
      if (typeof text === 'string' || typeof text === 'undefined') {
        return <div>{text}</div>
      }
      return <div>{text.map(ar => ar.name).join(' / ')}</div>
    }
  },
  {
    title: '专辑',
    dataIndex: 'al',
    key: 'al',
    ellipsis: true,
    customRender: ({ text }: { text: ListFormat['al'] }) => {
      if (typeof text === 'string' || typeof text === 'undefined') {
        return <div>{text}</div>
      }
      return <div>{text.name}</div>
    }
  },
  {
    title: '时长',
    dataIndex: 'dt',
    key: 'dt',
    width: 120,
    customRender: ({ text }: { text: number }) => (
      <div>{formatTime(text, 'millisecond')}</div>
    )
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    width: 120,
    customRender: ({ text }: { text: number }) => <div>{formatSize(text)}</div>
  },
  {
    title: '下载时间',
    dataIndex: 'dlt',
    key: 'dlt',
    width: 160,
    customRender: ({ text }: { text: number }) => (
      <div>{formatTimeToStandard(text)}</div>
    )
  },
  {
    width: 40,
    key: 'remove',
    customRender: ({ text }: { text: SongsDetail }) => {
      const { useMutations } = useFooterModule()
      const downloadModule = useDownloadModule()

      return (
        <div>
          <ve-button
            type="text"
            onClick={() => {
              if (text.type === 'stack') {
                useMutations(FooterMutations.REMOVE_STACK, text.id)
              }
              if (text.type === 'history') {
                useMutations(FooterMutations.REMOVE_HISTORY, text.id)
              }
              if (text.type === 'download') {
                downloadModule.useMutations(
                  DownloadMutations.REMOVE_DOWNLOAD_MUSIC,
                  text.id
                )
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

export const Table = defineComponent({
  name: 'Table',
  props: {
    list: {
      type: Array as PropType<unknown[]>,
      required: true
    },
    columnsTypes: {
      type: Array as PropType<SongListColumnsType[]>,
      default: () => []
    },
    showHeader: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    onDblclick: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Function as PropType<(item: any) => void>,
      default: noop
    },
    rowClassName: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Function as PropType<(item: any) => void>,
      default: () => 'row-music'
    }
  },
  emits: ['dblclick'],
  setup(props, { emit }) {
    const { list, columnsTypes, showHeader, rowClassName } = toRefs(props)

    const renderColumns = computed(() => {
      const col: unknown[] = []
      columnsTypes.value.forEach(item => {
        const c = columns.find(c => c.key === item)
        if (c) {
          col.push(c)
        }
      })
      return col
    })

    return () => (
      <div class={`${prefix}`}>
        {/* <div class={`${prefix}-header`}></div> */}
        <div class={`${prefix}-body`}>
          <ATable
            size="small"
            rowKey="id"
            rowClassName={rowClassName.value}
            pagination={false}
            showHeader={showHeader.value}
            columns={renderColumns.value}
            dataSource={list.value}
            customRow={record => {
              // There is a problem with the ant design vue document, please refer to the link below
              // https://v3.vuejs.org/guide/migration/render-function-api.html#_3-x-syntax-3
              // https://github.com/vueComponent/ant-design-vue/blob/28aeea6f0b142ed68950a3738f7cf2c1581a7a5b/components/table/Table.tsx#L465
              return {
                onClick: (e: Event) => {
                  e.preventDefault()
                },
                onDblclick: (e: Event) => {
                  e.preventDefault()
                  emit('dblclick', record)
                }
              }
            }}
          />
        </div>
        {/* <div class={`${prefix}-pagination`}>
          <Pagination
            v-model={[current.value, 'current']}
            total={list.value.length}
          />
        </div> */}
      </div>
    )
  }
})
