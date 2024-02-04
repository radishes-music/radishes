<template>
  <span v-html="showText" />
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
  match: string
}>()

const showText = props.text.replace(new RegExp(props.match, 'i'), $ => {
  console.log($)
  return `<span class="text-primary">${$}</span>`
})
</script>

<style></style>
