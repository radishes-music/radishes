<template>
  <div class="recommend-song">
    <h2 class="!text-lg mb-6">最新音乐</h2>

    <ul class="grid grid-cols-2 gap-x-4 gap-2">
      <li
        v-for="song in store.songs"
        :key="song.id"
        class="hover:bg-[#f3f3f3] transition-all duration-300 p-2 rounded cursor-pointer"
        @click="songClick(song.id)"
      >
        <div class="flex">
          <div class="w-16 h-16">
            <card :song="song" notitle />
          </div>
          <div class="ml-4">
            <div
              class="text-base hover:text-primary transition-all duration-300"
            >
              {{ song.name }}
            </div>
            <div class="flex space-x-1 mt-2">
              <div class="text-[12px]">
                {{
                  song?.song?.artists
                    .map(singer => singer.name + ' ')
                    .join('/ ')
                }}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRecommend } from '@/pinia'
import card from './card.vue'
import { playMusic } from '@/shared/music-shared'

const state = reactive({
  loading: true
})

const store = useRecommend()

const songClick = (id: number) => {
  playMusic(id)
}

onMounted(async () => {
  state.loading = true
  await store.getRecommendNewSong()
  state.loading = false
})
</script>

<style></style>
