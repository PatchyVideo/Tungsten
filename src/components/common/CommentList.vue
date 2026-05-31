<script lang="ts" setup>
import type { CommentItemType } from '@/utils/comment'

const props = defineProps<{
  tid: string | null
  refreshToken?: number
}>()

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
        ?.filter(v => v.content && v.meta.createdBy && !v.deleted)
      // filter children
        .map(comment => ({
          ...comment,
          children: comment.children
          // comment needs to have content & not be deleted
            ?.filter(v => v.content && v.meta.createdBy && !v.deleted)
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

function getHidden(id: string) {
  return commentHiddenOverrides[id] ?? false
}

function setHidden(id: string, value: boolean) {
  commentHiddenOverrides[id] = value
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
            :hidden="getHidden(item.id)"
            :comment="item"
            @update:hidden="value => setHidden(item.id, value)"
          />

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
              :hidden="getHidden(child.id)"
              @update:hidden="value => setHidden(child.id, value)"
            />
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
  </div>
</template>
