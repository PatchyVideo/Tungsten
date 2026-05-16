<script setup lang="ts">
import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'

const layouts: Record<string, Component> = {
  default: defineAsyncComponent(() => import('./layouts/default.vue')),
  auth: defineAsyncComponent(() => import('./layouts/auth.vue')),
  message: defineAsyncComponent(() => import('./layouts/message.vue')),
}

const route = useRoute()

const currentLayout = computed(() => {
  const name = route.meta.layout
  if (name === false)
    return undefined
  return layouts[typeof name === 'string' ? name : 'default'] ?? layouts.default
})
</script>

<template>
  <component :is="currentLayout" v-if="currentLayout">
    <router-view />
  </component>
  <router-view v-else />
</template>
