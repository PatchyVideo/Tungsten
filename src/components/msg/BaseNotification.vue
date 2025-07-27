<script lang="ts" setup>
defineProps<{
  note: globalThis.schema.BaseNotificationObject
}>()
</script>

<template>
  <div class="border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-dark-100">
    <div class="font-bold">
      {{ note }}
    </div>
    <div class="text-sm text-gray-700">
      {{ note }}
    </div>
    <div class="text-xs text-gray-400">
      {{ note.time }}
    </div>
  </div>
</template>

<style scoped>
</style>
