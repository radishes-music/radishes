import { defineComponent, PropType } from 'vue'
import { SecondaryLayout } from '@/layout/secondary/secondary'
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
import classnames from 'classnames'
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
      <SecondaryLayout
        src={props.source.src}
        v-slots={{
          head: () => (
            <>
              {/* <Image src={props.source.src} name={renderClass('coverimg')} /> */}
              <DailyCard
                src={props.source.src}
                name={classnames(renderClass('coverimg'), {
                  [renderClass('coverimg--mobile')]: window.isMobile
                })}
              />
              <div
                class={classnames(renderClass('des'), {
                  [renderClass('des--mobile')]: window.isMobile
                })}
              >
                <h1>
                  <div v-show={!window.isMobile}>
                    {typeMap[props.source.type]}
                  </div>
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
                  {!window.isMobile && (
                    <i class="a-create-time">
                      {dayjs(props.source.time).format('YYYY-MM-DD')}
                      创建
                    </i>
                  )}
                </div>
                <div class="a-command-contanier" v-show={!window.isMobile}>
                  <PlayAll onClick={() => emit('playAll')} />
                  <Button shape="round" onClick={handleSubscribe}>
                    {props.source.subscribed ? '取消收藏' : '收藏'}
                  </Button>
                  <Button shape="round" onClick={handleDwonloadAll}>
                    下载
                  </Button>
                </div>
                <div class="a-tracks-count" v-show={!window.isMobile}>
                  <div v-show={!!props.source.trackCount}>
                    歌曲：{props.source.trackCount}
                  </div>
                  <div v-show={!!props.source.playCount}>
                    播放：{formatCount(props.source.playCount)}
                  </div>
                </div>
                <div
                  v-show={!!props.source.tags && !window.isMobile}
                  class="a-tracks-count"
                >
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

                {!window.isMobile ? (
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
                ) : (
                  <div class="a-description--mobile">
                    <div>简介：{props.source.description}</div>
                  </div>
                )}
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
                columnsTypes={
                  window.isMobile
                    ? ['index', 'control', 'name', 'ar']
                    : ['index', 'control', 'name', 'ar', 'al', 'dt']
                }
                onDblclick={e => {
                  emit('playDbl', e)
                }}
                onClick={e => {
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
