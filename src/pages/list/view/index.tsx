import {
  computed,
  defineComponent,
  toRaw,
  toRefs,
  watch,
  ComputedRef
} from 'vue'
import { uesModuleStore, useRoute } from '@/hooks/index'
import { NAMESPACED, SongState, SongActions, Tracks } from '../module'
import { FooterNameSpaced } from '@/modules/index'
import { FooterState, FooterMutations } from '@/pages/footer/module'
import { getSongUrl } from '@/api/index'
import { SongsBase, FormatSource, SongsDetail } from '@/interface'
import { SecondaryList } from '@/components-business/secondary-list'
import { playMusic } from '@/shared/music-shared'
import './index.less'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isCopyright = (song: SongsDetail) => {
  // Currently does not clear which values are used to determine whether there is copyright
  // return song.fee === 0 && song.no === 1
  return true
}

const formatPlayListData = (
  item: SongState['playlist'],
  id: string
): FormatSource => {
  if (id === '-1') {
    return {
      id: Number(id),
      src: '',
      type: 'song',
      name: '每日歌曲推荐',
      description: '每日歌曲推荐',
      list: [
        ...item.tracks.map(o => ({
          ...o,
          noCopyright: !isCopyright(o)
        }))
      ]
    }
  }
  return {
    id: item.id,
    name: item.name,
    src: item.coverImgUrl,
    type: 'song',
    author: {
      src: item.creator?.avatarUrl,
      id: item.creator?.userId,
      name: item.creator?.nickname
    },
    time: item.createTime,
    trackCount: item.trackCount,
    playCount: item.playCount,
    description: item.description,
    tags: item.tags,
    list: [
      ...item.tracks.map(o => ({
        ...o,
        noCopyright: !isCopyright(o)
      }))
    ]
  }
}

const formatAlbumListData = (item: SongState['albumList']): FormatSource => {
  return {
    id: item.album.id,
    name: item.album.name,
    src: item.album.picUrl,
    type: 'album',
    author: {
      src: item.album.artist?.picUrl,
      id: item.album.artist?.id,
      name: item.album.artist?.name
    },
    time: item.album.publishTime,
    trackCount: item.album.trackCount,
    playCount: item.album.playCount,
    description: item.album.description,
    list: [
      ...item.song.map(o => ({
        ...o,
        noCopyright: !isCopyright(o)
      }))
    ]
  }
}

export default defineComponent({
  name: 'SongListDetails',
  setup() {
    const route = useRoute()
    const { useActions, useState } = uesModuleStore<SongState>(NAMESPACED)
    const footerStore = uesModuleStore<FooterState>(FooterNameSpaced)

    const type = computed(() => route.params.type) as ComputedRef<string>

    watch(
      () => route.params.playlist,
      v => {
        if (v === '-1') {
          type.value === 'song' &&
            useActions(SongActions.SET_ACTION_RECOMMEND_SONG)
        } else if (v) {
          type.value === 'song'
            ? useActions(SongActions.SET_ACTION_PLAYLIST, v)
            : useActions(SongActions.SET_ACTION_ALBUMLIST, v)
        }
      },
      {
        immediate: true
      }
    )

    const { playlist, albumList } = toRefs(useState())

    const rawData = computed(() => {
      const data =
        type.value === 'song'
          ? formatPlayListData(playlist.value, route.params.playlist as string)
          : formatAlbumListData(albumList.value)
      return data
    })

    const play = playMusic()
    const handleDbClick = (item: Tracks) => {
      play(item.id)
    }

    const handlePlayAll = async () => {
      footerStore.useMutations(FooterMutations.CLEAR_STACK)
      const tracks = toRaw(rawData.value.list)
      const tracksDetail = await getSongUrl<SongsBase[]>(
        tracks.map(item => item.id)
      )
      const stack = tracks.map(item => {
        const urlItem = tracksDetail.find(o => o.id === item.id)
        return {
          ...item,
          url: urlItem?.url,
          type: 'stack'
        }
      })
      footerStore.useMutations(FooterMutations.SET_PLAYLIST_TO_STACK, stack)

      const { music } = footerStore.useState()
      if (music?.id !== stack[0].id) {
        play({
          id: stack[0].id,
          url: stack[0].url
        })
      }
    }

    return () => (
      <div class="song-list-details">
        <SecondaryList
          type={type.value}
          source={rawData.value}
          onPlayAll={handlePlayAll}
          onPlayDbl={handleDbClick}
        />
      </div>
    )
  }
})
