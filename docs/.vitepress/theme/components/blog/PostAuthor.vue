<script setup lang="ts">
import type { Author } from '../../composables/authors.data'

defineProps<{
  author: Author
}>()
</script>

<template>
  <div v-if="author" class="flex items-center space-x-4">
    <img
      class="w-7 h-7 rounded-full"
      :src="author.data.avatar"
      :alt="author.name"
    >
    <span class="inline-flex items-center font-medium dark:text-white">
      {{ author.name }}
    </span>
  </div>
  <div v-else />
</template>

<style scoped></style>
