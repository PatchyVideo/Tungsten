<script lang="ts" setup>
import type { CommentItemType } from '@/utils/comment'

const props = defineProps<{
  tid: string | null
  refreshToken?: number
}>()

/* ====== User ====== */
const userStore = useUserStore()
const currentUserId = computed(() => userStore.auth?.profile?.uid)
const isAdmin = computed(() => userStore.isAdmin)

/* ====== Query ====== */
const { result, refetch } = useQuery<Query>(
  gql`
    query ($tid: String!) {
      getThread(para: { threadId: $tid }) {
        count
        comments {
          id
          content
          hidden
          deleted
          edited
          pinned
          upvotes
          downvotes
          meta {
            createdAt
            createdBy {
              id
              username
              image
              gravatar
              desc
            }
          }
          children {
            id
            content
            hidden
            deleted
            edited
            pinned
            upvotes
            downvotes
            meta {
              createdAt
              createdBy {
                id
                username
                image
                gravatar
                desc
              }
            }
          }
        }
      }
    }
  `,
  () => ({
    tid: props.tid,
  }),
  () => ({
    enabled: !!props.tid,
  }),
)

watch(() => props.refreshToken, () => {
  if (props.tid)
    refetch({ tid: props.tid })
})

const getThread = computed(() => result.value?.getThread || null)

// comments
const comments = computed(
  () => {
    if (getThread.value && getThread.value.comments) {
      return getThread.value.comments
      // comment needs to have content & not be deleted
        ?.filter(v => v.content && v.meta.createdBy && !v.deleted && (!v.hidden || isAdmin.value))
      // filter children
        .map(comment => ({
          ...comment,
          children: comment.children
          // comment needs to have content & not be deleted, hide hidden from non-admin
            ?.filter(v => v.content && v.meta.createdBy && !v.deleted && (!v.hidden || isAdmin.value))
          // sort by createdAt, latest first
            .sort((a, b) => +b.meta.createdAt - +a.meta.createdAt),
        }))
      // filter out empty comments
        .filter(v => !!v)
      // sort by createdAt, latest first
        .sort(
          (a, b) => +b.meta.createdAt + (b.pinned ? 1 << 32 : 0) - (+a.meta.createdAt + (a.pinned ? 1 << 32 : 0)),
        ) as CommentItemType[]
    }
    else {
      return []
    }
  },
)
const commentChildrenExpaneded = reactive<Record<string, boolean>>({})
function sliceCommentChildren(id: string, children: CommentItemType[]) {
  return commentChildrenExpaneded[id] ? children : children.slice(0, 3)
}
const commentHiddenOverrides = reactive<Record<string, boolean>>({})

function getHidden(id: string, serverHidden: boolean) {
  return commentHiddenOverrides[id] ?? serverHidden
}

function setHidden(id: string, value: boolean) {
  commentHiddenOverrides[id] = value
}

/* ====== Reply State ====== */
const replyingTo = ref<string | null>(null)
const replyText = ref('')
const isReplySubmitting = ref(false)

function startReply(commentId: string) {
  replyingTo.value = commentId
  replyText.value = ''
}

function cancelReply() {
  replyingTo.value = null
  replyText.value = ''
}

function getReplyUsername(commentId: string): string {
  const findComment = (list: CommentItemType[]): CommentItemType | undefined => {
    for (const c of list) {
      if (c.id === commentId)
        return c
      if (c.children) {
        const found = findComment(c.children)
        if (found)
          return found
      }
    }
    return undefined
  }
  return findComment(comments.value)?.meta.createdBy.username || ''
}

/* ====== Mutations ====== */

// postReply
const { mutate: mutatePostReply } = useMutation(gql`
  mutation ($replyTo: String!, $text: String!) {
    postReply(para: { replyTo: $replyTo, text: $text, filter: false }) 
  }
`)

async function handleReplySubmit() {
  if (!replyText.value.trim())
    return
  isReplySubmitting.value = true
  const ok = await mutatePostReply({
    replyTo: replyingTo.value!,
    text: replyText.value.trim(),
  }).then(() => true).catch((e) => {
    useToast().error(`回复失败：${e}`)
    return false
  })
  isReplySubmitting.value = false
  if (ok) {
    useToast().success('回复成功')
    cancelReply()
    refresh()
  }
}

// editComment
const { mutate: mutateEditComment } = useMutation(gql`
  mutation ($cid: String!, $text: String!) {
    editComment(para: { cid: $cid, text: $text, filter: false })
  }
`)

async function handleEditSubmit(commentId: string, content: string) {
  const ok = await mutateEditComment({ cid: commentId, text: content }).then(() => true).catch((e) => {
    useToast().error(`编辑失败：${e}`)
    return false
  })
  if (ok) {
    useToast().success('评论已编辑')
    refresh()
  }
}

// delComment
const { mutate: mutateDelComment } = useMutation(gql`
  mutation ($cid: String!) {
    delComment(cid: $cid)
  }
`)

const showDeleteDialog = ref(false)
const deleteTargetId = ref<string | null>(null)

function openDeleteDialog(commentId: string) {
  deleteTargetId.value = commentId
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!deleteTargetId.value)
    return
  const ok = await mutateDelComment({ cid: deleteTargetId.value }).then(() => true).catch((e) => {
    useToast().error(`删除失败：${e}`)
    return false
  })
  showDeleteDialog.value = false
  deleteTargetId.value = null
  if (ok) {
    useToast().success('评论已删除')
    refresh()
  }
}

// hideComment
const { mutate: mutateHideComment } = useMutation(gql`
  mutation ($cid: String!) {
    hideComment(cid: $cid)
  }
`)

