import { defineComponent, reactive, ref } from 'vue'
import { Table } from '@/components-business/table/index'
import { effectWords } from '../logic/index'
import { search } from '@/api/search'
import { playMusic } from '@/shared/music-shared'
import { Pagination, SearchType, SearchSuggest, ArrayItem } from '@/interface'

type Songs = SearchSuggest['songs']

export const SearchSong = defineComponent({
  name: 'SearchSong',
  setup() {
    const list = ref<Songs>([])
    const pagination = reactive<Pagination>({
      limit: 30,
      offset: 1,
      total: 0,
      slice: 0
    })

    const updateList = async (words: string) => {
      if (words) {
        const result = await search(words, SearchType.SONG, pagination)
        list.value = result.songs.slice(pagination.slice).map(song => {
          return {
            ...song,
            dt: song.duration,
            al: song.album,
            ar: song.artists,
            index: (pagination.offset - 1) * pagination.limit
          }
        })
        pagination.total = result.songCount
      }
    }

    const handleChange = (page: number) => {
      pagination.offset = page
      const total = pagination.limit * pagination.offset
      if (pagination.total && total > pagination.total) {
        pagination.slice = total - pagination.total
      } else {
        pagination.slice = 0
      }
    }

    const handlePlaySingle = (song: ArrayItem<Songs>) => {
      playMusic(song.id)
    }

    effectWords(updateList, [pagination])

    return () => (
      <div class="search-song">
        <Table
          list={list.value}
          columnsTypes={['index', 'control', 'name', 'ar', 'al', 'dt']}
          pagination={pagination}
          onChange={handleChange}
          onDblclick={handlePlaySingle}
        />
      </div>
    )
  }
})
