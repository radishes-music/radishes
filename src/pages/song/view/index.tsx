import { defineComponent, toRaw, toRefs, watch } from 'vue'
import { uesModuleStore, useRoute } from '@/hooks/index'
import { NAMESPACED, SongState, Actions, Tracks } from '../module'
import { Table } from '@/components/table'
import { formatTime } from '@/utils/index'
import { MoreThen } from '@/components/more-then/index'
import dayjs from 'dayjs'
import { FooterNameSpaced } from '@/modules/index'
import {
  FooterState,
  FooterActions,
  FooterMutations
} from '@/pages/footer/module'
import { getSongUrl } from '@/api/index'
import './index.less'
import { RouterLink } from 'vue-router'

const renderClass = (name: string) => `song-list-${name}`

const columns = [
  {
    width: 80,
    align: 'center',
    customRender: ({ index }: { index: number }) => (
      <div>{++index < 10 ? '0' + index : index}</div>
    )
  },
  {
    title: '音乐标题',
    ellipsis: true,
    customRender: ({ text }: { text: Tracks }) => {
      return (
        <div
          style={{
            color: text.noCopyrightRcmd?.typeDesc ? '#eee' : ''
          }}
        >
          {text.name}
        </div>
      )
    }
  },
  {
    title: '歌手',
    dataIndex: 'ar',
    key: 'ar',
    ellipsis: true,
    customRender: ({ text }: { text: Tracks['ar'] }) => {
      return <div>{text.map(ar => ar.name).join(' / ')}</div>
    }
  },
  {
    title: '专辑',
    dataIndex: 'al',
    key: 'al',
    ellipsis: true,
    customRender: ({ text }: { text: Tracks['al'] }) => {
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

export default defineComponent({
  name: 'SongListDetails',
  setup() {
    const route = useRoute()
    const { useActions, useState } = uesModuleStore<SongState>(NAMESPACED)
    const footerStore = uesModuleStore<FooterState>(FooterNameSpaced)

    useActions(Actions.GET_PLAYLIST, route.params.playlist)

    watch(
      () => route.params.playlist,
      v => {
        if (v) {
          useActions(Actions.GET_PLAYLIST, v)
        }
      }
    )

    const { playlist } = toRefs(useState())

    const handleDbClick = (item: Tracks) => {
      footerStore.useMutations(FooterMutations.PAUES_MUSIC)
      footerStore.useActions(FooterActions.SET_MUSIC, item.id)
    }

    const playAll = async () => {
      const tracks = toRaw(playlist.value.tracks)
      const tracksDetail = await getSongUrl(tracks.map(item => item.id))
      const stack = tracks.map(item => {
        const urlItem = tracksDetail.find(o => o.id === item.id)
        return {
          ...item,
          url: urlItem?.url
        }
      })
      footerStore.useMutations(FooterMutations.SET_PLAYLIST_TO_STACK, stack)

      const { music } = footerStore.useState()
      if (music?.id !== stack[0].id) {
        footerStore.useMutations(FooterMutations.PAUES_MUSIC)
        await footerStore.useActions(FooterActions.SET_MUSIC, {
          id: stack[0].id,
          url: stack[0].url
        })
        footerStore.useMutations(FooterMutations.PLAY_MUSIC)
      }
    }

    return () => (
      <div class={renderClass('details')}>
        <div class={renderClass('details-contanier')}>
          <div class={renderClass('details-contanier--coverimg bg-img')}>
            {/* @ts-ignore */}
            <img src={playlist.value.coverImgUrl} loading="lazy" />
          </div>
          <div class={renderClass('details-contanier--des')}>
            <h1>{playlist.value.name}</h1>
            <div class="a-author">
              <div
                class="a-author-coverimg"
                style={{
                  backgroundImage: `url("${playlist.value.creator?.avatarUrl}")`
                }}
              ></div>
              <i class="a-author-name">{playlist.value.creator?.nickname}</i>
              <i class="a-create-time">
                {dayjs(playlist.value.createTime).format('YYYY-MM-DD')}创建
              </i>
            </div>
            <div class="a-command-contanier">
              <a-button
                class="play-all"
                shape="round"
                v-slots={{ icon: () => <icon icon="play-copy" size={18} /> }}
                onClick={playAll}
              >
                播放全部
              </a-button>
              <a-button shape="round">收藏</a-button>
              <a-button shape="round">下载</a-button>
            </div>
            <div class="a-tracks-count">
              <div>歌曲：{playlist.value.trackCount}</div>
              <div>播放：{playlist.value.playCount}</div>
            </div>
            <div class="a-tracks-count">
              标签：
              {playlist.value.tags.map(tag => (
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
                rely={playlist.value.description}
                v-slots={{
                  default: () => (
                    <div // TODO xss
                      v-html={playlist.value.description
                        ?.split('\n')
                        .join('<br>')}
                    ></div>
                  )
                }}
              ></MoreThen>
            </div>
          </div>
        </div>
        <div class={renderClass('details-content')}>
          <Table
            list={playlist.value.tracks}
            columns={columns}
            onDblClick={handleDbClick}
          />
        </div>
      </div>
    )
  }
})
