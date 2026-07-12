<script lang="ts" setup>
import type { CommentItemType } from '@/utils/comment'

const props = defineProps<{
  comment: CommentItemType
  child?: boolean
  hidden: boolean
  currentUserId?: string
  isAdmin?: boolean
}>()
const emit = defineEmits<{
  (event: 'update:hidden', value: boolean): void
  (event: 'reply', commentId: string): void
  (event: 'submitEdit', commentId: string, content: string): void
  (event: 'delete', commentId: string): void
  (event: 'toggleHide', commentId: string): void
  (event: 'togglePin', commentId: string): void
}>()
const hidden = useVModel(props, 'hidden', emit)

// 权限判断
const isAuthor = computed(() => props.currentUserId === props.comment.meta.createdBy.id)
const canDelete = computed(() => isAuthor.value || props.isAdmin)

// 内联编辑状态
const isEditing = ref(false)
const editText = ref('')
const isEditSubmitting = ref(false)

function startEdit() {
  editText.value = props.comment.content
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  editText.value = ''
}

function submitEdit() {
  if (!editText.value.trim())
    return
  emit('submitEdit', props.comment.id, editText.value.trim())
}
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
    <div class="min-w-0 flex flex-1 flex-col">
      <!-- User Meta -->
      <div class="text-xs md:flex md:items-center md:space-x-2">
        <RouterLink class="text-gray-600 md:text-base" :to="`/user/${props.comment.meta.createdBy.id}`">
          {{ props.comment.meta.createdBy.username }}
        </RouterLink>
        <div class="text-gray-400 md:text-sm">
          <span>{{ formatTime(props.comment.meta.createdAt) }}</span>
          <span v-if="props.comment.edited" class="ml-1.5">(edited)</span>
        </div>
        <span
          v-if="props.comment.pinned"
          class="ml-1.5 text-xs text-purple-500 dark:text-purple-400"
        >置顶</span>
      </div>

      <!-- Editing Mode -->
      <div v-if="isEditing" class="mt-1">
        <CommentInput
          v-model="editText"
          :loading="isEditSubmitting"
          :show-cancel="true"
          submit-label="保存"
          :rows="3"
          @submit="submitEdit"
          @cancel="cancelEdit"
        />
      </div>

      <!-- Content (non-editing) -->
      <template v-else>
        <div
          v-if="hidden"
          class="text-gray-400"
        >
          此评论已被折叠
          <span
            class="cursor-pointer text-xs text-purple-300 underline"
            @click="() => hidden = false"
          >显示评论</span>
        </div>
        <CommentBlock v-else :text="props.comment.content.trim() ? props.comment.content : 'null'" />

        <!-- Vote Display -->
        <div
          v-if="(props.comment.upvotes || props.comment.downvotes) && !hidden"
          class="mt-1 flex items-center gap-2 text-xs text-gray-400"
        >
          <span v-if="props.comment.upvotes">👍 {{ props.comment.upvotes }}</span>
          <span v-if="props.comment.downvotes">👎 {{ props.comment.downvotes }}</span>
        </div>

        <!-- Action Buttons -->
        <div
          v-if="!hidden"
          class="mt-1 flex items-center gap-1 text-xs text-gray-400"
        >
          <button
            v-if="currentUserId"
            class="cursor-pointer border-0 bg-transparent p-0 text-gray-400 transition-colors hover:text-purple-500"
            @click="emit('reply', props.comment.id)"
          >
            回复
          </button>
          <template v-if="isAuthor">
            <span>·</span>
            <button
              class="cursor-pointer border-0 bg-transparent p-0 text-gray-400 transition-colors hover:text-purple-500"
              @click="startEdit"
            >
              编辑
            </button>
          </template>
          <template v-if="canDelete">
            <span>·</span>
            <button
              class="cursor-pointer border-0 bg-transparent p-0 text-gray-400 transition-colors hover:text-red-500"
              @click="emit('delete', props.comment.id)"
            >
              删除
            </button>
          </template>
          <template v-if="isAdmin">
            <span>·</span>
            <button
              class="cursor-pointer border-0 bg-transparent p-0 text-gray-400 transition-colors hover:text-purple-500"
              @click="emit('toggleHide', props.comment.id)"
            >
              {{ props.comment.hidden ? '取消隐藏' : '隐藏' }}
            </button>
          </template>
          <template v-if="isAdmin">
            <span>·</span>
            <button
              class="cursor-pointer border-0 bg-transparent p-0 text-gray-400 transition-colors hover:text-purple-500"
              @click="emit('togglePin', props.comment.id)"
            >
              {{ props.comment.pinned ? '取消置顶' : '置顶' }}
            </button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