async function handleToggleHide(commentId: string) {
  const comment = findCommentById(commentId)
  const ok = await mutateHideComment({ cid: commentId }).then(() => true).catch((e) => {
    useToast().error(`操作失败：${e}`)
    return false
  })
  if (ok) {
    useToast().success(comment?.hidden ? '评论已取消隐藏' : '评论已隐藏')
    refresh()
  }
}

// pinComment
const { mutate: mutatePinComment } = useMutation(gql`
  mutation ($cid: String!, $pin: Boolean!) {
    pinComment(cid: $cid, pin: $pin)
  }
`)

async function handleTogglePin(commentId: string) {
  const comment = findCommentById(commentId)
  const ok = await mutatePinComment({ cid: commentId, pin: !comment?.pinned }).then(() => true).catch((e) => {
    useToast().error(`操作失败：${e}`)
    return false
  })
  if (ok) {
    useToast().success(comment?.pinned ? '评论已取消置顶' : '评论已置顶')
    refresh()
  }
}

/* ====== Helpers ====== */
function findCommentById(id: string): CommentItemType | undefined {
  for (const c of comments.value) {
    if (c.id === id)
      return c
    if (c.children) {
      const found = c.children.find(child => child.id === id)
      if (found)
        return found
    }
  }
  return undefined
}

function refresh() {
  if (props.tid)
    refetch({ tid: props.tid })
}
</script>

<template>
  <div>
    <div v-if="!comments.length" class="border-purple-100 border-t-solid -mb-2 lg:mb-0 lg:border-t-0 lg:border-b-solid lg:text-lg lg:font-semibold">
      暂无评论
    </div>
    <div v-else class="space-y-2">
      <div class="border-purple-100 border-t-solid -mb-2 lg:mb-0 lg:border-t-0 lg:border-b-solid lg:text-lg lg:font-semibold">
        {{ `共 ${comments.length} 条评论` }}
      </div>
      <div class="divide-y divide-purple-100">
        <div v-for="item in comments" :key="item.id" class="py-3 space-y-2 md:py-6">
          <!-- Main comment -->
          <CommentItem
            :hidden="getHidden(item.id, item.hidden)"
            :comment="item"
            :current-user-id="currentUserId"
            :is-admin="isAdmin"
            @update:hidden="value => setHidden(item.id, value)"
            @reply="startReply"
            @submit-edit="handleEditSubmit"
            @delete="openDeleteDialog"
            @toggle-hide="handleToggleHide"
            @toggle-pin="handleTogglePin"
          />

          <!-- Inline Reply Input -->
          <div v-if="replyingTo === item.id" class="ml-10 md:ml-12">
            <CommentInput
              v-model="replyText"
              :placeholder="`回复 @${getReplyUsername(item.id)}`"
              :loading="isReplySubmitting"
              :show-cancel="true"
              :rows="3"
              @submit="handleReplySubmit"
              @cancel="cancelReply"
            />
          </div>

          <!-- Child comment -->
          <div v-if="item.children?.length" class="ml-10 md:ml-12 divide-y divide-purple-100">
            <CommentItem
              v-for="child in item.children
                ? sliceCommentChildren(item.id, item.children)
                : undefined"
              :key="child.id"
              class="py-1 md:py-2"
              :comment="child"
              child
              :hidden="getHidden(child.id, child.hidden)"
              :current-user-id="currentUserId"
              :is-admin="isAdmin"
              @update:hidden="value => setHidden(child.id, value)"
              @reply="startReply"
              @submit-edit="handleEditSubmit"
              @delete="openDeleteDialog"
              @toggle-hide="handleToggleHide"
              @toggle-pin="handleTogglePin"
            />

            <!-- Inline Reply Input (for child comments) -->
            <div v-if="replyingTo && item.children?.some(c => c.id === replyingTo)" class="py-1 md:py-2">
              <CommentInput
                v-model="replyText"
                :placeholder="`回复 @${getReplyUsername(replyingTo)}`"
                :loading="isReplySubmitting"
                :show-cancel="true"
                :rows="3"
                @submit="handleReplySubmit"
                @cancel="cancelReply"
              />
            </div>
          </div>

          <!-- Child comment expanded button -->
          <div
            v-if="item.children && item.children.length > 3"
            class="flex flex-row flex-nowrap cursor-pointer pl-10 md:pl-12"
            @click="
              () => {
                commentChildrenExpaneded[item.id] = !commentChildrenExpaneded[item.id]
              }
            "
          >
            <div
              v-if="commentChildrenExpaneded[item.id]"
              class="flex flex-row cursor-pointer items-center text-sm text-xs text-purple-300 underline"
            >
              收起楼中楼
            </div>
            <div v-else class="flex flex-row cursor-pointer items-center text-sm text-xs text-purple-300 underline">
              {{ `展开共${item.children.length}条评论` }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <HDialog :open="showDeleteDialog" class="relative z-50" @close="() => { showDeleteDialog = false; deleteTargetId = null }">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <HDialogPanel class="max-w-sm w-full rounded-2xl bg-surfaceContainerLowest p-6 shadow-xl dark:bg-dark-surfaceContainer">
          <HDialogTitle class="text-lg text-onSurface font-semibold dark:text-dark-onSurface">
            删除评论
          </HDialogTitle>
          <p class="mt-2 text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
            确定要删除这条评论吗？此操作不可撤销。
          </p>
          <div class="mt-4 flex justify-end gap-2">
            <button
              class="btn-outline btn"
              @click="() => { showDeleteDialog = false; deleteTargetId = null }"
            >
              取消
            </button>
            <button
              class="bg-red-500 text-white btn hover:bg-red-600"
              @click="confirmDelete"
            >
              删除
            </button>
          </div>
        </HDialogPanel>
      </div>
    </HDialog>
  </div>
</template>
