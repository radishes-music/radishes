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
import { onActivated, onMounted, reactive, ref } from 'vue'
import { Jump } from '@/shared/jump-shared'
import { useRecommendStore } from '@/pinia'
import { SongList } from '@/components-business/song-list'

const isMounted = ref(false)

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
  await store.getDailyRecommendSongList()
  if (needLoading) {
    state.loading = false
  }
}

onActivated(() => {
  if (isMounted.value) {
    loadData(false)
  }
})

onMounted(async () => {
  await loadData()
  isMounted.value = true
})
</script>

<style></style>
