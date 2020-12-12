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
import {
  FooterState,
  FooterActions,
  FooterMutations
} from '@/pages/footer/module'
import { getSongUrl } from '@/api/index'
import { SongsBase, FormatSource, SongsDetail } from '@/interface'
import { SecondaryList } from '@/components/secondary-list'
import './index.less'

const isCopyright = (song: SongsDetail) => {
  // Currently does not clear which values are used to determine whether there is copyright
  // return song.fee === 0 && song.no === 1
  return true
}

const formatPlayListData = (item: SongState['playlist']): FormatSource => {
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
        if (v) {
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
          ? formatPlayListData(playlist.value)
          : formatAlbumListData(albumList.value)
      return data
    })

    const handleDbClick = (item: Tracks) => {
      footerStore.useMutations(FooterMutations.PAUES_MUSIC)
      footerStore.useActions(FooterActions.SET_MUSIC, item.id)
    }

    const handlePlayAll = async () => {
      const tracks = toRaw(rawData.value.list)
      const tracksDetail = await getSongUrl<SongsBase[]>(
        tracks.map(item => item.id)
      )
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
