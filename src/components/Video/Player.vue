<script setup lang="ts">
const props = defineProps<{
  item: schema.VideoItem
}>()

// 平台配置：site → 嵌入地址构造器
const PLATFORMS: Record<string, (item: schema.VideoItem) => string> = {
  bilibili: (item) => {
    // 从 url 提取 av号和分P，或者直接用 cid
    const match = item.url.match(/av(\d+)(?:\?p=(\d+))?/)
    const aid = match?.[1] ?? ''
    const page = match?.[2] ?? '1'
    return `//player.bilibili.com/player.html?aid=${aid}&page=${page}&cid=${item.cid ?? ''}`
  },
  nicovideo: (item) => {
    const match = item.url.match(/sm(\d+)/)
    return `//embed.nicovideo.jp/watch/sm${match?.[1] ?? ''}`
  },
  youtube: (item) => {
    const match = item.url.match(/v=([\w-]+)/)
    return `https://www.youtube.com/embed/${match?.[1] ?? ''}`
  },
  acfun: (item) => {
    const match = item.url.match(/ac(\d+)/)
    return `https://www.acfun.cn/player/ac${match?.[1] ?? ''}`
  },
}

const iframeUrl = computed(() => {
  const { site, url } = props.item
  if (!url)
    return ''

  const builder = PLATFORMS[site?.toLowerCase()]
  if (!builder)
    return ''

  return builder(props.item)
})

const isUnsupported = computed(() => props.item.url && !iframeUrl.value)
</script>

<template>
  <div class="relative aspect-16/9 bg-black">
    <iframe
      v-show="iframeUrl"
      :src="iframeUrl"
      title="Video Player"
      class="block h-full w-full"
      allow="fullscreen; encrypted-media; picture-in-picture"
      loading="lazy"
      frameborder="0"
    />
    <div
      v-if="!props.item.url"
      class="absolute inset-0 flex items-center justify-center text-warm-gray-400"
    >
      暂无视频
    </div>
    <div
      v-else-if="isUnsupported"
      class="absolute inset-0 flex items-center justify-center text-warm-gray-400"
    >
      不支持的视频平台: {{ props.item.site }}
    </div>
  </div>
</template>
