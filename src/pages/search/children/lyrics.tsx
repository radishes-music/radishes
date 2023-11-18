import { defineComponent, onActivated, onBeforeUnmount } from 'vue'
import { useSearchModule } from '@/modules'
import { Table } from '@/components-business/table/index'
import { useEffectWords } from '../logic/index'
import { Jump } from '@/shared/jump-shared'
import { playMusic } from '@/shared/music-shared'
import { SearchMutations, SearchActions, SongsDetail } from '@/interface'

export const SearchLyrics = defineComponent({
  name: 'SearchLyrics',
  setup() {
    const { useMutations, useActions, useState } = useSearchModule()

    const state = useState()

    const updateList = async (words: string) => {
      if (words) {
        useActions(SearchActions.GET_LYRICS_LIST, words)
      }
    }

    const handleChange = (page: number) => {
      useMutations(SearchMutations.CHANGE_LYRICS_PAGE_OFFSET, page)
    }

    const jump = new Jump()
    const handleJump = (song: SongsDetail) => {
      playMusic(song.id)
    }

    const uneffect = useEffectWords(updateList, state.lyriceList.pagination)

    onActivated(() => {
      useMutations(
        SearchMutations.SET_SEARCH_TITLE,
        `找到 ${state.lyriceList.total} 首歌词`
      )
    })
    onBeforeUnmount(() => {
      uneffect && uneffect()
    })

    return () => (
      <div class="search-lyrics">
        <Table
          list={state.lyriceList.data}
          total={state.lyriceList.total}
          loading={state.lyriceList.loading}
          columnsTypes={['lyrics', 'name', 'ar', 'al', 'dt']}
          pagination={state.lyriceList.pagination}
          onChange={handleChange}
          onDblclick={handleJump}
        />
      </div>
    )
  }
})
