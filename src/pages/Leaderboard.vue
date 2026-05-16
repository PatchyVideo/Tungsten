<script setup lang="ts">
const route = useRoute()
const router = useRouter()

setSiteTitle('历史与贡献')

const activeTab = computed(() => Number(pickFirstQuery(route.query.activeTab)) || 0)
const date = computed(() => Number(pickFirstQuery(route.query.date)) || 0)
const page = computed(() => Number(pickFirstQuery(route.query.page)) || 1)
const limit = computed(() => Number(pickFirstQuery(route.query.limit)) || 40)

const activeTabClass = 'bg-white'
const dateRangeList = computed(() => [
  { value: `${24 * 7 * 52 * 10}`, name: '至今为止' },
  { value: `${24 * 30}`, name: '过去一个月' },
  { value: `${24 * 7}`, name: '过去一周' },
  { value: `${24}`, name: '过去一天' },
])
const selectedDateRange = ref(dateRangeList.value[date.value])
watch(selectedDateRange, (newv) => {
  updatePage('date', dateRangeList.value.findIndex(item => item.value === newv.value) || 0)
})
function updatePage(para: 'activeTab' | 'date', value: any): void {
  window.scrollTo(0, 0)
  router.push({ query: { ...route.query, [para]: value } })
}
</script>

<template>
  <div class="mt-5">
    <div class="w-full flex text-purple-600 space-x-2">
      <div class="flex flex-grow rounded-md bg-purple-100 p-1.5">
        <div class="cursor-pointer rounded-md px-4 py-0.5 md:px-6 md:py-2" :class="activeTab === 0 ? activeTabClass : ''" @click="updatePage('activeTab', 0)">
          <span class="hidden md:inline">标签贡献</span>排行榜
        </div>
        <div class="cursor-pointer rounded-md px-4 py-0.5 md:px-6 md:py-2" :class="activeTab ? activeTabClass : ''" @click="updatePage('activeTab', 1)">
          <span class="hidden md:inline">标签</span>编辑历史
        </div>
      </div>
      <div v-if="activeTab === 0" class="flex items-center rounded-md bg-purple-100 p-1.5 space-x-2">
        <Select v-model:selected-op="selectedDateRange" class="rounded-md bg-white md:px-2 md:py-1.5" :ops="dateRangeList" />
      </div>
    </div>

    <!-- Divider -->
    <div class="my-4 h-0 w-full rounded-full bg-purple-300 md:h-0.5" />

    <ContributorRank v-if="!activeTab" :date-range-number="parseInt(selectedDateRange.value)" />
    <EditHistory v-else :page="page" :limit="limit" />
  </div>
</template>
