import { defineComponent, onActivated, onBeforeUnmount } from 'vue'
import { useSearchModule } from '@/modules'
import { Table } from '@/components-business/table/index'
import { useEffectWords } from '../logic/index'
import { Jump } from '@/shared/jump-shared'
import { SearchMutations, SearchActions, PlayLists } from '@/interface'

export const SearchSongList = defineComponent({
  name: 'SearchSongList',
  setup() {
    const { useMutations, useActions, useState } = useSearchModule()

    const state = useState()

    const updateList = async (words: string) => {
      if (words) {
        useActions(SearchActions.GET_PLAYLIST_LIST, words)
      }
    }

    const handleChange = (page: number) => {
      useMutations(SearchMutations.CHANGE_PLAYLIST_PAGE_OFFSET, page)
    }

    const jump = new Jump()
    const handleJump = (playlist: PlayLists) => {
      jump.songList(playlist.id)
    }

    const uneffect = useEffectWords(updateList, state.playlist.pagination)

    onActivated(() => {
      useMutations(
        SearchMutations.SET_SEARCH_TITLE,
        `找到 ${state.playlist.total} 个歌单`
      )
    })
    onBeforeUnmount(() => {
      uneffect && uneffect()
    })

    return () => (
      <div class="search-playlist">
        <Table
          showHeader={false}
          list={state.playlist.data}
          total={state.playlist.total}
          loading={state.playlist.loading}
          columnsTypes={['picUrl', 'name', 'count', 'creator']}
          pagination={state.playlist.pagination}
          onChange={handleChange}
          onDblclick={handleJump}
        />
      </div>
    )
  }
})
