import { defineComponent, ref, computed, toRefs, PropType } from 'vue'
import { debounce } from 'lodash'
import { Actions } from '../sage'
import { uesModuleStore } from '@/hooks/index'
import { NAMESPACED, State } from '../module'
import { FooterNameSpaced } from '@/modules/index'
import {
  State as FooterState,
  Actions as FooterActions,
  Mutations as FooterMutations
} from '@/pages/footer/module'
import './search.less'

const Option = defineComponent({
  name: 'Option',
  props: {
    value: {
      type: Number as PropType<number>,
      required: true
    },
    detail: {
      type: String as PropType<string>,
      required: true
    },
    keyword: {
      type: String as PropType<string>,
      required: true
    },
    onSelect: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const { value, onSelect, detail, keyword } = toRefs(props)
    const html = detail?.value.replace(
      keyword.value,
      `<strong class="keyword">${keyword.value}</strong>`
    )
    const handleSelect = () => {
      onSelect?.value(value?.value)
    }
    return () => <li onClick={handleSelect} v-html={html}></li>
  }
})

export const Search = defineComponent({
  name: 'Search',
  components: {
    Option
  },
  setup() {
    const { useActions, useState } = uesModuleStore<State>(NAMESPACED)
    const footerStore = uesModuleStore<FooterState>(FooterNameSpaced)

    const words = ref('')
    const loading = ref(false)
    const zh = ref(false)

    const source = computed(() => {
      const { searchSuggest } = useState()
      return searchSuggest.order || []
    })

    const handleSearch = debounce(async () => {
      if (words.value && !zh.value) {
        loading.value = true
        await useActions(Actions.GET_SEARCH_SUGGEST, words.value)
        loading.value = false
      }
    }, 200)

    const handleSelect = async (v: number) => {
      footerStore.useMutations(FooterMutations.PAUES_MUSIC)
      await footerStore.useActions(FooterActions.SET_MUSIC, v)
    }

    const { searchSuggest } = toRefs(useState())
    const Slot = {
      prefix: () => <icon icon="search" color="#ffffff61" size={18}></icon>,
      popper: () => (
        <div class="search-popper">
          <div class="search-popper-title" v-show={searchSuggest.value.songs}>
            <icon icon="facebook" color="#333" size={14}></icon>单曲
          </div>
          <ul class="search-popper-group">
            {searchSuggest.value.songs?.map(song => {
              return (
                <Option
                  value={song.id}
                  onSelect={handleSelect}
                  keyword={words.value}
                  detail={`${song.name} - ${song.artists
                    .map(artist => artist.name)
                    .join(' ')}`}
                ></Option>
              )
            })}
          </ul>
          <div class="search-popper-title" v-show={searchSuggest.value.artists}>
            <icon icon="facebook" color="#333" size={14}></icon>歌手
          </div>
          <ul class="search-popper-group">
            {searchSuggest.value.artists?.map(artist => {
              return (
                <Option
                  value={artist.id}
                  onSelect={handleSelect}
                  keyword={words.value}
                  detail={artist.name}
                ></Option>
              )
            })}
          </ul>
          <div class="search-popper-title" v-show={searchSuggest.value.albums}>
            <icon icon="facebook" color="#333" size={14}></icon>专辑
          </div>
          <ul class="search-popper-group search-popper-last">
            {searchSuggest.value.albums?.map(album => {
              return (
                <Option
                  value={album.id}
                  onSelect={handleSelect}
                  keyword={words.value}
                  detail={`${album.name} - ${album.artist.name}`}
                ></Option>
              )
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
          onCompositionStart={() => (zh.value = true)}
          onCompositionEnd={() => (zh.value = false)}
          loading={loading.value}
          v-slots={Slot}
        ></ve-auto-complete>
      </div>
    )
  }
})
