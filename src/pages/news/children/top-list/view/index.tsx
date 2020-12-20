import { computed, defineComponent, toRefs } from 'vue'
import { SongList } from '@/components/song-list/index'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, TopListState, TopListActions } from '../module'
import { SongState } from '@/pages/list/module'
import { getPlayList } from '@/api/index'
import { Image } from '@/components/image/index'
import { playMusic as music } from '@/shared/music-shared'
import { jumpSongList } from '@/shared/list-shared'
import './index.less'

export const TopList = defineComponent({
  name: 'TopList',
  setup() {
    const { useState, useActions } = uesModuleStore<TopListState>(NAMESPACED)

    const { top } = toRefs(useState())

    const cacheSongListDetail = new Map()

    const play = music()
    const toSongList = jumpSongList()
    const playMusic = async (songlistID: number, index: number) => {
      let songlist: SongState['playlist']
      if (cacheSongListDetail.has(songlistID)) {
        songlist = cacheSongListDetail.get(songlistID)
      } else {
        songlist = await getPlayList(songlistID)
        cacheSongListDetail.set(songlistID, songlist)
      }

      play(songlist.tracks[index].id)
    }
    const expan = computed(() => top.value.slice(0, 4))
    const shrink = computed(() => top.value.slice(4))

    useActions(TopListActions.SET_ACTION_TOP_LIST)

    return () => (
      <div class="toplist">
        <h1>官方榜</h1>
        <div class="toplist-expansion">
          {expan.value.map(item => (
            <div class="toplist-expansion-contanier">
              <Image
                src={item.coverImgUrl}
                onClick={() => toSongList(item.id)}
                name="toplist-expansion-contanier--coverimg"
              />
              <div class="toplist-expansion-contanier--song">
                {item.tracks.map((song, index) => (
                  <div
                    class="none-select"
                    onDblclick={() => playMusic(item.id, index)}
                  >
                    <div>{song.first}</div>
                    <div>{song.second}</div>
                  </div>
                ))}
                <strong onClick={() => toSongList(item.id)}>查看全部</strong>
              </div>
            </div>
          ))}
        </div>
        <h1>全球榜</h1>
        <div class="toplist-shrink">
          <SongList
            songData={shrink.value}
            onClick={item => toSongList(item.id)}
          />
        </div>
      </div>
    )
  }
})
