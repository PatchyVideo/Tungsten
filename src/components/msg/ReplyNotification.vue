<script lang="ts" setup>
defineProps<{
  note: globalThis.schema.ReplyNotificationObject
}>()
</script>

<template>
  <div
    :class="note.read ? 'bg-gray-100 dark:bg-dark-300' : ''"
    class="box-border w-full flex gap-2 rounded bg-gray-50 p-x-4 p-y-2 dark:bg-dark-100"
  >
    <Avatar :image="note.repliedBy.image" class="h-12 w-12 rounded-full" />
    <div>
      <div class="">
        {{ note.repliedBy.username }} 回复了你
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-200">
        {{ note.content }}
      </div>
      <div class="text-xs text-gray-400">
        {{ formatTime(note.time) }}
      </div>
    </div>
  </div>
</template>
