<script setup lang="ts">
/* ====== Props & Emits ====== */
// 两种互斥 props：视频或播放列表
interface PropsWithVideo {
  videoId: string
  playlistId?: never
}
interface PropsWithPlaylist {
  videoId?: never
  playlistId: string
}

const props = defineProps<PropsWithVideo | PropsWithPlaylist>()
const emit = defineEmits(['submit'])

/* ====== State & Computeds ====== */
const userStore = useUserStore()
const auth = computed(() => userStore.auth?.profile || null)
const comment = ref('')
const isSubmitting = ref(false)

/* ====== GraphQL / API ====== */
const commentParentType = computed(() =>
  props.videoId ? 'VIDEO' : props.playlistId ? 'PLAYLIST' : null,
)

const { mutate: mutatePostComment } = useMutation(gql`
  mutation ($type: CommentType!, $id: String!, $content: String!) {
    postComment(para: { commentType: $type, targetId: $id, content: $content, filter: false }) {
      commentId
      thread {
        id
      }
    }
  }
`)

/* ====== Submit Handler ====== */
async function handleSubmit() {
  if (!auth.value) {
    useToast().error('请先登录后再发表评论')
    return
  }

  if (!comment.value.trim())
    return

  isSubmitting.value = true

  const success = await mutatePostComment({
    type: commentParentType.value,
    id: props.videoId || props.playlistId || '',
    content: comment.value.trim(),
  }).then(() => {
    useToast().success('评论发布成功')
    return true
  }).catch((error) => {
    useToast().error(`评论发布失败：${error}`)
    return false
  })

  isSubmitting.value = false

  if (!success)
    return

  emit('submit')
  comment.value = ''
}
</script>

<template>
  <section class="border border-outlineVariant rounded-2xl bg-surfaceContainerLowest p-4 shadow-sm dark:border-dark-outlineVariant dark:bg-dark-surfaceContainer">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-base text-onSurface font-semibold dark:text-dark-onSurface">
        发表评论
      </h2>
    </div>

    <CommentInput
      v-model="comment"
      :placeholder="auth ? '写下你的评论' : '登录后发表评论'"
      :loading="isSubmitting"
      :disabled="!auth"
      :rows="5"
      @submit="handleSubmit"
    />
  </section>
</template>
