<script lang="ts" setup>
import type { LocationQueryValue } from 'vue-router'
// =============== emit ================
const emit = defineEmits<{
  (e: 'qChange', query: {
    order: string
    qtype: string
    q: string
  }): void
}>()
// ================ imports & utils ================
const route = useRoute()
const router = useRouter()
const showMore = ref(false)
const isDark = useDark({ disableTransition: false })

function toArray<T extends string>(
  val: LocationQueryValue | LocationQueryValue[],
  verify: T[],
  def: T,
): T[] {
  const list = (Array.isArray(val) ? val : val != null ? [val] : [])
    .filter((item): item is T => typeof item === 'string' && verify.includes(item as T))

  return list.length > 0 ? list : [def]
}
function normalizeStringArray(val: LocationQueryValue | LocationQueryValue[] | null | undefined): string[] {
  const list = Array.isArray(val)
    ? val
    : val != null
      ? [val]
      : []

  return list.filter((item): item is string => typeof item === 'string')
}

// ================ video sort ================
type OrderType = 'latest' | 'oldest' | 'video_latest' | 'video_oldest' | 'last_modified'
const order = ref<OrderType>('latest')
const orderList: { label: string, value: OrderType }[] = [
  { label: '索引时间正序', value: 'latest' },
  { label: '索引时间倒序', value: 'oldest' },
  { label: '原视频发布正序', value: 'video_latest' },
  { label: '原视频发布倒序', value: 'video_oldest' },
  { label: '最后修改时间顺序', value: 'last_modified' },
]

// ================ date ================
const date = ref<Date[]>([])

// ================ website ================
type SiteType = '' | 'bili' | 'nico' | 'ytb' | 'twitter' | 'acfun' | 'zcool' | 'ipfs' | 'weibo-mobile'
const site = ref<SiteType[]>([''])
const siteList: { name: string, value: SiteType }[] = [
  { name: '全部', value: '' },
  { name: 'Bilibili', value: 'bili' },
  { name: 'Nicovideo', value: 'nico' },
  { name: 'YouTube', value: 'ytb' },
  { name: 'Twitter', value: 'twitter' },
  { name: 'Acfun', value: 'acfun' },
  { name: '微博', value: 'weibo-mobile' },
  { name: '站酷', value: 'zcool' },
  { name: 'IPFS', value: 'ipfs' },
]

function siteSelected(value: SiteType) {
  // reset
  if (!value)
    return site.value = ['']
  site.value = site.value.filter(item => item !== '')

  // select
  if (site.value.length === 1 && site.value[0] === value)
    return site.value = ['']
  if (site.value.includes(value))
    return site.value = site.value.filter(item => item !== value)

  site.value.push(value)

  if (site.value.length === siteList.length - 1)
    return site.value = ['']
}

// ================ search type ================
const qtype = ref<'tag' | 'text'>('tag')
const qtypeList: { name: string, value: 'tag' | 'text' }[] = [
  { name: '标签/文本模式', value: 'tag' },
  { name: '仅文本模式', value: 'text' },
]

// ================ search ================
const includeKeywords = ref<string[]>([])
const excludeKeywords = ref<string[]>([])

// ================ tag num ================
const tagNum = ref(0)
const tagSwitch = [
  { value: 0, name: '不启用', con: '' },
  { value: 1, name: '大于', con: '>' },
  { value: 2, name: '等于', con: '=' },
  { value: 3, name: '小于', con: '<' },
]
const tagSelect = ref(tagSwitch[0])

// ================ onlyShowAutotagedVideos  ================
const onlyShowAutotagedVideos = ref(false)

// ================ apply filter ================
function applyFilters(r: boolean = true) {
  const ikey = includeKeywords.value.length ? ` ${includeKeywords.value.join(' ')}` : ''
  const ekey = excludeKeywords.value.length ? ` NOT ${excludeKeywords.value.join(' NOT ')}` : ''
  const siteStr = !site.value.includes('') ? ` ANY(site:${site.value.join(' site:')})` : ''
  const dateStr = date.value.length ? ` date:>=${date.value[0].toISOString().split('T')[0]} date:<=${date.value[1].toISOString().split('T')[0]}` : ''
  const tagStr = tagSelect.value.value ? ` tags:${tagSelect.value.con}${tagNum.value}` : ''
  const onlyShowAutotagedVideosStr = onlyShowAutotagedVideos.value ? ' Auto_tagged' : ''
  const q = ikey + ekey + siteStr + dateStr + tagStr + onlyShowAutotagedVideosStr
  emit('qChange', {
    order: order.value,
    qtype: qtype.value,
    q,
  })

  if (!r)
    return

  router.replace({
    query: {
      ...route.query,
      order: order.value,
      date: date.value.map(d => d.toISOString()),
      site: site.value,
      qtype: qtype.value,
      ik: includeKeywords.value,
      ek: excludeKeywords.value,
      tagNum: tagNum.value,
      tagSelect: tagSelect.value.value,
      o: onlyShowAutotagedVideos.value ? '1' : '0',
    },
  })
}
// ================ init ================
function init() {
  // set default values
  order.value = (route.query.order as OrderType) || 'latest'
  date.value = (route.query.date as string[])?.map(item => new Date(item)) || []
  site.value = toArray<SiteType>(route.query.site, siteList.map(item => item.value), '')
  qtype.value = (route.query.qtype as any) || 'tag'
  includeKeywords.value = normalizeStringArray(route.query.ik)
  excludeKeywords.value = normalizeStringArray(route.query.ek)
  tagNum.value = Number(route.query.tagNum) || 0
  tagSelect.value = tagSwitch.find(item => item.value === Number(route.query.tagSelect)) || tagSwitch[0]
  onlyShowAutotagedVideos.value = (route.query.o as string) === '1'

  applyFilters(false)
}

