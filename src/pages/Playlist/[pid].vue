<script setup lang="ts">
const route = useRoute('/Playlist/[pid]')
const pid = computed(() => route.params.pid as string)
const router = useRouter()

setSiteTitle('播放列表详情')

const page = computed(() => Number(pickFirstQuery(route.query.page)) || 1)
const limit = computed(() => Number(pickFirstQuery(route.query.limit)) || 20)

const { result, fetchMore, loading, error } = useQuery<Query>(
  gql`
    query ($pid: String!, $offset: Int!, $limit: Int!) {
      getPlaylist(para: { pid: $pid }) {
        item {
          title
          cover
          count
          desc
          private
          privateEdit
        }
        rating {
          userRating
          totalUser
        }
        commentThread {
          id
        }
        videos(offset: $offset, limit: $limit) {
          id
          item {
            title
            partName
            desc
            coverImage
            url
          }
          meta {
            createdAt
          }
        }
        meta {
          createdBy {
            id
            username
            image
            gravatar
            desc
          }
          createdAt
          modifiedAt
        }
        editable
        tags{
          __typename
          id
          tagid
          category
          languages {
            lang
            value
          }
        }
      }
    }
  `,
  {
    pid: pid.value,
    offset: (page.value - 1) * limit.value,
    limit: limit.value,
  },
)
const getPlaylist = computed(() => result.value?.getPlaylist)
watch(
  getPlaylist,
  (newVal) => {
    if (newVal) {
      setSiteTitle(newVal.item.title)
    }
  },
)
function fetchMoreVideos() {
  fetchMore({
    variables: {
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult)
        return prev
      return fetchMoreResult
    },
  })
}
watch([page, limit], () => {
  fetchMoreVideos()
})

watchEffect(() => {
  if (loading.value) {
    if (!NProgress.isStarted())
      NProgress.start()
  }
  else {
    if (NProgress.isStarted())
      NProgress.done()
  }
})

function updatePage(page: number) {
  backTop()
  router.push({ query: { ...route.query, page } })
}
</script>

<template>
  <div v-if="getPlaylist" class="space-y-5">
    <playlist-meta
      :pid="pid"
      :title="getPlaylist.item.title"
      :private="getPlaylist.item.private"
      :author="getPlaylist.meta.createdBy"
      :tags="getPlaylist.tags"
      :rating="getPlaylist.rating"
      :cover="getPlaylist.item.cover"
      :desc="getPlaylist.item.desc"
    />

    <!-- Divide -->
    <div class="w-full bg-purple-100 md:h-0.2" />

    <div class="flex flex-wrap justify-center">
      <VideoCard
        v-for="(video, index) in getPlaylist.videos" :key="video.id"
        class="m-2 w-[calc(50%-1rem)] md:w-[calc(20%-1rem)]"
        :min-width="0"
        :video="video"
        :video-index="((page - 1) * limit) + (index + 1)"
      />
    </div>

    <Pagination
      :current-page="page"
      :total="Math.ceil(getPlaylist.item.count / limit)"
      @update-current-page="updatePage"
    />

    <CommentList
      :tid="getPlaylist.commentThread?.id"
      class="mt-5"
    />
  </div>
  <div v-else-if="error">
    加载错误，原因：{{ error.message }}
  </div>
</template>
