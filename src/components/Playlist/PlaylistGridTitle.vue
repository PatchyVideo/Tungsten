<!-- Title link for a single playlist -->
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  private: boolean
  name: string
  titleLinksTo: RouteLocationRaw
  author?: schema.Maybe<schema.User>
}>()
</script>

<template>
  <div class="w-full md:flex md:items-center md:justify-between">
    <!-- UI Loading -->
    <div v-if="!titleLinksTo" class="my-2 h-5 w-full rounded bg-gray-200 md:h-7 dark:bg-dark-200" />

    <div v-else class="flex items-center space-x-2">
      <span v-if="private" class="rounded bg-purple-400 px-1 py-0.5 text-xs text-white">Private</span>
      <PlaylistTitleLink :name="name" :title-links-to="titleLinksTo" />
    </div>

    <UserMeta
      v-if="author"
      :id="author.id"
      :username="author.username"
      small-size
      :image="author.image"
      :gravatar="author.gravatar"
    />
  </div>
</template>
