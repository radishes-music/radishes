<template>
  <div class="find-music-recommend pb-6">
    <banner />
    <daily-song v-if="isLogin" />
    <recommend-song />

    <new-song />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/hooks/index'
import NewSong from './components/newsong.vue'
import Banner from './components/banner.vue'
import RecommendSong from './components/recommendsong.vue'
import DailySong from './components/dailysong.vue'

const { isLogin } = useAuth()
</script>

<style />
