import { defineComponent, PropType } from 'vue'
import { Secondary } from '@/layout/secondary/secondary'
import { MoreThen } from '@/components/more-then/index'
import { Table } from '@/components-business/table'
import { FormatSource, ListFormat } from '@/interface/index'
import { noop, formatCount } from '@/utils/index'
import { RouterLink, useRouter } from 'vue-router'
import { Button } from 'ant-design-vue'
import { DailyCard } from '@/components-business/song-list/daily'
import { PlayAll } from '@/components-business/button'
import { useSubscribe } from '@/shared/subscribe'
import { warning } from '@/hooks/index'
import dayjs from 'dayjs'
import './index.less'

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
    },
    onUpdate: {
      type: Function as PropType<() => void>,
      default: noop
    }
  },
  emits: ['playAll', 'playDbl', 'update'],
  setup(props, { emit }) {
    const router = useRouter()
    const subscribe = useSubscribe(false)

    const typeMap = {
      album: '专辑',
      song: '歌单'
    }

    const handleSubscribe = async () => {
      await subscribe(props.source.subscribed ? '2' : '1', props.source.id)
      emit('update')
    }

    const handleDwonloadAll = () => {
      warning('暂不支持批量下载')
    }

    return () => (
      <Secondary
        v-slots={{
          head: () => (
            <>
              {/* <Image src={props.source.src} name={renderClass('coverimg')} /> */}
              <DailyCard
                src={props.source.src}
                name={renderClass('coverimg')}
              />
              <div class={renderClass('des')}>
                <h1>
                  <div>{typeMap[props.source.type]}</div>
                  <strong>{props.source.name}</strong>
                </h1>
                <div class="a-author" v-show={props.source.author}>
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
                        path: '/artist/' + props.source?.author?.id + '/album'
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
                  <PlayAll onClick={() => emit('playAll')} />
                  <Button shape="round" onClick={handleSubscribe}>
                    {props.source.subscribed ? '取消收藏' : '收藏'}
                  </Button>
                  <Button shape="round" onClick={handleDwonloadAll}>
                    下载
                  </Button>
                </div>
                <div class="a-tracks-count">
                  <div v-show={!!props.source.trackCount}>
                    歌曲：{props.source.trackCount}
                  </div>
                  <div v-show={!!props.source.playCount}>
                    播放：{formatCount(props.source.playCount)}
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
                  record.noCopyright ? 'no-copyright' : 'row-music'
                }
                list={props.source.list}
                columnsTypes={['index', 'control', 'name', 'ar', 'al', 'dt']}
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
