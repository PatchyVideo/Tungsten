<script setup lang="ts">
import type { NavLinkItem } from '@/components/Layout/types.ts'
import DarkModeSwitch from './DarkModeSwitch.vue'

const drawerOpen = defineModel({
  type: Boolean,
  required: true,
})

const linkList = computed(() => {
  const links: NavLinkItem[] = [
    {
      type: 'title',
      name: '导航',
      noCloose: true,
    },
    {
      name: '主页',
      icon: 'i-mdi-home',
      type: 'router',
      to: '/',
    },
    {
      name: '视频',
      icon: 'i-mdi-video',
      type: 'router',
      to: '/video-list',
    },
    {
      name: '播放列表',
      icon: 'i-mdi-format-list-text',
      type: 'router',
      to: '/playlist-list',
    },
    {
      name: '讨论板',
      icon: 'i-mdi:message-minus-outline',
      type: 'router',
      to: '/video',
    },
    {
      name: '用户排行榜',
      icon: 'i-mdi:format-list-numbered',
      type: 'router',
      to: '/leaderboard',
    },
    {
      name: '网站维基',
      icon: 'i-mdi:wikipedia',
      type: 'a',
      url: 'https://patchyvideo.wiki/',
    },
    {
      type: 'title',
      name: '设置',
      noCloose: true,
    },
    {
      type: 'components',
      name: '暗夜模式',
      icon: 'i-mdi-theme-light-dark',
      component: DarkModeSwitch,
      noCloose: true,
    },
  ]

  return links
})
</script>

<template>
  <!-- Menu -->
  <div
    class="h-full w-50 flex flex-col overflow-y-auto bg-surface px-2 text-onSurface shadow-lg transition-colors duration-300 ease-in-out dark:bg-dark-surfaceContainer dark:text-dark-onSurface"
    @click="e => e.stopPropagation()"
  >
    <div class="h-16 w-50 flex items-center">
      <div
        class="i-mdi-close h-8 w-8 cursor-pointer rounded-full active:scale-90 hover:bg-purple-200"
        @click="drawerOpen = false"
      />
    </div>
    <!-- LinkGroup -->
    <LayoutNavTopLink
      v-for="(item, i) in linkList"
      :key="item.name"
      :index="1 + i"
      :drawer-open="drawerOpen"
      :data="item"
      @click="!item.noCloose && (drawerOpen = false)"
    />
  </div>
</template>
