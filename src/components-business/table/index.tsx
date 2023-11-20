import { defineComponent, PropType, toRefs, ref, computed, watch } from 'vue'
import {
  Table as ATable,
  Pagination as APagination,
  Skeleton
} from 'ant-design-vue'
import {
  noop,
  formatTime,
  formatTimeToStandard,
  formatSize,
  scrollAnmation
} from '@/utils/index'
import {
  SongsDetail,
  ListFormat,
  FooterMutations,
  DownloadActions,
  SongListColumnsType,
  DownloadMutations,
  Pagination,
  Creator,
  Artist,
  SearchSuggest,
  ArrayItem
} from '@/interface/index'
import { useDownloadModule, useFooterModule } from '@/modules/index'
import { useSubscribe } from '@/shared/subscribe'
import { getMusicUrl } from '@/shared/music-shared'
import { instance } from '@/components-business/fly/index'
import { TweenMap } from 'v-easy-components/src/utils/tween'
import { Image } from '@/components/image'
import Keyword from '@/components/keyword/keyword'
import './index.less'
import { useRoute } from '@/hooks'

const prefix = 'table'

const tween = TweenMap['Quad-easeOut']
const columns = [
  {
    width: 40,
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    customRender: ({ text, index }: { text: number; index: number }) => {
      let i = index
      if (typeof text === 'number') {
        i += text
      }
      return <div class="gay no-hover">{++i < 10 ? '0' + i : i}</div>
    }
  },
  {
    width: 102,
    key: 'control',
    align: 'center',
    customRender: ({ text }: { text: SongsDetail }) => {
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
                  useMutations(FooterMutations.SET_PLAYLIST_TO_STACK, [
                    music as SongsDetail
                  ])
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
    title: '歌词',
    width: 200,
    dataIndex: 'lyrics',
    key: 'lyrics',
    align: 'left',
    customRender: ({
      text
    }: {
      text: {
        txt: string
      }
    }) => {
      const route = useRoute()
      const word = route.query.words as string
      const lyrics = text.txt.split('\n')
      const index = lyrics.findIndex(item => item.includes(word))
      const result = lyrics.slice(index, index + 4)
      return (
        <div class="table-row-lyrics">
          {result.map((item, index) => {
            if (index === 0) {
              return <Keyword keyword={word} text={item} />
            }
            return <span>{item}</span>
          })}
        </div>
      )
    }
  },
  {
    title: '封面',
    width: 140,
    align: 'center',
    dataIndex: 'picUrl',
    key: 'picUrl',
    customRender: ({ text }: { text: string }) => {
      return <Image src={text} name="pic-url" />
    }
  },
  {
    title: '歌曲',
    width: 140,
    align: 'center',
    dataIndex: 'count',
    key: 'count',
    customRender: ({ text }: { text: number }) => {
      return <span>{text} 首</span>
    }
  },
  {
    title: '创建人',
    width: 140,
    align: 'center',
    dataIndex: 'creator',
    key: 'creator',
    customRender: ({ text }: { text: Creator }) => {
      return <span>by {text.nickname}</span>
    }
  },
  {
    title: '作者',
    width: 140,
    align: 'center',
    dataIndex: 'artist',
    key: 'artist',
    customRender: ({ text }: { text: Artist }) => {
      let alias = text.alias.join(' / ')
      if (alias) {
        alias = `(${alias})`
      }
      return (
        <span>
          {text.name}
          {alias}
        </span>
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
    width: 100,
    customRender: ({ text }: { text: ListFormat['ar'] }) => {
      if (typeof text === 'string' || typeof text === 'undefined') {
        return <div>{text || '未知歌手'}</div>
      }
      return <div>{text.map(ar => ar.name).join(' / ')}</div>
    }
  },
  {
    title: '专辑',
    dataIndex: 'al',
    key: 'al',
    ellipsis: true,
    width: 100,
    customRender: ({ text }: { text: ListFormat['al'] }) => {
      if (typeof text === 'string' || typeof text === 'undefined') {
        return <div>{text || '未知专辑'}</div>
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
    width: 80,
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
    total: {
      type: Number as PropType<number>,
      default: 0
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    columnsTypes: {
      type: Array as PropType<SongListColumnsType[]>,
      default: () => []
    },
    showHeader: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    pagination: {
      type: Object as PropType<Pagination>,
      default: () => ({})
    },
    onDblclick: {
      type: Function as PropType<(item: any) => void>,
      default: noop
    },
    onChange: {
      type: Function as PropType<(page: number, size: number) => void>,
      default: noop
    },
    rowClassName: {
      type: Function as PropType<(item: any) => void>,
      default: () => 'row-music'
    }
  },
  emits: ['dblclick', 'change'],
  setup(props, { emit }) {
    const contanier = ref()
    const {
      list,
      columnsTypes,
      showHeader,
      rowClassName,
      pagination,
      total,
      loading
    } = toRefs(props)

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

    const paginationChange = (page: number, size: number) => {
      emit('change', page, size)
    }

    watch(list, () => {
      if (contanier.value) {
        const scrollContanier = contanier.value
        const from = scrollContanier.scrollTop
        scrollAnmation(from, 0, {
          tween: tween,
          duration: 200,
          cb: n => {
            contanier.value && (scrollContanier.scrollTop = n)
          }
        })
      }
    })

    return () => (
      <div class={`${prefix}`} ref={contanier}>
        <Skeleton
          active
          paragraph={{
            rows: 3,
            width: '100%'
          }}
          loading={loading.value}
        >
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
        </Skeleton>
        {pagination.value.limit && (
          <div class={`${prefix}-pagination`}>
            <APagination
              size="small"
              total={total.value}
              pageSize={pagination.value.limit}
              current={pagination.value.offset}
              // @ts-ignore
              onChange={paginationChange}
            />
          </div>
        )}
      </div>
    )
  }
})
