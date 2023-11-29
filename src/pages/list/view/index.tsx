import {
  computed,
  defineComponent,
  toRaw,
  toRefs,
  watch,
  ComputedRef,
  ref,
  provide
} from 'vue'
import { useRoute } from '@/hooks/index'
import { useSongModule, useFooterModule } from '@/modules/index'
import { FooterMutations } from '@/interface'
import {
  FormatSource,
  SongsDetail,
  PlayList,
  AlbumList,
  SongActions
} from '@/interface/index'
import { SecondaryList } from '@/components-business/secondary-list'
import { playMusic } from '@/shared/music-shared'
import './index.less'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isCopyright = (song: SongsDetail) => {
  // Currently does not clear which values are used to determine whether there is copyright
  // return song.fee === 0 && song.no === 1
  return true
}

const formatPlayListData = (item: PlayList, id: string): FormatSource => {
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
    subscribed: item.subscribed,
    list: [
      ...item.tracks.map(o => ({
        ...o,
        noCopyright: !isCopyright(o)
      }))
    ]
  }
}

const formatAlbumListData = (item: AlbumList): FormatSource => {
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
    subscribed: item.album.subscribed,
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
    const loading = ref(false)
    const route = useRoute()
    const { useActions, useState } = useSongModule()
    const footerStore = useFooterModule()

    const type = computed(() => route.params.type) as ComputedRef<string>

    const updateList = async (v: string) => {
      loading.value = true
      if (v === '-1') {
        type.value === 'song' &&
          (await useActions(SongActions.SET_ACTION_RECOMMEND_SONG))
      } else if (v) {
        type.value === 'song'
          ? await useActions(SongActions.SET_ACTION_PLAYLIST, v)
          : await useActions(SongActions.SET_ACTION_ALBUMLIST, v)
      }
      loading.value = false
    }

    provide('loading', loading)

    watch(
      () => route.params.playlist,
      v => {
        updateList(v as string)
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

    const handleDbClick = (item: SongsDetail) => {
      playMusic(item.id)
    }

    const handlePlayAll = async () => {
      footerStore.useMutations(FooterMutations.CLEAR_STACK)
      const tracks = toRaw(rawData.value.list)
      const stack = tracks.map(item => {
        return {
          ...item,
          type: 'stack'
        }
      })
      footerStore.useMutations(
        FooterMutations.SET_PLAYLIST_TO_STACK,
        stack as unknown as SongsDetail[]
      )

      const { music } = footerStore.useState()
      if (music?.id !== stack[0].id) {
        playMusic(stack[0].id)
      }
    }

    return () => (
      <div class="song-list-details">
        <SecondaryList
          type={type.value}
          source={rawData.value}
          onPlayAll={handlePlayAll}
          onPlayDbl={handleDbClick}
          onUpdate={() => updateList(route.params.playlist as string)}
        />
      </div>
    )
  }
})
