<!-- https://github.com/JohnCampionJr/vite-plugin-vue-layouts?tab=readme-ov-file#set-static-data-at-the-page -->
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-white text-black transition-colors duration-300 ease-in-out dark:bg-dark dark:text-white">
    <LayoutNavTop />
    <RouterView class="mx-auto max-w-500 px-6 lg:px-40 sm:px-15" />
    <LayoutFooter />
  </div>
</template>

<style scoped>
</style>
