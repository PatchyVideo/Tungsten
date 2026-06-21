<script lang="ts" setup>
defineProps<{
  playlists: schema.PlaylistContentForVideo[]
}>()
</script>

<template>
  <section
    v-if="playlists.length"
    class="border border-outlineVariant rounded-2xl bg-surfaceContainerLowest p-4 shadow-sm space-y-3 dark:border-dark-outlineVariant dark:bg-dark-surfaceContainer lg:p-5"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">
        所属播放列表
      </h3>
      <span class="text-xs text-onSurfaceVariant dark:text-dark-onSurfaceVariant">{{ playlists.length }}</span>
    </div>

    <div class="space-y-2">
      <RouterLink
        v-for="item in playlists"
        :key="item.id"
        :to="`/playlist/${item.playlist.id}`"
        target="_blank"
        class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-dark-surfaceContainerHigh"
      >
        <img
          v-if="item.meta.cover"
          :src="`https://patchyvideo.com/images/covers/${item.meta.cover}`"
          :alt="item.meta.title"
          class="h-10 w-14 flex-shrink-0 rounded object-cover"
        >
        <div v-else class="h-10 w-14 flex-shrink-0 rounded bg-gray-200 dark:bg-dark-surfaceContainerHigh" />

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <span v-if="item.meta.private" class="i-mdi-lock h-3 w-3 text-onSurfaceVariant dark:text-dark-onSurfaceVariant" />
            <span class="truncate text-sm font-medium">{{ item.meta.title }}</span>
          </div>
          <div class="text-xs text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
            第 {{ item.rank + 1 }} / {{ item.meta.count }} 个
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>
