<script lang="ts" setup>
defineProps<{
  index: number
  item: schema.LeaderboardResultItem
}>()
</script>

<template>
  <div class="flex items-center justify-between border-purple-200 pb-4 md:mb-4 md:border-b-1 md:px-5">
    <div class="items-top relative aspect-ratio-1/1 w-1/10 flex justify-center">
      <div class="absolute inset-0 z-1 flex items-center justify-center text-white font-extrabold lg:text-5xl md:text-xl">
        {{ index }}
      </div>
      <ContributorLogoTop v-if="index <= 3" :color-type="index" />
      <ContributorLogo v-else />
    </div>
    <Avatar
      class="w-1/6 cursor-pointer rounded-full md:w-1/10"

      hide-title openable
      :alt="item.user.username"
      :image="item.user.image"
      :gravatar="item.user.gravatar"
    />
    <div class="w-2/3 flex flex-col justify-between md:flex-row md:items-center">
      <RouterLink :to="`/user/${item.user.id}`" class="break-words text-gray-900 text-opacity-50 md:w-1/6 lg:text-2xl" :class="{ 'font-bold': index <= 3, 'text-yellow-400': index === 1, 'text-gray-400': index === 2, 'text-orange-400': index === 3 }" :title="item.user.username">
        {{ item.user.username }}
      </RouterLink>
      <div class="line-clamp-1 text-xs text-gray-300 md:line-clamp-3 md:w-1/4 md:text-ellipsis lg:text-xl">
        {{ item.user.desc }}
      </div>
      <div class="break-words text-xs text-gray-900 text-opacity-50 lg:w-60 md:w-45 lg:text-2xl" :class="{ 'font-bold': index <= 3, 'text-yellow-400': index === 1, 'text-gray-400': index === 2, 'text-orange-400': index === 3 }">
        {{ `编辑次数: ${item.count}` }}
      </div>
    </div>
  </div>
</template>
