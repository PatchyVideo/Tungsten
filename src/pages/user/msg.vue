<script lang="ts" setup>
setSiteTitle('消息中心')

type noteType = 'all' | 'forum_reply' | 'comment_reply' | 'system_message' | 'dm' | 'post_result'

const currentType = ref<noteType>('all')

const noteTypeMap: Record<noteType, { text: string, icon: string }> = {
  all: { text: '全部消息', icon: 'i-mdi:telegram' },
  forum_reply: { text: '论坛回复', icon: 'i-mdi:reply' },
  comment_reply: { text: '艾特我', icon: 'i-mdi:at' },
  system_message: { text: '系统通知', icon: 'i-mdi:bell' },
  dm: { text: '私信', icon: 'i-mdi:message' },
  post_result: { text: '投稿结果', icon: 'i-mdi:check' },
}

const { result, loading, refetch } = useQuery<Query>(gql`
  query ($noteType: String!) {
    listNotifications(para: {
      offset: 0
      limit: 20
      listAll: true
      noteType: $noteType
    }) {
      count
      notes {
        __typename
        id
        time
        read
        type
        ... on ReplyNotificationObject {
          content
          cid
          repliedType
          repliedObj
          repliedBy {
            username
            image
          }
        }
      }
    }
  }
`, {
  noteType: 'comment_reply',
})

const unRead = useQuery<Query>(gql`
  query {
    listNotifications(para: {
      noteType: "all"
    }) {
      notes {
        id
        read
        type
      }
    }
  }
`)

const unReadCount = computed(() => {
  return unRead.result.value?.listNotifications.notes.filter(note => !note.read)
})

const notes = computed(() => result.value?.listNotifications.notes ?? [])

watch(currentType, (newType) => {
  refetch({ noteType: newType })
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

onUnmounted(() => {
  if (NProgress.isStarted())
    NProgress.done()
})
</script>

<template>
  <div class="mx-auto max-w-7xl flex flex-col gap-2 md:mt-10 md:flex-row">
    <div class="md:w-1/6">
      <h2 class="hidden items-center gap-2 text-2xl font-bold md:flex">
        <div class="i-mdi:telegram" />
        消息中心
      </h2>

      <ul class="mt-4 w-full flex gap-2 overflow-x-auto scroll-smooth whitespace-nowrap pl-0 md:flex-col md:flex-col md:overflow-visible">
        <li
          v-for="(item, type) in noteTypeMap" :key="type"
          class="relative h-6 flex cursor-pointer items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-dark-200"
          @click="currentType = type"
        >
          <div :class="item.icon" /> {{ item.text }}
          <span
            v-show="unReadCount?.filter(note => note.type === type).length"
            class="rounded-full bg-red-500 px-1.5 py-0.1 text-2 text-white md:text-xs"
          >
            {{ unReadCount?.filter(note => note.type === type).length }}
          </span>
        </li>
      </ul>
    </div>
    <div class="flex-1">
      <div class="mb-4 flex items-center justify-between">
        <span>{{ noteTypeMap[currentType].text }}</span>
        <span>共 {{ notes.length }} 条消息</span>
      </div>
      <hr>
      <div class="h-xl min-h-lg">
        <div v-if="notes.length" class="flex flex-col gap-1">
          <div v-for="note in notes" :key="note.id">
            <ReplyNotification v-if="note.__typename === 'ReplyNotificationObject'" :note="note" />
            <SystemNotification v-else-if="note.__typename === 'SystemNotificationObject'" :note="note" />
            <BaseNotification v-else :note="note" />
          </div>
        </div>
        <div v-else-if="loading" class="p-10 text-center">
          少女祈祷中(~▽~")...
        </div>
        <div v-else class="p-10 text-center">
          还没有消息哦╮(╯-╰)╭
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
