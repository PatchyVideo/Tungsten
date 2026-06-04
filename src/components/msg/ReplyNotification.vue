<script lang="ts" setup>
const props = defineProps<{
  note: globalThis.schema.ReplyNotificationObject
}>()

const router = useRouter()

function handleClick() {
  const { repliedType, repliedObj } = props.note
  if (!repliedObj) return

  switch (repliedType) {
    case 'video':
      router.push(`/video/${repliedObj}`)
      break
    case 'playlist':
      router.push(`/Playlist/${repliedObj}`)
      break
    case 'forum':
      // 尚未有论坛页面路由，暂不跳转
      break
  }
}
</script>

<template>
  <div
    :class="note.read ? 'bg-gray-100 dark:bg-dark-300' : ''"
    class="box-border w-full flex cursor-pointer gap-2 rounded bg-gray-50 p-x-4 p-y-2 transition-colors hover:bg-gray-200 dark:bg-dark-100 dark:hover:bg-dark-200"
    @click="handleClick"
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
