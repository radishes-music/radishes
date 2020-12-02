import { computed, defineComponent, toRefs, inject } from 'vue'
import { SongList } from '@/components/song-list/index'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, TopListState, TopListActions, Top } from '../module'
import { ProvideInject } from '@/pages/news/constant'
import { noop } from '@/utils/index'
import './index.less'

export const TopList = defineComponent({
  name: 'TopList',
  setup() {
    const { useState, useActions } = uesModuleStore<TopListState>(NAMESPACED)

    const { top } = toRefs(useState())

    const toPlaylistDetails = inject<(n?: Top) => void>(
      ProvideInject.TO_PLAYLIST_DETAILS,
      noop
    )
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
                style={{ backgroundImage: `url("${item.coverImgUrl}")` }}
                onClick={() => toPlaylistDetails(item)}
              ></div>
              <div class="toplist-expansion-contanier--song">
                {item.tracks.map(song => (
                  <div>
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
