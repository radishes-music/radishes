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
  await store.getRecommendSongList()
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
