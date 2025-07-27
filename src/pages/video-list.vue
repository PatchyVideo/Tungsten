<script lang="ts" setup>
setSiteTitle('视频列表')
// ================ router ================
const route = useRoute()
const router = useRouter()

// ================ reactive parameters ================
interface QueryParams {
  order: 'latest' | 'oldest' | 'video_latest' | 'video_oldest' | 'last_modified'
  qtype: 'tag' | 'text'
  q: string
}
const limit = ref(Number(route.query.limit) || 20)
const page = ref(Number(route.query.page) || 1)
const offset = computed(() => (page.value - 1) * limit.value)
const order = ref<'latest' | 'oldest' | 'video_latest' | 'video_oldest' | 'last_modified'>('latest')
const qtype = ref<'tag' | 'text'>('tag')
const q = ref<string>('')

function getQueryVariables() {
  return {
    offset: offset.value,
    limit: limit.value,
    query: q.value,
    qtype: qtype.value,
    order: order.value,
  }
}

// Watch for changes in the limit and update the URL
watch(page, () => {
  router.replace({
    query: {
      ...route.query,
      page: page.value,
    },
  })
})

// ================ video request ================
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
function handleQChange(query: QueryParams) {
  page.value = 1
  order.value = query.order
  qtype.value = query.qtype
  q.value = query.q
  fetchVideos()
}
/** videolist */
const videos = computed<false[] | globalThis.schema.Video[]>(() => result.value?.listVideo.videos ?? Array.from<false>({ length: limit.value }).fill(false))

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
</script>

<template>
  <div class="mx-auto max-w-7xl dark:text-gray-400">
    <AdvancedSearch @q-change="handleQChange">
      <h1 class="m-0">
        视频列表
      </h1>
    </AdvancedSearch>
    <div class="text-sm text-gray-500">
      共 {{ result?.listVideo.count }} 个视频
    </div>
    <div class="flex flex-wrap justify-center -mx-2 md:justify-start">
      <VideoCard
        v-for="(video, index) in videos"
        :key="video ? video.id : index"
        :min-width="0"
        :video="video"
        :video-index="((page - 1) * limit) + (index + 1)"
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
