<script setup lang="ts">
import LayoutNavMenu from './LayoutNavMenu.vue'

// const navContainer = shallowRef<HTMLElement | null>(null)

const drawerOpen = ref(false)
</script>

<template>
  <div class="relative">
    <div
      class="inset-x-0 z-49 h-12 flex items-center justify-between bg-white p-2 shadow shadow-purple-100 transition-colors duration-300 ease-in-out md:h-12 dark:bg-dark-600 dark:shadow-gray-600"
    >
      <!-- Logo & Slide Button -->
      <div class="inline-flex flex-nowrap items-center space-x-2">
        <div
          class="i-mdi-menu h-8 w-8 cursor-pointer rounded-full transition transition-colors active:scale-90 hover:bg-purple-200"
          @click="drawerOpen = true"
        />
        <RouterLink to="/" class="hidden text-black xl:inline dark:text-white hover:text-inherit">
          <Logo />
        </RouterLink>
      </div>
      <!-- Search -->
      <LayoutNavTopSearch class="absolute left-1/2 z-49 max-w-2/3 lg:max-w-150 -translate-x-1/2" />
      <!-- User Home -->
      <LayoutNavTopUserHome />
    </div>

    <!-- Drawer -->
    <Transition name="drawer">
      <div
        v-show="drawerOpen"
        class="fixed top-0 z-49 h-full w-full bg-black/50"
        @click="drawerOpen = false"
      >
        <LayoutNavMenu v-model="drawerOpen" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .drawer-enter-active,
  .drawer-leave-active {
    transition: opacity 0.3s ease;
  }
  .drawer-enter-from,
  .drawer-leave-to {
    opacity: 0;
  }
  .drawer-enter-to,
  .drawer-leave-from {
    opacity: 1;
  }
</style>
