<template>
  <div class="h-[230px] pt-5 overflow-hidden">
    <skeletor v-if="state.loading" class="!rounded !h-[94%]" />
    <Swiper
      v-else
      :banners="store.banners"
      :running="store.runningSwiper"
      @click="bannerClick"
    />
  </div>
</template>

<script setup lang="ts">
import type { Banners } from '@/interface'

import { onActivated, onMounted, reactive, onDeactivated } from 'vue'
import { Swiper } from '@/components/swiper/index'
import { TargetType } from '@/interface'
import { useRecommendStore } from '@/pinia'
import { Jump } from '@/shared/jump-shared'

import { playMusic } from '@/shared/music-shared'

const state = reactive({
  loading: true
})

const store = useRecommendStore()

const jump = new Jump()

const bannerClick = (item: Banners) => {
  if (item.targetType === TargetType.EXTERNAL) {
    window.open(item.url, '_blank', 'nodeIntegration=no')
  }
  if (item.targetType === TargetType.LIST) {
    jump.songList(item.targetId)
  }
  if (item.targetType === TargetType.MUSIC) {
    playMusic(item.targetId)
  }
}

const loadData = async (needLoading = true) => {
  if (needLoading) {
    state.loading = true
  }
  await store.getRecommendBanner()
  if (needLoading) {
    state.loading = false
  }
}

const handleVisibilityChange = () => {
  store.runningSwiper = !document.hidden
}
document.addEventListener('visibilitychange', handleVisibilityChange, false)

onActivated(() => {
  store.runningSwiper = true
  loadData(false)
})

onDeactivated(() => {
  store.runningSwiper = false
})

onMounted(() => {
  loadData()
})
</script>

<style></style>
