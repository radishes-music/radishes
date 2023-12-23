<template>
  <div>
    <div
      class="group relative cursor-pointer transition-all duration-[300ms] hover:shadow-lg overflow-hidden rounded"
    >
      <div class="w-0 h-0 pt-[100%] pr-[100%] bg-black" />
      <div class="absolute w-full h-full top-0 left-0">
        <Image
          v-if="songUrl"
          class="block w-full h-full transition-all duration-[300ms] ease-linear group-hover:scale-110"
          :src="songUrl"
        />
        <div
          class="w-full h-full flex items-center justify-center bg-primary"
          v-else
        >
          <icon icon="rili" :size="78" />
          <div
            class="absolute w-full h-full flex justify-center items-center text-2xl text-white"
          >
            <span class="mt-4">
              {{ dailyNum }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="absolute w-full h-full bg-masked-light top-0 left-0 flex justify-center items-center transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ph-play-circle
          :size="48"
          weight="duotone"
          class="transition-all duration-300 text-white hover:text-primary"
        />
      </div>

      <div
        v-if="!!song.playCount"
        class="absolute top-1 right-1 text-white bg-masked flex items-center text-[12px] p-0.5 rounded"
      >
        <ph-headphones :size="14" weight="duotone" class="mr-1" />
        {{ formatCount(song.playCount) }}
      </div>
    </div>
    <div class="h-11 mt-1" v-if="!notitle">
      <span
        class="hover:text-primary transition-all duration-300 cursor-pointer"
      >
        {{ song.name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import dayjs from 'dayjs'
import { formatCount } from '@/utils'

import { Image } from '@/components/image'

const props = defineProps<{
  notitle?: boolean
  song: {
    name: string
    picUrl: string
    coverImgUrl: string
    playCount: number
  }
}>()

const { song } = props

const dailyNum = dayjs().date()

const songUrl = song.picUrl || song.coverImgUrl
</script>

<style></style>
