<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="relative">
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
        @blur="state.show = false"
      />
      <loading></loading>
    </div>
    <transition name="fade">
      <div
        v-if="true"
        class="absolute mt-5 bg-white shadow-lg shaodw w-[120%] max-h-96 overflow-y-scroll rounded z-10 px-4 py-2 cursor-default"
      >
        <div v-if="!state.keyword">
          <p class="font-bold text-word my-2">热搜歌曲</p>
          <div class="flex flex-wrap -mt-2">
            <div
              class="rounded-full bg-[#d4d4d8] text-black text-[12px] px-2 relative flex items-center mt-2 mr-2 hover:shadow cursor-pointer"
              v-for="word in state.hotlist"
              :key="word.searchWord"
              @click="goSearch(word.searchWord)"
            >
              <img
                v-if="word.iconUrl"
                :class="
                  classnames('mr-1', {
                    'w-3': word.iconType === 4,
                    'w-5': word.iconType === 1
                  })
                "
                :src="word.iconUrl"
                alt=""
              />
              {{ word.searchWord }}
            </div>
          </div>

          <p class="font-bold text-word my-2 flex justify-between">
            历史搜索 <ph-trash :size="16" color="#3d3d3d" weight="duotone" />
          </p>

          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
          {{ state.keyword }}<br />
        </div>

        <div v-else>
          <p class="font-bold text-word my-2">歌曲</p>
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

const router = useRouter()

const state = reactive<any>({
  keyword: '',
  hotlist: [],
  placeholder: 'Radishes Music',
  show: false
})

// TODO: 搜索歌曲
// const result = await searchSuggest(keywords)

const isComposing = ref(false)

const goSearch = (words: string) => {
  state.show = false
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

watch(
  () => state.keyword,
  val => {
    state.show = !!val
  }
)

onMounted(() => {
  getSearchDefaultKeyword().then(res => {
    state.placeholder = res.data.realkeyword
  })
  getSearchHotKeywords().then(res => {
    console.log(res)
    state.hotlist = res.data.slice(0, 5)
  })
})
</script>

<style></style>
