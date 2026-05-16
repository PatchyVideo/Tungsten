<script setup lang="ts">
const route = useRoute('/video/[vid]')
const vid = computed(() => {
  const params = route.params
  return params.vid || ''
})

// 使用 GraphQL 查询
const { result, loading } = useQuery<Query>(gql`
    query($vid: String!){
      getVideo(para: {vid: $vid, lang: "CHS"}) {
        item {
          title
          desc
          uploadTime
          url
          repostType
          site
        }
        tags {
          languages{lang value}
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
      }
    }
`, { vid })
</script>

<template>
  <div class="mx-auto px-4 py-4 lg:px-6">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
      <main class="min-w-0 space-y-2">
        <!-- <section class="border border-gray-200 rounded-2xl bg-white p-4 shadow-sm space-y-4 dark:border-gray-700 dark:bg-dark-200 lg:p-6"> -->
        <!-- 视频播放器 -->
        <div class="aspect-video w-full overflow-hidden rounded-xl from-gray-900 via-gray-800 to-black bg-gradient-to-br shadow-inner dark:from-dark-100 dark:via-dark-200 dark:to-dark-300">
          <Player v-if="result?.getVideo?.item" class="h-full flex items-center justify-center text-sm text-gray-400" :item="result?.getVideo?.item" />
          <div v-else-if="loading" class="h-full flex items-center justify-center text-sm text-gray-400">
            加载中...
          </div>
        </div>

        <!-- 视频信息 -->
        <div class="space-y-3">
          <h1 class="text-2xl font-bold">
            {{ result?.getVideo?.item?.title }}
          </h1>
          <div class="flex flex-wrap gap-2">
            <span v-for="value in result?.getVideo.tags" :key="value.id" class="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {{ value.languages.find(lang => lang.lang === 'CHS')?.value || value.languages[0]?.value || '未知标签' }}
            </span>
          </div>
          <div class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="rounded-xl bg-gray-50 p-3 dark:bg-dark-100">
              <div class="text-gray-500 dark:text-gray-400">
                上传时间
              </div>
              <div class="mt-1 font-medium">
                {{ new Date(result?.getVideo?.item?.uploadTime || 0).toLocaleString() }}
              </div>
            </div>
            <div class="rounded-xl bg-gray-50 p-3 dark:bg-dark-100">
              <div class="text-gray-500 dark:text-gray-400">
                链接
              </div>
              <a :href="result?.getVideo?.item?.url" target="_blank" class="mt-1 block truncate text-blue-600 font-medium dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
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
            <span class="text-sm text-gray-500 dark:text-gray-400">已加载</span>
          </div>

          <div class="space-y-3">
            <p class="whitespace-pre-wrap text-gray-700 leading-relaxed dark:text-gray-300">
              {{ result?.getVideo?.item?.desc }}
            </p>
          </div>

          <div class="border border-gray-200 rounded-xl border-dashed bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-dark-100 dark:text-gray-400">
            <div v-if="result?.getVideo?.item?.url" class="flex items-start gap-2">
              <span>📎</span>
              <div>
                <div class="font-medium">
                  原始链接
                </div>
                <a :href="result.getVideo.item.url" target="_blank" class="break-all text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  {{ result.getVideo.item.url }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- 评论 -->
        <CommentList
          v-if="result?.getVideo?.commentThread?.id"
          :tid="result.getVideo.commentThread.id"
          class="mt-5"
        />
      </main>

      <!-- 相关视频 -->
      <aside class="lg:sticky lg:top-6 lg:self-start">
        <section class="border border-gray-200 rounded-2xl bg-white p-4 shadow-sm lg:max-h-[calc(100vh-3rem)] space-y-4 lg:overflow-y-auto dark:border-gray-700 dark:bg-dark-200 lg:p-5">
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
          <div v-else-if="loading" class="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-dark-100 dark:text-gray-400">
            加载中...
          </div>
          <div v-else class="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-dark-100 dark:text-gray-400">
            没有相关视频
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
</style>
