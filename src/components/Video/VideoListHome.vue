<script setup lang="ts">
const config = computed(() => ({
  query: '',
  order: 'latest',
  additionalConstraint: '',
  limit: 10,
}))
const { result, loading, error } = useQuery<Query>(gql`
    query ($limit: Int!, $query: String!, $order: String!, $additionalConstraint: String) {
      listVideo(
        para: {
          offset: 0
          limit: $limit
          humanReadableTag: true
          query: $query
          order: $order
          additionalConstraint: $additionalConstraint
        }
      ) {
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
  `, {
  query: config.value.query,
  order: config.value.order,
  additionalConstraint: config.value.additionalConstraint,
  limit: config.value.limit,
})

const videoResult = computed(() => result.value?.listVideo.videos || Array.from({ length: 10 }).fill(false))
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

onUnmounted(() => {
  if (NProgress.isStarted())
    NProgress.done()
})
</script>

<template>
  <h2 class="mb-0 border-purple-100 border-b-solid dark:border-gray-600 dark:text-light-800">
    最新上传
  </h2>
  <div v-if="error">
    <p>错误: {{ error.message }}</p>
  </div>
  <div v-else class="flex flex-wrap -mx-2">
    <VideoCard v-for="item in videoResult" :key="item" :video="item" class="m-2 w-[calc(50%-1rem)] md:w-[calc(20%-1rem)]" :min-width="0" />
  </div>
</template>

<style lang="scss" scoped></style>
