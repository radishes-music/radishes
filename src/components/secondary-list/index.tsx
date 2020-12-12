import { defineComponent, PropType } from 'vue'
import { Secondary } from '@/layout/secondary/secondary'
import { Image } from '@/components/image/index'
import { MoreThen } from '@/components/more-then/index'
import { Table } from '@/components/table'
import { FormatSource, ListFormat, SongsBase } from '@/interface/index'
import { formatTime, noop, download } from '@/utils/index'
import { getSongUrl } from '@/api/index'
import { RouterLink, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import './index.less'

const columns = [
  {
    width: 40,
    align: 'center',
    customRender: ({ index }: { index: number }) => (
      <div class="gay no-hover">{++index < 10 ? '0' + index : index}</div>
    )
  },
  {
    width: 70,
    align: 'center',
    customRender: ({ text }: { text: ListFormat }) => (
      <div>
        <ve-button type="text">
          <icon icon="shoucang" className="gay" size={20} />
        </ve-button>
        <ve-button
          type="text"
          onClick={async () => {
            const url = await getSongUrl<SongsBase[]>(text.id)
            download(url[0].url, text.name)
          }}
        >
          <icon icon="icondownload" className="gay" size={22} />
        </ve-button>
      </div>
    )
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
      return <div>{text.map(ar => ar.name).join(' / ')}</div>
    }
  },
  {
    title: '专辑',
    dataIndex: 'al',
    key: 'al',
    ellipsis: true,
    customRender: ({ text }: { text: ListFormat['al'] }) => {
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
  }
]

const renderClass = (name: string) => `secondary-list-${name}`

export const SecondaryList = defineComponent({
  name: 'SecondaryList',
  props: {
    type: {
      type: String as PropType<string>,
      default: 'song'
    },
    source: {
      type: Object as PropType<FormatSource>,
      default: () => ({})
    },
    onPlayAll: {
      type: Function as PropType<() => void>,
      default: noop
    },
    onPlayDbl: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: Function as PropType<(item: any) => void>,
      default: noop
    }
  },
  emits: ['playAll', 'playDbl'],
  setup(props, { emit }) {
    const router = useRouter()

    const typeMap = {
      album: '专辑',
      song: '歌单'
    }

    return () => (
      <Secondary
        v-slots={{
          head: () => (
            <>
              <Image src={props.source.src} name={renderClass('coverimg')} />
              <div class={renderClass('des')}>
                <h1>
                  <div>{typeMap[props.source.type]}</div>
                  {props.source.name}
                </h1>
                <div class="a-author">
                  <div
                    class="a-author-coverimg"
                    style={{
                      backgroundImage: `url("${props.source.author?.src}")`
                    }}
                  ></div>
                  <i
                    class="a-author-name"
                    onClick={() => {
                      router.push({
                        path: '/artist/' + props.source.author.id + '/album'
                      })
                    }}
                  >
                    {props.source.author?.name}
                  </i>
                  <i class="a-create-time">
                    {dayjs(props.source.time).format('YYYY-MM-DD')}
                    创建
                  </i>
                </div>
                <div class="a-command-contanier">
                  <a-button
                    class="play-all"
                    shape="round"
                    v-slots={{
                      icon: () => <icon icon="play-copy" size={18} />
                    }}
                    onClick={() => {
                      emit('playAll')
                    }}
                  >
                    播放全部
                  </a-button>
                  <a-button shape="round">收藏</a-button>
                  <a-button shape="round">下载</a-button>
                </div>
                <div class="a-tracks-count">
                  <div v-show={!!props.source.trackCount}>
                    歌曲：{props.source.trackCount}
                  </div>
                  <div v-show={!!props.source.playCount}>
                    播放：{props.source.playCount}
                  </div>
                </div>
                <div v-show={!!props.source.tags} class="a-tracks-count">
                  标签：
                  {props.source.tags?.map(tag => (
                    <RouterLink
                      to={{
                        name: 'songlist',
                        query: {
                          tag: tag
                        }
                      }}
                    >
                      {tag}
                    </RouterLink>
                  ))}
                </div>

                <div class="a-description">
                  <div>简介：</div>
                  <MoreThen
                    equal={44}
                    rely={props.source.description}
                    v-slots={{
                      default: () => (
                        <div
                          v-html={props.source.description
                            ?.split('\n')
                            .join('<br>')}
                        ></div>
                      )
                    }}
                  ></MoreThen>
                </div>
              </div>
            </>
          ),
          body: () => (
            <div class={renderClass('content')}>
              <Table
                rowClassName={(record: ListFormat) =>
                  record.noCopyright ? 'no-copyright' : ''
                }
                list={props.source.list}
                columns={columns}
                onDblClick={e => {
                  emit('playDbl', e)
                }}
              />
            </div>
          )
        }}
      />
    )
  }
})
