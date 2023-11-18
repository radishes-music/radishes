import { defineComponent, onActivated, onBeforeUnmount } from 'vue'
import { useEffectWords } from '../logic/index'
import { Table } from '@/components-business/table/index'
import {
  SearchSuggest,
  SearchMutations,
  ArrayItem,
  SearchActions
} from '@/interface'
import { useSearchModule } from '@/modules'
import { Jump } from '@/shared/jump-shared'

type Artists = SearchSuggest['artists']

export const SearchArtist = defineComponent({
  name: 'SearchArtist',
  setup() {
    const { useMutations, useActions, useState } = useSearchModule()
    const state = useState()

    const updateList = async (words: string) => {
      if (words) {
        useActions(SearchActions.GET_ARTIST_LIST, words)
      }
    }

    const handleChange = (page: number) => {
      useMutations(SearchMutations.CHANGE_ARTIST_PAGE_OFFSET, page)
    }

    const jump = new Jump()
    const handleJump = (song: ArrayItem<Artists>) => {
      jump.artist(song.id)
    }

    const uneffect = useEffectWords(updateList, state.artistList.pagination)

    onActivated(() => {
      useMutations(
        SearchMutations.SET_SEARCH_TITLE,
        `找到 ${state.artistList.total} 位歌手`
      )
    })
    onBeforeUnmount(() => {
      uneffect && uneffect()
    })

    return () => (
      <div class="search-artist">
        <Table
          showHeader={false}
          list={state.artistList.data}
          total={state.artistList.total}
          loading={state.artistList.loading}
          columnsTypes={['picUrl', 'name']}
          pagination={state.artistList.pagination}
          onChange={handleChange}
          onDblclick={handleJump}
        />
      </div>
    )
  }
})
