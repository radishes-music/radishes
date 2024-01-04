<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="relative" ref="container">
    <div class="relative h-8 w-48">
      <input
        class="border-none rounded-lg bg-[#0000001c] text-[white] text-xs placeholder-[#ffffff89] placeholder:text-xs px-4 h-full w-full"
        type="text"
        :placeholder="state.placeholder"
        role="search"
        :value="state.keyword"
        @keyup.enter="onEnter"
        @input="onInput"
        @compositionstart="isComposing = true"
        @compositionend="onCompositionEnd"
        @focus="state.show = true"
      />
      <ph-x-circle
        class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer opacity-80 hover:opacity-100 transition-all duration-300"
        v-if="state.keyword"
        :size="14"
        color="#616368"
        weight="duotone"
        @click="state.keyword = ''"
      />
    </div>
    <transition name="fade">
      <div
        v-if="state.show"
        class="absolute mt-5 bg-white shadow-lg shaodw w-[120%] max-h-96 overflow-y-scroll rounded z-10 px-3 pt-2 pb-4 cursor-default"
      >
        <div v-if="!state.keyword" class="space-y-4">
          <div v-if="searchStore.hasSearchHistory">
            <p class="font-bold text-wordhover my-2 flex justify-between">
              搜索历史
              <ph-trash
                class="cursor-pointer -mr-2"
                :size="16"
                color="#3d3d3d"
                weight="duotone"
                @click="searchStore.clearSearchHistory"
              />
            </p>

            <div class="flex flex-wrap -mt-2">
              <div
                class="rounded-full bg-[#d4d4d8] text-black text-[12px] px-2 relative flex items-center mt-2 mr-2 hover:shadow cursor-pointer"
                v-for="word in searchStore.searchHistory"
                :key="word"
                @click="goSearch(word)"
              >
                {{ word }}
              </div>
            </div>
          </div>
          <div>
            <p class="font-bold text-wordhover mb-2">热搜歌曲</p>
            <div class="flex flex-wrap -mt-2">
              <div
                class="rounded-full bg-[#d4d4d8] text-black text-[12px] px-2 relative flex items-center mt-2 mr-2 hover:shadow cursor-pointer"
                v-for="word in state.hotlist"
                :key="word.searchWord"
                @click="goSearch(word.searchWord)"
              >
                <ph-fire
                  class="mr-1"
                  v-if="word.iconUrl && word.iconType === 4"
                  :size="14"
                  color="#f61311"
                  weight="duotone"
                />
                <ph-fire-simple
                  v-if="word.iconUrl && word.iconType === 1"
                  class="mr-1"
                  :size="14"
                  color="#f61311"
                  weight="duotone"
                />
                {{ word.searchWord }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-2">
          <div v-if="searchStore.searchResult.songs?.length > 0">
            <p class="search-option-title">歌曲</p>
            <div
              class="search-option-text"
              v-for="song in searchStore.searchResult.songs"
              :key="song.id"
              @click="goSearch(song.name + ' ' + song.artists[0].name)"
            >
              {{ song.name }}

              <span class="text-[12px]"> - {{ song.artists[0].name }}</span>
            </div>
          </div>

          <div v-if="searchStore.searchResult.artists?.length > 0">
            <p class="search-option-title">歌手</p>
            <div
              class="search-option-img"
              v-for="artist in searchStore.searchResult.artists"
              :key="artist.id"
              @click="jumpArtist(artist.id)"
            >
              <Image class="w-10 h-10 mr-4" :src="artist.picUrl"></Image>
              {{ artist.name }}
            </div>
          </div>

          <div v-if="searchStore.searchResult.albums?.length > 0">
            <p class="search-option-title">专辑</p>
            <div
              class="search-option-text"
              v-for="album in searchStore.searchResult.albums"
              :key="album.id"
              @click="jumpAblum(album.id)"
            >
              {{ album.name }} -
              <span class="text-[12px]">{{ album.artist.name }}</span>
            </div>
          </div>

          <div v-if="searchStore.searchResult.playlists?.length > 0">
            <p class="search-option-title">歌单</p>
            <div
              class="search-option-img"
              v-for="playlist in searchStore.searchResult.playlists"
              :key="playlist.id"
              @click="jumpSongList(playlist.id)"
            >
              <Image class="w-10 h-10 mr-2" :src="playlist.coverImgUrl"></Image>
              <div class="flex-1 line-clamp-1">
                {{ playlist.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSearchDefaultKeyword, getSearchHotKeywords } from '@/api/search'
import classnames from 'classnames'
import { useSearcStore } from '@/pinia'
import { onClickOutside } from '@vueuse/core'
import { Image } from '@/components/image'
import { useJump } from '@/hooks'

const router = useRouter()

const state = reactive<any>({
  keyword: '',
  hotlist: [],
  placeholder: 'Radishes Music',
  show: false
})

// TODO: 搜索歌曲
// const result = await searchSuggest(keywords)

const searchStore = useSearcStore()

const container = ref(null)
const isComposing = ref(false)

const jump = useJump()

const jumpAblum = (id: number) => {
  state.show = false
  jump.jumpAblum(id)
}
const jumpArtist = (id: number) => {
  state.show = false
  jump.jumpArtist(id)
}
const jumpSongList = (id: number) => {
  state.show = false
  jump.jumpSongList(id)
}

const goSearch = (words: string) => {
  state.show = false
  searchStore.addSearchHistory(words)
  router.push({
    path: '/search/song',
    query: {
      words
    }
  })
}

const onEnter = () => {
  goSearch(state.keyword ? state.keyword : state.placeholder)
}
const onChange = (e: Event) => {
  // @ts-expect-error
  state.keyword = e.target.value
  searchStore.searchWord(state.keyword)
}

const onInput = (e: Event) => {
  if (isComposing.value) {
    return
  }
  onChange(e)
}

const onCompositionEnd = (e: CompositionEvent) => {
  isComposing.value = false
  onChange(e)
}

onMounted(() => {
  getSearchDefaultKeyword().then(res => {
    state.placeholder = res.data.realkeyword
  })
  getSearchHotKeywords().then(res => {
    state.hotlist = res.data.slice(0, 10)
  })
})

onClickOutside(container, () => {
  state.show = false
})
</script>

<style scoped>
.search-option-title {
  @apply font-bold text-wordhover mb-2;
}
.search-option-text {
  @apply text-word hover:text-wordhover flex items-center  px-2 py-1 hover:bg-[#f3f3f3] rounded cursor-pointer transition-all duration-300  line-clamp-1;
}
.search-option-img {
  @apply text-word hover:text-wordhover flex items-center  p-2 hover:bg-[#f3f3f3] rounded cursor-pointer transition-all duration-300;
}
</style>
