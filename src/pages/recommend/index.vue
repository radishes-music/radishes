<template>
  <div class="find-music-recommend pb-6">
    <div class="h-[230px] pt-5 overflow-hidden">
      <Swiper
        :banners="store.banners"
        :running="store.runningSwiper"
        @click="bannerClick"
      />
    </div>
    <div class="recommend-song" v-if="isLogin">
      <h2 class="!text-lg">每日歌单推荐</h2>
      <song-list
        :songData="store.dailySongList"
        :loading="loading"
        @click="songClick"
      />
    </div>

    <div class="recommend-song">
      <h2 class="!text-lg">推荐歌单</h2>
      <song-list
        :songData="store.songList"
        :loading="loading"
        @click="songClick"
      />
    </div>

    <new-song />
  </div>
</template>

<script setup lang="ts">
import { onActivated, onDeactivated, ref, onMounted } from 'vue'
import { Swiper } from '@/components/swiper/index'
import { Banners, TargetType } from '@/interface'
import { SongList } from '@/components-business/song-list/index'
import { useAuth } from '@/hooks/index'
import { playMusic } from '@/shared/music-shared'
import { Jump } from '@/shared/jump-shared'
import NewSong from '@/components-business/song-list/newsong.vue'

import { useRecommend } from '@/pinia'

const store = useRecommend()

const { isLogin } = useAuth()
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  await store.getRecommendBanner()
  if (isLogin.value) {
    await store.getDailyRecommendSongList()
  }
  await store.getRecommendSongList()

  loading.value = false
}

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

const handleVisibilityChange = () => {
  store.runningSwiper = !document.hidden
}

document.addEventListener('visibilitychange', handleVisibilityChange, false)

onActivated(() => {
  store.runningSwiper = true
})

onDeactivated(() => {
  store.runningSwiper = false
})

const songClick = (item: any) => jump.songList(item.id)

onMounted(() => {
  loadData()
})
</script>

<style></style>
