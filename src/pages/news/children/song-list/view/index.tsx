import { defineComponent, toRefs, inject, watch } from 'vue'
import { SongList as ListComponent } from '@/components/song-list/index'
import { uesModuleStore, useRoute, useRouter } from '@/hooks/index'
import { ProvideInject } from '@/pages/news/constant'
import { noop } from '@/utils/index'
import { SongListState, NAMESPACED, SongListActions, Tags } from '../module'
import './index.less'

export const SongList = defineComponent({
  name: 'SongList',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const { useState, useActions } = uesModuleStore<SongListState>(NAMESPACED)
    const { songList, tagsHot } = toRefs(useState())

    useActions(SongListActions.SET_ACTION_SONG_LIST, {
      limit: 30
    })
    useActions(SongListActions.SET_ACTION_TAGS)
    useActions(SongListActions.SET_ACTION_HOT_TAGS)

    watch(
      () => route.query.tag,
      v => {
        if (v) {
          useActions(SongListActions.SET_ACTION_SONG_LIST, {
            cat: v === 'all' ? '' : v,
            limit: 30
          })
        }
      }
    )

    const switchPlaylist = (tag: Tags) => {
      router.push({
        path: '/music/songlist',
        query: {
          tag: tag.name
        }
      })
    }
    const toPlaylist = inject(ProvideInject.TO_PLAYLIST_DETAILS, noop)

    return () => (
      <div class="find-music-songlist">
        <div class="find-music-songlist--tags">
          <a-button shape="round">全部歌单</a-button>
          <div class="find-music-songlist--hot">
            <ul>
              {tagsHot.value.map(tag => {
                return <li onClick={() => switchPlaylist(tag)}>{tag.name}</li>
              })}
            </ul>
          </div>
        </div>
        <ListComponent
          songData={songList.value}
          handle={toPlaylist}
        ></ListComponent>
      </div>
    )
  }
})
