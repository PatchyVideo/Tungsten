<!-- Meta messages of playlist in playlist detail page -->
<script lang="ts" setup>
defineProps<{
  meta: {
    title: string
    private: boolean
    author: schema.Maybe<schema.User>
    tags: schema.TagObject[]
    rating?: schema.Maybe<schema.Rating>
    cover: string
    desc: string
  } | null
}>()
</script>

<template>
  <div>
    <div v-if="!meta" class="h-64 w-full bg-gray-200" />
    <div v-else class="relative grid grid-cols-1 w-full overflow-hidden rounded-md text-gray-400 md:grid-cols-3 md:grid-rows-1 md:rounded-none">
      <div class="absolute left-2 top-2 z-1 bg-black bg-opacity-30 p-1 text-lg text-white md:left-auto md:bg-opacity-0 md:p-3 md:text-4xl md:text-black md:font-bold" :class="{ '-ml-2': meta.title.startsWith('【') }">
        {{ meta.title }}
      </div>

      <div class="relative aspect-ratio-3/1 md:order-last md:aspect-ratio-16/9 md:h-full">
        <img
          class="h-full w-full bg-gray-300 object-cover dark:bg-gray-600"
          :src="`https://patchyvideo.com/images/covers/${meta.cover}`"
        >
        <div class="absolute inset-0 from-light-200 to-transparent bg-gradient-to-t md:bg-gradient-to-r" />
      </div>

      <div class="flex flex-col gap-2 bg-light-200 p-1 text-sm md:col-span-2 md:p-5 md:pt-18">
        <UserMeta
          v-if="meta.author"
          :id="meta.author.id"
          :image="meta.author.image"
          :gravatar="meta.author.gravatar ?? undefined"
          status="上传者"
          :username="meta.author.username"
          :desc="meta.author.desc"
        />

        <div v-if="!meta.tags.length">
          {{ '标签：暂无标签' }}
        </div>
        <div v-else>
          <Tag v-for="tag in meta.tags" :key="tag.id" :tag="tag" class="my-0.5 mr-0.5" />
        </div>

        <Rank :rating="meta.rating || null" />

        <CommentBlock :text="meta.desc" size="sm" class="order-first md:order-none" />
      </div>
    </div>
  </div>
</template>
