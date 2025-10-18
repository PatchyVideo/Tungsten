<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const page = useRouteQuery<number, number>('page', 1, { transform: Number })
const limit = useRouteQuery('limit', 20, { transform: Number })
const order = useRouteQuery<string>('o', 'last_modified')
const q = useRouteQuery('q', '')

const { result, load } = useLazyQuery<Query>(
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

function getQueryVariables() {
  return {
    offset: (page.value - 1) * limit.value,
    limit: limit.value,
    query: q.value,
    qtype: '',
    order: order.value,
  }
}

function fetchVideos() {
  load(null, getQueryVariables())
}

function updatePage(pageNum: number) {
  page.value = pageNum
  backTop()
  fetchVideos()
}

fetchVideos()

watch([q, order], () => {
  page.value = 1
  fetchVideos()
})

const playlistCount = computed(() => result.value?.listPlaylist.count || 0)
const playlistResult = computed<null[] | globalThis.schema.Playlist[]>(() => result.value?.listPlaylist.playlists || Array.from<null>({ length: limit.value }).fill(null))
</script>

<template>
  <div>
    <PlaylistGrid
      v-for="playlist in playlistResult"
      :key="playlist"
      :playlist-data="playlist"
    />
    <div>{{ playlistCount }}</div>

    <Pagination
      :current-page="page"
      :total="Math.ceil(playlistCount / limit)"
      @update-current-page="updatePage"
    />
  </div>
</template>

<style scoped>
</style>
