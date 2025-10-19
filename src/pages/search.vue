<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'

type OrderType = 'latest' | 'oldest' | 'video_latest' | 'video_oldest' | 'last_modified'

setSiteTitle('搜索')

// ============= current =============
const currentTab = useRouteQuery<'video' | 'playlist'>('c', 'video')
const currentTabList: { label: string, value: 'video' | 'playlist' }[] = [
  { label: '视频', value: 'video' },
  { label: '播放列表', value: 'playlist' },
]

// ============= order =============
const order = useRouteQuery<OrderType>('o', 'last_modified')
const orderSwitch = [
  { value: 'last_modified', name: '最新修改' },
  { value: 'video_oldest', name: '时间倒序' },
]
const orderSelect = ref(orderSwitch[0])
watch(orderSelect, (newVal) => {
  order.value = newVal.value as OrderType
})

// ============= site =============
const site = useRouteQuery<number>('s', 0, { transform: Number })
// const siteList: { label: string, value: string }[] = [
//   { label: '全部站点', value: '' },
//   { label: '国内网站', value: '' },
//   { label: '国外网站', value: '' },
// ]
const siteSwitch = [
  { value: 0, name: '全部站点' },
  { value: 1, name: '国内网站' },
  { value: 2, name: '国外网站' },
]
const siteSelect = ref(siteSwitch[site.value])
watch(siteSelect, (newVal) => {
  site.value = newVal.value
})
</script>

<template>
  <div class="mx-auto max-w-7xl p-t-10 dark:text-gray-400">
    <!-- 切换 -->
    <div>
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <div
          v-for="item in currentTabList" :key="item.value"
          :class="[currentTab === item.value ? 'bg-purple-400:70 dark:bg-purple-700:60 text-purple-8 dark:text-purple ' : '']"
          class="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1 transition duration-300 ease-in-out"
          @click="currentTab = item.value"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="m-y-4 flex gap-4">
      <Select v-model:selected-op="orderSelect" :ops="orderSwitch" />
      <Select v-if="currentTab === 'video'" v-model:selected-op="siteSelect" :ops="siteSwitch" />
    </div>
    <keep-alive>
      <VideoList v-if="currentTab === 'video'" :site="site" />
      <PlaylistList v-else />
    </keep-alive>
  </div>
</template>

<style scoped>
</style>
