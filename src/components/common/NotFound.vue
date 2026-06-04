<script lang="ts" setup>
const props = withDefaults(defineProps<{
  message?: string
  backPath?: string
}>(), {
  message: '内容不存在或已被删除',
  backPath: '/',
})

const router = useRouter()
const countdown = ref(3)
let timer: ReturnType<typeof setInterval> | undefined

function goBack() {
  if (timer) {
    clearInterval(timer)
    timer = undefined
  }
  if (window.history.length > 1) {
    router.back()
  }
  else {
    router.replace(props.backPath)
  }
}

function startCountdown() {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      timer = undefined
      goBack()
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-32">
    <div class="i-mdi:emoticon-sad-outline text-6xl text-gray-300 dark:text-gray-600" />
    <h2 class="mt-4 text-2xl text-gray-700 font-bold dark:text-gray-300">
      404
    </h2>
    <p class="mt-2 text-gray-500 dark:text-gray-400">
      {{ message }}
    </p>
    <p class="mt-1 text-sm text-gray-400 dark:text-gray-500">
      {{ countdown > 0 ? `${countdown} 秒后自动返回...` : '正在返回...' }}
    </p>
    <button
      class="btn"
      @click="goBack"
    >
      立即返回
    </button>
  </div>
</template>

<style scoped>
</style>
