<template>
  <div class="recommend-song">
    <h2 class="!text-lg">推荐歌单</h2>
    <song-list
      :songData="store.songList"
      :loading="state.loading"
      @click="songClick"
    />
  </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, reactive } from 'vue'
import { Jump } from '@/shared/jump-shared'
import { useRecommendStore } from '@/pinia'
import { SongList } from '@/components-business/song-list'

const state = reactive({
  loading: true
})

const store = useRecommendStore()

const jump = new Jump()

const songClick = (item: any) => jump.songList(item.id)

const loadData = async (needLoading = true) => {
  if (needLoading) {
    state.loading = true
  }
  await store.getRecommendSongList()
  if (needLoading) {
    state.loading = false
  }
}

onActivated(() => {
  loadData(false)
})

onMounted(() => {
  loadData()
})
</script>

<style></style>
