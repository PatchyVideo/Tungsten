<!-- User's name, avatar, status and desc -->
<script lang="ts" setup>
defineProps<{
  id?: string
  username: string
  smallSize?: boolean
  image?: string | null
  gravatar?: string | null
  status?: string
  desc?: string | null
  // show default img/desc when user have no img/desc
  showImg?: boolean
  showDesc?: boolean
}>()
</script>

<template>
  <div class="flex items-center space-x-1">
    <Avatar
      v-if="showImg || image || gravatar"
      class="cursor-pointer rounded-full"
      :class="smallSize ? 'w-6 h-6' : 'w-8 h-8'"
      openable
      hide-title
      :alt="username"
      :image="image"
      :gravatar="gravatar"
    />
    <div class="flex flex-col">
      <div class="flex items-center space-x-1">
        <div v-if="status" class="rounded bg-purple-300 px-1 text-xs text-white">
          {{ status }}
        </div>
        <RouterLink v-if="id" :to="`/user/${id}`" :class="{ 'text-sm': smallSize }">
          {{ username }}
        </RouterLink>
        <div v-else>
          {{ username }}
        </div>
      </div>
      <div v-if="showDesc || desc" class="truncate text-xs" :class="{ 'text-sm': smallSize }">
        {{ desc || '这个人太懒啦，并没有写简介' }}
      </div>
    </div>
  </div>
</template>
