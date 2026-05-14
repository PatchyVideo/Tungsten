<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

setSiteTitle('播放列表')

const page = computed(() => Number(pickFirstQuery(route.query.page)) || 1)
const limit = computed(() => Number(pickFirstQuery(route.query.limit)) || 20)
const order = computed(
  () => pickFirstQuery(route.query.order) || 'last_modified',
)
const URLQuery = computed(() => route.query)

const { result, fetchMore, loading } = useQuery<Query>(
  gql`
    query ($offset: Int!, $limit: Int!, $query: String!, $order: String!) {
      listPlaylist(
        para: { offset: $offset, limit: $limit, query: $query, order: $order }
      ) {
        count
        playlists {
          id
          item {
            title
            cover
            private
            count
          }
          meta {
            createdBy {
              id
              username
              image
              gravatar
            }
          }
          videos(offset: 0, limit: 6) {
            id
            meta {
              createdAt
            }
            item {
              coverImage
              title
              site
              url
            }
          }
        }
      }
    }
  `,
  {
    offset: (page.value - 1) * limit.value,
    limit: limit.value,
    query: '',
    qtype: '',
    order: order.value,
  },
  {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  },
)
const playlistCount = computed(() => result.value?.listPlaylist.count || 0)
const playlistResult = computed<null[] | globalThis.schema.Playlist[]>(() => result.value?.listPlaylist.playlists || Array.from<null>({ length: limit.value }).fill(null))

watch(URLQuery, () => {
  fetchMore({
    variables: {
      offset: (page.value - 1) * limit.value,
      limit: limit.value,
      query: '',
      qtype: '',
      order: order.value,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult)
        return prev
      return fetchMoreResult
    },
  })
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
  <div>
    <div class="mb-2 border-b border-gray-200 pb-1">
      <span>{{ `共${playlistCount}个播放列表` }}</span>
    </div>

    <div class="space-y-2">
      <PlaylistGrid
        v-for="(playlist, index) in playlistResult"
        :key="playlist ? playlist.id : index"
        :playlist-data="playlist"
      />
    </div>

    <Pagination
      :current-page="page"
      :total="Math.ceil(playlistCount / limit)"
      @update-current-page="updatePage"
    />
  </div>
</template>
