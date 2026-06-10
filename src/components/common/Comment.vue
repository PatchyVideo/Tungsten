<script setup lang="ts">
import { KAOMOJI_LIST } from '@/utils/kaomoji'

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
// 当前登录用户信息（若未登录为 null）
const auth = computed(() => userStore.auth?.profile || null)
// 文本框内容与引用
const comment = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
// 是否允许提交（已登录且有非空内容）
const canSubmit = computed(() => !!auth.value && comment.value.trim().length > 0)

/* ====== Emoji 列表与插入辅助 ====== */
// 按 Unicode 范围生成 emoji 列表，保持 UI 与业务逻辑分离
const EMOJI_RANGES: [number, number][] = [
  [0x1F600, 0x1F64F], // 😀–🙏 (80)
  [0x1F910, 0x1F92F], // 🤐–🤯 (32)
  [0x1F446, 0x1F450], // 👆–👐 (11)
  [0x1F494, 0x1F49F], // 💔–💟 (12)
  [0x1F4A2, 0x1F4AF], // 💢–💯 (14)
]
const EMOJI_LIST = EMOJI_RANGES.flatMap(([start, end]) =>
  Array.from({ length: end - start + 1 }, (_, i) => String.fromCodePoint(start + i)),
)

/** 在当前光标位置插入 emoji 并恢复光标 */
function insertEmoji(emoji: string) {
  const textarea = textareaRef.value
  if (!textarea) {
    comment.value += emoji
    return
  }
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  comment.value = comment.value.substring(0, start) + emoji + comment.value.substring(end)
  nextTick(() => {
    textarea.focus()
    const pos = start + emoji.length
    textarea.setSelectionRange(pos, pos)
  })
}

/* ====== GraphQL / API ====== */
// 决定提交时使用的视频/播放列表类型
const commentParentType = computed(() =>
  props.videoId ? 'VIDEO' : props.playlistId ? 'PLAYLIST' : null,
)

// 提交评论的 mutation
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
/**
 * 提交评论：
 * - 先做本地校验（登录、非空）
 * - 触发 mutation 并在成功后 emit('submit') 通知父组件刷新
 * - 使用 NProgress 提示网络进度，仅在提交期间显示
 */
async function handleSubmit() {
  if (!auth.value) {
    useToast().error('请先登录后再发表评论')
    return
  }

  if (!canSubmit.value)
    return

  NProgress.start()

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

  NProgress.done()

  if (!success)
    return

  // 仅在 mutation 成功后通知父组件刷新评论区
  emit('submit')

  // 清空输入框内容
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

    <div class="">
      <textarea
        ref="textareaRef"
        v-model="comment"
        class="box-border w-full resize-none overflow-y-auto b-none bg-transparent caret-onSurface outline-none transition-colors dark:text-dark-onSurface dark:caret-dark-onSurface"
        :placeholder="auth ? '写下你的评论' : '登录后发表评论'"
        :disabled="!auth"
        rows="5"
      />

      <div class="flex items-center justify-between gap-3">
        <span class="flex items-center gap-2 text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
          <!-- {{ auth ? `当前账号：${auth.username}` : '' }} -->
          <!-- 请先登录后再发表评论 -->
          <Popover placement="bottom-start">
            <div class="i-mdi-emoticon-outline m-0.5 cursor-pointer text-xl" />
            <template #dropdown>
              <div class="grid grid-cols-10 max-h-60 w-64 gap-0.5 overflow-y-auto p-2 text-lg">
                <button
                  v-for="emoji in EMOJI_LIST"
                  :key="emoji"
                  class="cursor-pointer border-0 bg-transparent p-0.5 text-center transition-colors hover:bg-surfaceContainer dark:hover:bg-dark-surfaceContainerHigh"
                  @click="insertEmoji(emoji)"
                >
                  {{ emoji }}
                </button>
              </div>
            </template>
          </Popover>
          <Popover placement="bottom-start">
            <div class="i-mdi-sticker-emoji cursor-pointer text-xl" />
            <template #dropdown>
              <div class="grid grid-cols-4 max-h-48 w-90 gap-1 overflow-y-auto p-2 text-base">
                <button
                  v-for="kw in KAOMOJI_LIST"
                  :key="kw"
                  class="cursor-pointer whitespace-nowrap border-0 rounded bg-transparent p-1 text-center transition-colors hover:bg-surfaceContainer dark:hover:bg-dark-surfaceContainerHigh"
                  @click="insertEmoji(kw)"
                >
                  {{ kw }}
                </button>
              </div>
            </template>
          </Popover>
          <p>请遵守 <a href="https://patchyvideo.wiki/zh/Comments" target="_blank" rel="noopener noreferrer">评论规范</a> 哟</p>
        </span>

        <!-- <div class="flex items-center gap-4"> -->
        <button
          type="button"
          class="btn"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          发布
        </button>
        <!-- </div> -->
      </div>
    </div>
  </section>
</template>
