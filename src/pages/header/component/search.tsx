import { defineComponent, ref, computed, toRefs, PropType } from 'vue'
import { useRouter } from '@/hooks/index'
import { SearchSuggest, HeaderActions, Songs } from '@/interface'
import { useHeaderModule } from '@/modules/index'
import { playMusic } from '@/shared/music-shared'
import { Jump } from '@/shared/jump-shared'
import Keyword from '@/components/keyword/keyword'
import { debounce } from 'lodash-es'
import './search.less'

const enum SearchType {
  SONGS = 'SONGS',
  ARTISTS = 'ARTISTS',
  ALBUMS = 'ALBUMS',
  PLAYLISTS = 'PLAYLISTS'
}

const Option = defineComponent({
  name: 'Option',
  props: {
    value: {
      type: [Number, String] as PropType<number | string>,
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
    },
    className: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup(props) {
    const { value, onSelect, detail, keyword, className } = toRefs(props)
    const handleSelect = () => {
      onSelect?.value(value?.value)
    }
    return () => (
      <li class={className.value} onClick={handleSelect}>
        <Keyword keyword={keyword.value} text={detail?.value} />
      </li>
    )
  }
})

const Group = defineComponent({
  name: 'Group',
  props: {
    words: {
      type: String as PropType<string>,
      required: true
    },
    item: {
      type: Array as PropType<Required<SearchSuggest>['songs']>,
      required: true
    },
    onSelect: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const { words, item } = toRefs(props)
    const handleSelect = () => {
      emit('select')
    }
    return () => (
      <>
        <div class="search-popper-title" v-show={item.value}>
          <icon icon="facebook" color="#333" size={14}></icon>单曲
        </div>
        <ul class="search-popper-group">
          {item.value.map(song => {
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
      </>
    )
  }
})

export const Search = defineComponent({
  name: 'SearchInput',
  components: {
    Option,
    Group
  },
  setup() {
    const router = useRouter()
    const { useActions, useState } = useHeaderModule()

    const state = useState()
    const words = ref('')
    const loading = ref(false)
    const zh = ref(false)

    const source = computed(() => {
      return state.searchSuggest.order || []
    })

    const handleSearch = debounce(async () => {
      if (words.value && !zh.value) {
        loading.value = true
        await useActions(HeaderActions.GET_SEARCH_SUGGEST, words.value)
        loading.value = false
      }
    }, 200)

    const jump = new Jump()
    const handleSelect = async (type: SearchType, id: unknown) => {
      switch (type) {
        case SearchType.SONGS:
          playMusic((id as Songs).id)
          break
        case SearchType.PLAYLISTS:
          jump.songList(id as number)
          break
        case SearchType.ARTISTS:
          jump.artist(id as number)
          break
        case SearchType.ALBUMS:
          jump.albumList(id as number)
      }
    }

    const handleSearchMore = () => {
      router.push({
        path: '/search/song',
        query: {
          words: words.value
        }
      })
    }

    const Slot = {
      prefix: () => <icon icon="search" color="#ffffff61" size={18}></icon>,
      popper: () => (
        <div class="search-popper">
          <div class="search-popper-more" onClick={handleSearchMore}>
            搜"<strong class="keyword">{words.value}</strong>"相关的结果
          </div>
          <div class="search-popper-title" v-show={state.searchSuggest.songs}>
            <icon icon="facebook" color="#333" size={14}></icon>单曲
          </div>
          <ul class="search-popper-group">
            {state.searchSuggest.songs?.map(song => {
              return (
                <Option
                  value={song.id}
                  onSelect={() => handleSelect(SearchType.SONGS, song)}
                  keyword={words.value}
                  detail={`${song.name} - ${song.artists
                    .map(artist => artist.name)
                    .join(' ')}`}
                ></Option>
              )
            })}
          </ul>
          <div class="search-popper-title" v-show={state.searchSuggest.artists}>
            <icon icon="facebook" color="#333" size={14}></icon>歌手
          </div>
          <ul class="search-popper-group">
            {state.searchSuggest.artists?.map(artist => {
              return (
                <Option
                  value={artist.id}
                  onSelect={() => handleSelect(SearchType.ARTISTS, artist.id)}
                  keyword={words.value}
                  detail={artist.name}
                ></Option>
              )
            })}
          </ul>
          <div class="search-popper-title" v-show={state.searchSuggest.albums}>
            <icon icon="facebook" color="#333" size={14}></icon>专辑
          </div>
          <ul class="search-popper-group search-popper-last">
            {state.searchSuggest.albums?.map(album => {
              return (
                <Option
                  value={album.id}
                  onSelect={() => handleSelect(SearchType.ALBUMS, album.id)}
                  keyword={words.value}
                  detail={`${album.name} - ${album.artist.name}`}
                ></Option>
              )
            })}
          </ul>
          <div
            class="search-popper-title"
            v-show={state.searchSuggest.playlists}
          >
            <icon icon="facebook" color="#333" size={14}></icon>歌单
          </div>
          <ul class="search-popper-group search-popper-last">
            {state.searchSuggest.playlists?.map(list => {
              return (
                <Option
                  value={list.id}
                  onSelect={() => handleSelect(SearchType.PLAYLISTS, list.id)}
                  keyword={words.value}
                  detail={list.name}
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
          onCompositionstart={() => (zh.value = true)}
          onCompositionend={() => (zh.value = false)}
          loading={loading.value}
          v-slots={Slot}
        ></ve-auto-complete>
      </div>
    )
  }
})
