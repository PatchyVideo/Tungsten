<script lang="ts" setup>
import type { CommentItemType } from '@/utils/comment'

const props = defineProps<{
  comment: CommentItemType
  child?: boolean
  hidden: boolean
}>()
const emit = defineEmits<{
  (event: 'update:hidden', value: boolean): void
}>()
const hidden = useVModel(props, 'hidden', emit)
</script>

<template>
  <div class="flex items-start space-x-2">
    <Avatar
      class="mt-1 h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
      :class="{ 'w-6 h-6 md:h-8 md:w-8': child }"
      :image="props.comment.meta.createdBy.image"
      :gravatar="props.comment.meta.createdBy.gravatar"
      :alt="props.comment.meta.createdBy.username"
      hide-title
    />
    <div class="flex flex-col">
      <!-- User Meta -->
      <div class="text-xs md:flex md:items-center md:space-x-2">
        <RouterLink class="text-gray-600 md:text-base" :to="`/user/${props.comment.meta.createdBy.id}`">
          {{ props.comment.meta.createdBy.username }}
        </RouterLink>
        <div class="text-gray-400 md:text-sm">
          <span>{{ formatTime(props.comment.meta.createdAt) }}</span>
          <span v-if="props.comment.edited" class="ml-1.5">(edited)</span>
        </div>
      </div>
      <!-- Content -->
      <div
        v-if="hidden ?? props.comment.hidden"
        class="text-gray-400"
      >
        此评论已被折叠
        <span
          class="cursor-pointer text-xs text-purple-300 underline"
          @click="() => hidden = false"
        >显示评论</span>
      </div>
      <CommentBlock v-else :text="props.comment.content.trim() ? props.comment.content : 'null'" />
    </div>
  </div>
</template>
