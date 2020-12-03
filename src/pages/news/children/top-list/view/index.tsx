import { computed, defineComponent, toRefs, inject } from 'vue'
import { SongList } from '@/components/song-list/index'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, TopListState, TopListActions, Top } from '../module'
import { ProvideInject } from '@/pages/news/constant'
import { noop } from '@/utils/index'
import { SongState } from '@/pages/song/module'
import { getPlayList } from '@/api/index'
import {
  NAMESPACED as FooterNamespaced,
  FooterMutations,
  FooterActions,
  FooterState
} from '@/pages/footer/module'
import './index.less'

export const TopList = defineComponent({
  name: 'TopList',
  setup() {
    const { useState, useActions } = uesModuleStore<TopListState>(NAMESPACED)
    const footer = uesModuleStore<FooterState>(FooterNamespaced)

    const { top } = toRefs(useState())

    const cacheSongListDetail = new Map()

    const toPlaylistDetails = inject<(n?: Top) => void>(
      ProvideInject.TO_PLAYLIST_DETAILS,
      noop
    )
    const playMusic = async (songlistID: number, index: number) => {
      footer.useMutations(FooterMutations.PAUES_MUSIC)
      let songlist: SongState['playlist']
      if (cacheSongListDetail.has(songlistID)) {
        songlist = cacheSongListDetail.get(songlistID)
      } else {
        songlist = await getPlayList(songlistID)
        cacheSongListDetail.set(songlistID, songlist)
      }

      footer.useActions(FooterActions.SET_MUSIC, songlist.tracks[index].id)
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
              <div
                class="toplist-expansion-contanier--coverimg bg-img"
                onClick={() => toPlaylistDetails(item)}
              >
                {/* @ts-ignore */}
                <img src={item.coverImgUrl} loading="lazy" />
              </div>
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
                <strong onClick={() => toPlaylistDetails(item)}>
                  查看全部
                </strong>
              </div>
            </div>
          ))}
        </div>
        <h1>全球榜</h1>
        <div class="toplist-shrink">
          <SongList songData={shrink.value} onClick={toPlaylistDetails} />
        </div>
      </div>
    )
  }
})
