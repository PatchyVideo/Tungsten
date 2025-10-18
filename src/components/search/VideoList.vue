<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

type OrderType = 'latest' | 'oldest' | 'video_latest' | 'video_oldest' | 'last_modified'

const limit = useRouteQuery('limit', 20, { transform: Number })
const page = useRouteQuery<number, number>('page', 1, { transform: Number })
const offset = computed(() => (page.value - 1) * limit.value)
const order = useRouteQuery<OrderType>('o', 'last_modified')
const qtype = ref<'tag' | 'text'>('tag')
const q = useRouteQuery('q', '')

function getQueryVariables() {
  return {
    offset: offset.value,
    limit: limit.value,
    query: q.value,
    qtype: qtype.value,
    order: order.value,
  }
}

// =============== Query ===============
const { load, loading, result } = useLazyQuery<Query>(gql`
  query ($offset: Int!, $limit: Int!, $query: String!, $qtype: String, $order: String!) {
    listVideo(para: {
      offset: $offset
      limit: $limit
      query: $query
      qtype: $qtype
      order: $order
    }) {
      count
      pageCount
      videos {
        id
        item {
          title
          coverImage
          partName
          url
        }
        clearence
        meta {
          createdAt
        }
      }
    }
  }
`, getQueryVariables(), {
  fetchPolicy: 'network-only',
  notifyOnNetworkStatusChange: true,
})

function fetchVideos() {
  load(null, getQueryVariables())
}

function updatePage(pageNum: number) {
  page.value = pageNum
  backTop()
  fetchVideos()
}

fetchVideos()

/** videolist */
const videos = computed<null[] | globalThis.schema.Video[]>(() => result.value?.listVideo.videos ?? Array.from<null>({ length: limit.value }).fill(null))

// ================ loading event ================
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
// ================ watch query change ================
watch([q, order], () => {
  page.value = 1
  fetchVideos()
})
</script>

<template>
  <div>
    <div v-if="!loading" class="text-sm text-gray-500">
      共 {{ result?.listVideo.count }} 个视频
    </div>
    <div v-if="loading">
      少女祈祷中...
    </div>
    <div class="flex flex-wrap justify-center -mx-2 md:justify-start">
      <VideoCard
        v-for="(video, index) in videos"
        :key="video ? video.id : index"
        :min-width="0"
        :video="video"
        class="m-2 w-[calc(50%-1rem)] md:w-[calc(20%-1rem)]"
      />
    </div>

    <Pagination
      :current-page="page"
      :total="Math.ceil((result?.listVideo.count || 0) / limit)"
      @update-current-page="updatePage"
    />
  </div>
</template>

<style scoped>
</style>
