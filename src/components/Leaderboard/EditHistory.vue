<script lang="ts" setup>
const props = defineProps<{
  page: number
  limit: number
}>()

const route = useRoute()
const router = useRouter()

const { result, fetchMore, loading, error } = useQuery<Query>(
  gql`
    query ($offset: Int!, $limit: Int!) {
      getRawTagHistory(offset: $offset, limit: $limit) {
        items {
          time
          addedTags {
            id
            category
            languages {
              lang
              value
            }
          }
          removedTags {
            id
            category
            languages {
              lang
              value
            }
          }
          user {
            id
            username
            image
            gravatar
          }
          video {
            id
            clearence
            item {
              coverImage
              title
              site
              url
              partName
            }
          }
        }
      }
    }
  `,
  {
    offset: (props.page - 1) * props.limit,
    limit: props.limit,
  },
  {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  },
)
const getRawTagHistory = computed(() => result.value?.getRawTagHistory.items || [])

function fetchMoreHistory(offset: number, limit: number) {
  fetchMore({
    variables: {
      offset,
      limit,
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult)
        return prev
      return fetchMoreResult
    },
  })
}
watch(() => [props.page, props.limit], ([newPage, newLimit]) => {
  fetchMoreHistory((newPage - 1) * newLimit, newLimit)
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
    <div v-if="loading">
      加载中
    </div>
    <div v-else-if="error">
      加载错误，原因：{{ error.message }}
    </div>
    <div v-else-if="!getRawTagHistory.length">
      暂无数据
    </div>
    <EditHistoryGrid v-for="item in getRawTagHistory" v-else :key="item.time" :item="item" />

    <Pagination
      class="mt-4"
      :current-page="page"
      :total="50"
      @update-current-page="updatePage"
    />
  </div>
</template>
