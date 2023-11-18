import { defineComponent, onActivated, onBeforeUnmount } from 'vue'
import { useSearchModule } from '@/modules'
import { Table } from '@/components-business/table/index'
import { useEffectWords } from '../logic/index'
import { SearchMutations, SearchActions, Albums } from '@/interface'
import { Jump } from '@/shared/jump-shared'

export const SearchAlbum = defineComponent({
  name: 'SearchAlbum',
  setup() {
    const { useMutations, useActions, useState } = useSearchModule()

    const state = useState()

    const updateList = async (words: string) => {
      if (words) {
        useActions(SearchActions.GET_ALBUM_LIST, words)
      }
    }

    const handleChange = (page: number) => {
      useMutations(SearchMutations.CHANGE_ALBUM_PAGE_OFFSET, page)
    }

    const jump = new Jump()
    const handleJump = (album: Albums) => {
      jump.albumList(album.id)
    }

    const uneffect = useEffectWords(updateList, state.albumList.pagination)

    onActivated(() => {
      useMutations(
        SearchMutations.SET_SEARCH_TITLE,
        `找到 ${state.albumList.total} 张专辑`
      )
    })
    onBeforeUnmount(() => {
      uneffect && uneffect()
    })

    return () => (
      <div class="search-album">
        <Table
          showHeader={false}
          list={state.albumList.data}
          total={state.albumList.total}
          loading={state.albumList.loading}
          columnsTypes={['picUrl', 'name', 'artist']}
          pagination={state.albumList.pagination}
          onChange={handleChange}
          onDblclick={handleJump}
        />
      </div>
    )
  }
})
