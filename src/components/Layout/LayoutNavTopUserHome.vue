<script setup lang="ts">
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { auth } = storeToRefs(userStore)

const route = useRoute()

const uid = computed(() => auth.value?.profile.uid)

function logout() {
  userStore.logout()
}

// ===========  Get the message count of a user ===========

const messageStore = useQuery<Query>(gql`
  query{
    listNotifications(para: {
      offset: 0
      limit: 0
      noteType: "all"
    }) {
      count
      notes {
        __typename
        id
        time
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
`)

const count = computed(() => messageStore.result.value?.listNotifications?.count ?? 0)
const notes = computed(() => messageStore.result.value?.listNotifications?.notes ?? [])
</script>

<template>
  <div v-if="!auth">
    <RouterLink to="/auth/login" class="text-base no-underline">
      登录
    </RouterLink>
  </div>
  <div v-else class="z-49 flex items-center space-x-4">
    <!-- Massage -->
    <Popover v-if="route.path !== '/user/msg'" trigger="click" class="hidden sm:block">
      <div class="relative inline-block w-fit">
        <div class="i-mdi:email-outline text-3xl text-coolgray" />
        <span v-show="count" class="absolute rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white -right-3 -top-3">
          {{ count }}
        </span>
      </div>

      <template #dropdown>
        <div class="min-w-80 whitespace-nowrap p-y-1">
          <h4 class="m-b-2 m-t-0">
            消息和通知
          </h4>
          <div v-for="note in notes" :key="note.id" class="mb-2">
            <ReplyNotification v-if="note.__typename === 'ReplyNotificationObject'" :note="note" />
            <SystemNotification v-else-if="note.__typename === 'SystemNotificationObject'" :note="note" />
            <BaseNotification v-else :note="note" />
          </div>
        </div>
        <div class="border border-t-solid">
          <RouterLink
            to="/user/msg"
            class="block p-x-2 p-y-1 text-base no-underline"
          >
            查看所有消息
          </RouterLink>
        </div>
      </template>
    </Popover>
    <!-- Home -->
    <Popover trigger="click">
      <Avatar
        :image="auth.profile.image"
        class="h-9 w-9 rounded-full ring ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700"
      />
      <template #dropdown>
        <div class="flex items-center space-x-4">
          <Avatar
            :image="auth.profile.image"
            class="h-16 w-16 rounded-full ring ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700"
          />
          <div class="w-auto whitespace-nowrap">
            <div class="dark:text-gray-200">
              {{ auth.profile.username }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ auth.profile.email }}
            </div>
          </div>
        </div>
        <RouterLink :to="`/user/${uid}`" class="text-base no-underline">
          <div
            class="w-auto whitespace-nowrap border-b b-b-blue border-solid border-l-none border-r-none border-t-none p-2"
          >
            个人中心
          </div>
        </RouterLink>

        <RouterLink
          to="/user/msg"
          class="block text-base no-underline sm:hidden"
        >
          <div
            class="w-auto whitespace-nowrap border-b b-b-blue border-solid border-l-none border-r-none border-t-none p-2"
          >
            消息列表
          </div>
        </RouterLink>

        <a class="cursor-pointer text-base no-underline" @click="logout">
          <div
            class="w-auto whitespace-nowrap border-b b-b-blue border-solid border-l-none border-r-none border-t-none p-2"
          >
            退出登录
          </div>
        </a>
      </template>
    </Popover>
  </div>
</template>

<style lang="postcss" scoped></style>
