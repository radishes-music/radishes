import { defineComponent, toRefs } from 'vue'
import { SongList as ListComponent } from '@/components/song-list/index'
import { uesModuleStore } from '@/hooks/index'
import { toPlaylist } from '@/pages/news/utils'
import { SongListState, NAMESPACED, SongListActions } from '../module'
import './index.less'

export const SongList = defineComponent({
  name: 'SongList',
  setup() {
    const { useState, useActions } = uesModuleStore<SongListState>(NAMESPACED)
    const { songList, tagsHot } = toRefs(useState())

    useActions(SongListActions.SET_ACTION_SONG_LIST, {
      limit: 30
    })
    useActions(SongListActions.SET_ACTION_TAGS)
    useActions(SongListActions.SET_ACTION_HOT_TAGS)

    return () => (
      <div class="find-music-songlist">
        <div class="find-music-songlist--tags">
          <a-button shape="round">全部歌单</a-button>
          <div class="find-music-songlist--hot">
            <ul>
              {tagsHot.value.map(tag => {
                return <li>{tag.name}</li>
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
