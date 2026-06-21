<script lang="ts" setup>
const props = defineProps<{
  tag: schema.TagObject
}>()

// TODO: support muti languages
const tagComp = computed(() => {
  return {
    category: props.tag.category.toLowerCase(),
    name: props.tag.languages.find(item => item.lang === 'CHS' || item.lang === 'JPN')?.value.replace(/_/g, ' ') || 'null',
  }
})
const catogoryMap: {
  [propName: string]: any
} = {
  copyright: 'bg-copyright',
  language: 'bg-language',
  character: 'bg-character',
  author: 'bg-author',
  general: 'bg-general',
  meta: 'bg-meta',
  soundtrack: 'bg-soundtrack',
}

const router = useRouter()

function search() {
  router.push({ path: '/search', query: { q: tagComp.value.name } })
}
</script>

<template>
  <div class="inline-block cursor-pointer border border-2 border-purple-200 rounded-full border-solid px-2" @click="search()">
    <div class="flex items-center space-x-1">
      <div class="inline-block h-1 w-1 rounded-full" :class="catogoryMap[tagComp.category]" />
      <div>{{ tagComp.name }}</div>
    </div>
  </div>
</template>