function resetFilters() {
  order.value = 'latest'
  date.value = []
  site.value = ['']
  qtype.value = 'tag'
  includeKeywords.value = []
  excludeKeywords.value = []
  tagNum.value = 0
  tagSelect.value = tagSwitch[0]
  onlyShowAutotagedVideos.value = false
}

init()
</script>

<template>
  <div class="p-b-4">
    <!-- External Display -->
    <div class="m-y-6 flex items-end justify-between">
      <!-- slots -->
      <slot />
      <!-- More Filters -->
      <div
        class="cursor-pointer select-none border border-gray-300:30 rounded-lg border-solid px-2 py-1"
        @click="showMore = !showMore"
      >
        {{ showMore ? '收起筛选' : '更多筛选' }}
      </div>
    </div>

    <!-- Collapsible Content -->
    <div class="grid transition-all duration-300 ease-in-out" :style="{ gridTemplateRows: showMore ? '1fr' : '0fr' }">
      <div class="flex flex-col gap-2 overflow-hidden">
        <!-- Sort Order -->
        <div class="flex flex-1 flex-wrap items-center gap-2">
          <div
            v-for="item in orderList" :key="item.value"
            :class="[order === item.value ? 'bg-purple-400:70 dark:bg-purple-700:60 text-purple-8 dark:text-purple ' : '']"
            class="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1 transition duration-300 ease-in-out"
            @click="order = item.value"
          >
            {{ item.label }}
          </div>
        </div>
        <!-- Time Range -->
        <div class="">
          <VueDatePicker
            v-model="date"
            range
            locale="zh-CN"
            placeholder="选择日期范围"
            :dark="isDark"
          />
        </div>
        <!-- Source Websites -->
        <div class="flex flex-wrap items-center gap-2">
          <div
            v-for="item in siteList" :key="item.value"
            :class="[site.includes(item.value) ? 'bg-purple-400:70 dark:bg-purple-700:60 text-purple-8 dark:text-purple ' : '']"
            class="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1 transition duration-300 ease-in-out"
            @click="siteSelected(item.value)"
          >
            {{ item.name }}
          </div>
        </div>

        <!-- Search Type -->
        <div class="flex items-center gap-2">
          <div
            v-for="item in qtypeList" :key="item.value"
            :class="[qtype === item.value ? 'bg-purple-400:70 dark:bg-purple-700:60 text-purple-8 dark:text-purple ' : '']"
            class="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1 transition duration-300 ease-in-out"
            @click="qtype = item.value"
          >
            {{ item.name }}
          </div>
        </div>

        <!-- Include Keywords -->
        <div>
          <div class="m-b-1 dark:text-gray-300">
            包含关键词：
          </div>
          <P-InputTag v-model="includeKeywords" :disabled="false" />
        </div>
        <!-- Exclude Keywords -->
        <div>
          <div class="m-b-1 dark:text-gray-300">
            排除的标签：
          </div>
          <P-InputTag v-model="excludeKeywords" :disabled="false" />
        </div>

        <!-- Tag count -->
        <div class="flex flex-col items-start gap-2">
          <div class="m-b-1 dark:text-gray-300">
            标签数量:
            <Select v-model:selected-op="tagSelect" class="rounded-md md:px-2 md:py-1.5" :ops="tagSwitch" />
          </div>
          <div class="mx-1 rounded p-1 ring-1 ring-purple:20 transition duration-300 ease-in-out focus-within:bg-purple:10 hover:bg-purple:10 focus-within:ring-purple">
            <P-InputNumber
              v-model="tagNum"
              :min="0"
              :max="15"
              :step="1"
            />
          </div>
        </div>
        <!-- TODO: Add option to show only videos pending manual tag review -->
        <div class="flex items-center gap-2">
          <div class="m-b-1 dark:text-gray-300">
            仅展示待人工整理标签的视频:
          </div>
          <HSwitch
            v-model="onlyShowAutotagedVideos"
            :class="onlyShowAutotagedVideos ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'"
            class="relative h-6 w-11 inline-flex items-center rounded-full border-none p-0 transition"
          >
            <span
              :class="onlyShowAutotagedVideos ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            />
          </HSwitch>
        </div>

        <div class="flex gap-2 p-x-1 p-y-2">
          <button
            class="btn"
            @click="applyFilters()"
          >
            确认筛选
          </button>

          <button
            class="btn"
            @click="resetFilters()"
          >
            重置筛选
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
