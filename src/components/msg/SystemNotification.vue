<script lang="ts" setup>
const props = defineProps<{
  note: globalThis.schema.SystemNotificationObject
}>()

const router = useRouter()

function handleClick() {
  if (props.note.relatedLink) {
    router.push(props.note.relatedLink)
  }
}
</script>

<template>
  <div
    class="cursor-pointer border-l-4 border-blue-500 bg-blue-50 p-4 transition-colors hover:bg-blue-100 dark:bg-dark-100 dark:hover:bg-dark-200"
    @click="handleClick"
  >
    <div class="font-bold">
      系统消息
    </div>
    <div class="text-sm text-gray-600 dark:text-gray-200">
      {{ note.content }}
    </div>
    <div class="text-xs text-gray-400">
      {{ note.time }}
    </div>
  </div>
</template>
