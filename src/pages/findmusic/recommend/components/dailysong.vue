<template>
  <div class="recommend-song">
    <h2 class="!text-lg">每日歌单推荐</h2>
    <song-list
      :songData="store.dailySongList"
      :loading="state.loading"
      @click="songClick"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRecommendStore } from '@/pinia'
import { SongList } from '@/components-business/song-list'
import { useJumpSongList, useOnActivated } from '@/hooks'

const state = reactive({
  loading: true
})

const store = useRecommendStore()

const jumpSongList = useJumpSongList()

const songClick = (item: any) => jumpSongList(item.id)

const loadData = async (needLoading = true) => {
  if (needLoading) {
    state.loading = true
  }
  await store.getDailyRecommendSongList()
  if (needLoading) {
    state.loading = false
  }
}

useOnActivated(() => loadData(false))

onMounted(() => {
  loadData()
})
</script>

<style></style>
