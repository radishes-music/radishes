<template>
  <div class="recommend-song">
    <h2 class="!text-lg">最新音乐</h2>
    <ul class="grid grid-cols-2 gap-x-4 gap-2 pt-[10px]" v-if="!state.loading">
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

    <div class="grid grid-cols-2 gap-x-4 gap-2" v-else>
      <skeletor
        class="!h-20 !rounded"
        v-for="(_, i) in Array(10).fill(0)"
        :key="i"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRecommendStore } from '@/pinia'
import card from '@/components-business/song-list/card.vue'
import { playMusic } from '@/shared/music-shared'
import { useOnActivated } from '@/hooks'

const state = reactive({
  loading: true
})

const store = useRecommendStore()

const songClick = (id: number) => {
  playMusic(id)
}

useOnActivated(() => {
  store.getRecommendNewSong()
})

onMounted(async () => {
  state.loading = true
  await store.getRecommendNewSong()
  state.loading = false
})
</script>

<style></style>
