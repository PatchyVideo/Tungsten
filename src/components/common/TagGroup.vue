<script lang="ts" setup>
const props = withDefaults(defineProps<{
  tags: schema.TagObject[]
  layout?: 'block' | 'inline'
}>(), {
  layout: 'block',
})

const categoryOrder = [
  'COPYRIGHT',
  'CHARACTER',
  'AUTHOR',
  'GENERAL',
  'SOUNDTRACK',
  'LANGUAGE',
  'META',
] as const

const categoryLabelMap: Record<string, string> = {
  COPYRIGHT: '作品',
  CHARACTER: '角色',
  AUTHOR: '作者',
  GENERAL: '综合',
  SOUNDTRACK: '原曲',
  LANGUAGE: '语言',
  META: '元数据',
}

const categoryColorMap: Record<string, string> = {
  COPYRIGHT: 'bg-copyright',
  CHARACTER: 'bg-character',
  AUTHOR: 'bg-author',
  GENERAL: 'bg-general',
  SOUNDTRACK: 'bg-soundtrack',
  LANGUAGE: 'bg-language',
  META: 'bg-meta',
}

const groupedTags = computed(() => {
  const groups = new Map<string, typeof props.tags>()
  for (const tag of props.tags) {
    const list = groups.get(tag.category) || []
    list.push(tag)
    groups.set(tag.category, list)
  }
  return categoryOrder
    .filter(cat => groups.has(cat) && groups.get(cat)!.length > 0)
    .map(cat => ({
      category: cat,
      label: categoryLabelMap[cat] || cat,
      color: categoryColorMap[cat] || '',
      tags: groups.get(cat)!,
    }))
})
</script>

<template>
  <div v-if="props.layout === 'block'" class="space-y-2">
    <div v-for="group in groupedTags" :key="group.category" class="flex items-start gap-2">
      <span
        class="mt-0.5 inline-block shrink-0 rounded px-2 py-0.5 text-xs font-medium"
        :class="[group.color, 'text-onSurface dark:text-dark-onSurface']"
      >
        {{ group.label }}
      </span>
      <div class="flex flex-wrap gap-1.5">
        <Tag v-for="tag in group.tags" :key="tag.tagid" :tag="tag" />
      </div>
    </div>
  </div>
  <div v-else class="flex flex-wrap items-center gap-1.5">
    <template v-for="(group, idx) in groupedTags" :key="group.category">
      <span v-if="idx > 0" class="text-outlineVariant dark:text-dark-outlineVariant">|</span>
      <Tag v-for="tag in group.tags" :key="tag.tagid" :tag="tag" />
    </template>
  </div>
</template>
