<!-- Single playlist display in playlist-list page -->
<script lang="ts" setup>
const props = defineProps<{
  playlistData: schema.Playlist | null
}>()
const name = computed(() => props.playlistData ? props.playlistData.item.title : '')
const titleLinksTo = computed(() => props.playlistData ? `/playlist/${props.playlistData.id}` : '')
const isPrivate = computed(() => props.playlistData ? props.playlistData.item.private : false)
const author = computed(() => props.playlistData ? props.playlistData.meta.createdBy : undefined)
const videos = computed(() => props.playlistData ? props.playlistData.videos : Array.from({ length: 6 }).fill(null))
const cover = computed(() => props.playlistData ? props.playlistData.item.cover : '')
const count = computed(() => props.playlistData ? props.playlistData.item.count : 0)
</script>

<template>
  <div>
    <PlaylistGridTitle
      :name="name"
      :title-links-to="titleLinksTo"
      :private="isPrivate"
      :author="author"
    />

    <!-- This div makes mask⬇️ do not move -->
    <div class="relative">
      <div class="flex overflow-auto space-x-2 md:pb-2">
        <!-- This div is used to set the width of VideoCard -->
        <div v-for="(video, index) in videos" :key="index" class="w-48 flex-shrink-0 flex-grow-0 md:w-64">
          <VideoCard
            class="w-full"
            :video="video"
          />
        </div>

        <div v-if="count" class="w-48 flex-shrink-0 flex-grow-0 md:w-64">
          <PlaylistCoverLink :title-links-to="titleLinksTo" :count="count" :cover="cover" />
        </div>
      </div>

      <!-- Mask⬆️ for more video, "-1" position is adjusted for screen larger than 1920px, for mysterious no covering the video -->
      <div class="pointer-events-none absolute w-30 from-light-100 to-transparent bg-gradient-to-l -bottom-1 -right-1 -top-1 md:w-50 dark:from-dark-100" />
    </div>
  </div>
</template>
