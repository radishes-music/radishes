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
        class="absolute mt-5 bg-white shadow-lg shaodw w-[120%] max-h-96 overflow-y-scroll rounded z-10 px-4 pt-2 pb-4 cursor-default"
      >
        <div v-if="!state.keyword" class="space-y-4">
          <div v-if="searchStore.hasSearchHistory">
            <p class="font-bold text-word my-2 flex justify-between">
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
            <p class="font-bold text-word mb-2">热搜歌曲</p>
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

        <div v-else>
          <p class="font-bold text-word mb-2">歌曲</p>
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          <p class="font-bold text-word my-2">专辑</p>
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          <p class="font-bold text-word my-2">歌手</p>
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />

          <p class="font-bold text-word my-2">歌单</p>
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
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

<style></style>
