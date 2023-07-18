<template>
  <div>
    <template v-for="(segment, index) in segments" :key="index">
      <span :class="{ 'highlight': segment.keyword }">{{ segment.text }}</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: String,
  keyword: String
})

const segments = computed(() => {
  let parts = props.text.split(props.keyword)
  let segments = []
  parts.forEach((part, index) => {
    segments.push({ text: part, keyword: false })
    if (index < parts.length - 1) {
      segments.push({ text: props.keyword, keyword: true })
    }
  })
  return segments
})
</script>

<style scoped>
.highlight {
  color: rgb(255,68,0);
}
</style>
