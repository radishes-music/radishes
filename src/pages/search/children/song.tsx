import { defineComponent, onActivated, onBeforeUnmount } from 'vue'
import { Table } from '@/components-business/table/index'
import { useEffectWords } from '../logic/index'
import { playMusic } from '@/shared/music-shared'
import {
  SearchSuggest,
  ArrayItem,
  SearchMutations,
  SearchActions
} from '@/interface'
import { useSearchModule } from '@/modules'

type Songs = SearchSuggest['songs']

export const SearchSong = defineComponent({
  name: 'SearchSong',
  setup() {
    const { useMutations, useActions, useState } = useSearchModule()

    const state = useState()

    const updateList = async (words: string) => {
      if (words) {
        useActions(SearchActions.GET_SONG_LIST, words)
      }
    }

    const handleChange = (page: number) => {
      useMutations(SearchMutations.CHANGE_SONG_PAGE_OFFSET, page)
    }

    const handlePlaySingle = (song: ArrayItem<Songs>) => {
      playMusic(song.id)
    }

    const uneffect = useEffectWords(updateList, state.songList.pagination)

    onActivated(() => {
      useMutations(
        SearchMutations.SET_SEARCH_TITLE,
        `找到 ${state.songList.total} 首歌曲`
      )
    })
    onBeforeUnmount(() => {
      uneffect && uneffect()
    })

    return () => (
      <div class="search-song">
        <Table
          list={state.songList.data}
          total={state.songList.total}
          loading={state.songList.loading}
          columnsTypes={['index', 'control', 'name', 'ar', 'al', 'dt']}
          pagination={state.songList.pagination}
          onChange={handleChange}
          onDblclick={handlePlaySingle}
        />
      </div>
    )
  }
})
