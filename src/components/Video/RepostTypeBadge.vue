<script lang="ts" setup>
const props = defineProps<{
  repostType: string
}>()

const repostTypeMap: Record<string, { label: string, icon: string, color: string }> = {
  official: { label: '原始发布', icon: 'i-mdi-file-certificate-outline', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  official_repost: { label: '官方再发布', icon: 'i-mdi-share-variant-outline', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  authorized_translation: { label: '授权翻译', icon: 'i-mdi-translate', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' },
  authorized_repost: { label: '授权转载', icon: 'i-mdi-link-variant', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  translation: { label: '自发翻译', icon: 'i-mdi-text-box-outline', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  repost: { label: '自发搬运', icon: 'i-mdi-truck-delivery-outline', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400' },
  unknown: { label: '未知', icon: 'i-mdi-help-circle-outline', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-500' },
}

const badge = computed(() => repostTypeMap[props.repostType] || repostTypeMap.unknown)
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="badge.color"
  >
    <span class="h-3.5 w-3.5" :class="badge.icon" />
    {{ badge.label }}
  </span>
</template>
