<script lang="ts" setup>
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['updateCurrentPage'])

const toast = useToast()

const input = ref(props.currentPage)
watchEffect(() => {
  input.value = props.currentPage
})

// Calculate page numbers to display
const paginationList = computed(() => {
  // Show all page numbers when total pages <= 7
  if (props.total <= 7) {
    return Array.from({ length: props.total }, (_, i) => i + 1)
  }

  // Array of page numbers to display
  const result: (number | string)[] = []

  // Current page near the start
  if (props.currentPage < 4) {
    result.push(1, 2, 3, 4, 5, '...', props.total)
  }
  // Current page near the end
  else if (props.currentPage > props.total - 3) {
    result.push(1, '...', props.total - 4, props.total - 3, props.total - 2, props.total - 1, props.total)
  }
  // Current page in the middle
  else {
    result.push(1, '...', props.currentPage - 1, props.currentPage, props.currentPage + 1, '...', props.total)
  }

  return result
})

function handlePrevPage() {
  props.currentPage > 1 && emit('updateCurrentPage', props.currentPage - 1)
}

function handleNextPage() {
  props.currentPage < props.total && emit('updateCurrentPage', props.currentPage + 1)
}

function handleGotoPage(pageNum: number = input.value) {
  if (
    !Number.isSafeInteger(pageNum)
    || pageNum < 1
    || pageNum > props.total
  ) {
    toast.success('请输入有效的页码')
    return
  }

  if (props.currentPage !== pageNum)
    emit('updateCurrentPage', pageNum)
}
</script>

<template>
  <div class="mt-4 flex items-center justify-around gap-3 md:justify-center">
    <div class="video-pagination__item">
      <button
        class="dark:disabled:border-pu h-8 min-w-8 inline-flex cursor-pointer items-center justify-center border border-gray-300 rounded border-solid bg-white px-4 transition-all duration-300 disabled:cursor-not-allowed dark:border-gray-600 hover:border-purple-500 dark:bg-dark-200 disabled:bg-gray-50 dark:text-gray disabled:text-gray-400 hover:text-purple-500 dark:disabled:border-gray-700 dark:disabled:bg-dark-400"
        :disabled="currentPage === 1" @click="handlePrevPage"
      >
        上一页
      </button>
    </div>

    <div v-for="(pageNum, index) in paginationList" :key="index" class="video-pagination__item hidden md:block">
      <template v-if="pageNum === '...'">
        <span class="h-8 min-w-8 inline-flex items-center justify-center text-gray-500">...</span>
      </template>
      <template v-else>
        <button
          class="h-8 min-w-8 inline-flex cursor-pointer items-center justify-center border border-gray-100 rounded border-solid px-1 transition-all duration-300 hover:border-purple-500 hover:bg-purple-100 dark:hover:bg-dark-300 dark:hover:text-purple-500"
          :class="{ 'text-white  bg-purple-500 border-purple-500': pageNum === currentPage, 'bg-white dark:bg-dark-200 dark:text-gray border-gray-300 dark:border-gray-600': pageNum !== currentPage }"
          @click="handleGotoPage(pageNum as number)"
        >
          {{ pageNum }}
        </button>
      </template>
    </div>

    <div class="block md:hidden">
      Go to:
      <input v-model="input" class="h-8 w-16 appearance-none border border-gray-300 rounded border-solid px-2 text-center dark:border-gray-600 focus:border-purple-500 dark:bg-dark-200 dark:text-author focus:outline-none" type="number" name="" @blur="() => handleGotoPage()" @keyup.enter="handleGotoPage()">
      {{ `共${total}页` }}
    </div>

    <div class="video-pagination__item">
      <button
        class="dark:disabled:border-pu h-8 min-w-8 inline-flex cursor-pointer items-center justify-center border border-gray-300 rounded border-solid bg-white px-4 transition-all duration-300 disabled:cursor-not-allowed dark:border-gray-600 hover:border-purple-500 dark:bg-dark-200 disabled:bg-gray-50 dark:text-gray disabled:text-gray-400 hover:text-purple-500 dark:disabled:border-gray-700 dark:disabled:bg-dark-400"
        :disabled="currentPage === total" @click="handleNextPage"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
