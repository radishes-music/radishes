import { defineComponent, ref, computed, toRefs } from 'vue'
import { debounce } from 'lodash'
import { Actions } from '../sage'
import { createUesHook } from '../module'
import './search.less'

export const Search = defineComponent({
  name: 'Search',
  setup() {
    const { useActions, useState } = createUesHook()

    const words = ref('')
    const loading = ref(false)

    const source = computed(() => {
      const { searchSuggest } = useState()
      return searchSuggest.order || []
    })

    const handleSearch = debounce(async (keywords: string) => {
      if (keywords) {
        loading.value = true
        await useActions(Actions.GET_SEARCH_SUGGEST, keywords)
        loading.value = false
      }
      const { searchSuggest } = useState()
      console.log(searchSuggest)
    }, 200)

    const { searchSuggest } = toRefs(useState())
    const Slot = {
      popper: () => (
        <div class="search-popper">
          <div class="search-popper-title" v-show={searchSuggest.value.songs}>
            <icon icon="facebook" color="#333" size={14}></icon>单曲
          </div>
          <ul class="search-popper-group">
            {searchSuggest.value.songs?.map(song => {
              return <li>{song.name}</li>
            })}
          </ul>
          <div class="search-popper-title" v-show={searchSuggest.value.artists}>
            <icon icon="facebook" color="#333" size={14}></icon>歌手
          </div>
          <ul class="search-popper-group">
            {searchSuggest.value.artists?.map(artist => {
              return <li>{artist.name}</li>
            })}
          </ul>
          <div class="search-popper-title" v-show={searchSuggest.value.albums}>
            <icon icon="facebook" color="#333" size={14}></icon>专辑
          </div>
          <ul class="search-popper-group search-popper-last">
            {searchSuggest.value.albums?.map(album => {
              return <li>{album.name}</li>
            })}
          </ul>
        </div>
      )
    }
    return () => (
      <div class="search">
        <ve-auto-complete
          class="search-input"
          type="search"
          size="small"
          v-model={[words.value, 'value']}
          data-source={source.value}
          onSearch={handleSearch}
          loading={loading.value}
          v-slots={Slot}
        ></ve-auto-complete>
      </div>
    )
  }
})
