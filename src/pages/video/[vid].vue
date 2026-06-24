<script setup lang="ts">
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const route = useRoute('/video/[vid]')
const vid = computed(() => {
  const params = route.params
  return params.vid || ''
})

// 使用 GraphQL 查询
const { result, loading, refetch } = useQuery<Query>(gql`
    query($vid: String!){
      getVideo(para: {vid: $vid, lang: "CHS"}) {
        item {
          title
          desc
          uploadTime
          url
          repostType
          site
          coverImage
        }
        clearence
        tags {
          tagid
          category
          languages{lang value}
        }
        meta {
          createdBy {
            id
            username
            image
            desc
          }
        }
        commentThread{
          id
          count
        }
        relatedVideos(topK: 20) {
          id
          item {
            title
            coverImage
            partName
            url
          }
          meta {
            createdAt
          }
        }
        playlists(lang: "CHS") {
          id
          rank
          meta {
            title
            cover
            count
            private
          }
          playlist {
            id
          }
        }
      }
    }
`, { vid })

const videoNotFound = computed(() => !loading.value && !result.value?.getVideo)

const commentRefreshToken = ref(0)

function handleCommentSubmitted() {
  commentRefreshToken.value += 1
}

watch(loading, () => {
  if (loading.value) {
    if (!NProgress.isStarted())
      NProgress.start()
  }
  else {
    if (NProgress.isStarted())
      NProgress.done()
  }
})
</script>

<template>
  <NotFound v-if="videoNotFound" message="视频不存在或已被删除" back-path="/video-list" />
  <div v-else class="mx-auto px-4 py-4 lg:px-6">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
      <main class="min-w-0 space-y-2">
        <!-- <section class="border border-gray-200 rounded-2xl bg-white p-4 shadow-sm space-y-4 dark:border-gray-700 dark:bg-dark-200 lg:p-6"> -->
        <!-- 视频播放器 -->
        <div class="aspect-video w-full overflow-hidden rounded-xl from-gray-900 via-gray-800 to-black bg-gradient-to-br shadow-inner dark:from-dark-surfaceContainerLowest dark:via-dark-surfaceContainerLow dark:to-dark-surface">
          <Player v-if="result?.getVideo?.item" class="h-full flex items-center justify-center text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant" :item="result?.getVideo?.item" />
          <div v-else-if="loading" class="h-full flex items-center justify-center text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
            加载中...
          </div>
        </div>

        <!-- 视频信息 -->
        <div class="space-y-3">
          <h1 class="text-2xl font-bold">
            {{ result?.getVideo?.item?.title }}
          </h1>
          <AdminToolbar
            v-if="isAdmin && result?.getVideo"
            :vid="vid"
            :clearence="result.getVideo.clearence"
            @refetch="refetch()"
          />
          <RepostTypeBadge
            v-if="result?.getVideo?.item?.repostType"
            :repost-type="result.getVideo.item.repostType"
          />
          <UserMeta
            v-if="result?.getVideo?.meta?.createdBy"
            :id="result.getVideo.meta.createdBy.id"
            :username="result.getVideo.meta.createdBy.username"
            :image="result.getVideo.meta.createdBy.image"
            :desc="result.getVideo.meta.createdBy.desc"
            show-img
          />
          <TagGroup v-if="result?.getVideo?.tags?.length" :tags="result.getVideo.tags" />
          <div class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="rounded-xl bg-gray-50 p-3 dark:bg-dark-surfaceContainerHigh">
              <div class="text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
                上传时间
              </div>
              <div class="mt-1 font-medium">
                {{ new Date(result?.getVideo?.item?.uploadTime || 0).toLocaleString() }}
              </div>
            </div>
            <div class="rounded-xl bg-gray-50 p-3 dark:bg-dark-surfaceContainerHigh">
              <div class="text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
                链接
              </div>
              <a :href="result?.getVideo?.item?.url" target="_blank" class="mt-1 block truncate text-primary font-medium dark:text-dark-primary hover:text-primaryContainer dark:hover:text-dark-primaryContainer">
                查看原始链接
              </a>
            </div>
          </div>
        </div>
        <!-- </section> -->

        <!-- 视频简介 -->
        <section class="">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold">
              视频简介
            </h2>
            <span class="text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">已加载</span>
          </div>

          <div class="space-y-3">
            <p class="whitespace-pre-wrap text-onSurface leading-relaxed dark:text-dark-onSurface">
              {{ result?.getVideo?.item?.desc }}
            </p>
          </div>

          <div class="border border-outline rounded-xl border-dashed bg-gray-50 p-4 text-sm text-onSurfaceVariant dark:border-dark-outlineVariant dark:bg-dark-surfaceContainerHigh dark:text-dark-onSurfaceVariant">
            <div v-if="result?.getVideo?.item?.url" class="flex items-start gap-2">
              <span>📎</span>
              <div>
                <div class="font-medium">
                  原始链接
                </div>
                <a :href="result.getVideo.item.url" target="_blank" class="break-all text-primary dark:text-dark-primary hover:text-primaryContainer dark:hover:text-dark-primaryContainer">
                  {{ result.getVideo.item.url }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- 评论 -->
        <Comment :video-id="vid" @submit="handleCommentSubmitted" />
        <!-- 评论区 -->
        <CommentList
          v-if="result?.getVideo?.commentThread?.id"
          :tid="result.getVideo.commentThread.id"
          :refresh-token="commentRefreshToken"
          class="mt-5"
        />
      </main>

      <!-- 相关视频 -->
      <aside class="lg:sticky lg:top-6 lg:self-start">
        <section class="border border-outlineVariant rounded-2xl bg-surfaceContainerLowest p-4 shadow-sm lg:max-h-[calc(100vh-3rem)] space-y-4 lg:overflow-y-auto dark:border-dark-outlineVariant dark:bg-dark-surfaceContainer lg:p-5">
          <div class="flex items-center justify-between">
            <div class="h-6 w-28 rounded">
              视频推荐
            </div>
            <div class="h-6 rounded-full">
              {{ result?.getVideo?.relatedVideos?.length || 0 }}
            </div>
          </div>

          <div v-if="result?.getVideo.relatedVideos.length" class="flex flex-wrap gap-3">
            <VideoCard
              v-for="video in result?.getVideo?.relatedVideos ?? []"
              :key="video.id"
              :min-width="0"
              :video="video"
              class="w-[calc(50%-1rem)] lg:w-full"
            />
          </div>
          <div v-else-if="loading" class="rounded-xl bg-gray-50 p-4 text-sm text-onSurfaceVariant dark:bg-dark-surfaceContainerHigh dark:text-dark-onSurfaceVariant">
            加载中...
          </div>
          <div v-else class="rounded-xl bg-gray-50 p-4 text-sm text-onSurfaceVariant dark:bg-dark-surfaceContainerHigh dark:text-dark-onSurfaceVariant">
            没有相关视频
          </div>
        </section>

        <!-- 所属播放列表 -->
        <VideoPlaylistList
          v-if="result?.getVideo?.playlists?.length"
          :playlists="result.getVideo.playlists"
          class="mt-4"
        />
      </aside>
    </div>
  </div>
</template>

<style scoped>
</style>
