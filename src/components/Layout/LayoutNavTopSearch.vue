<script setup lang="ts">
import type { AutocompleteResponse } from '@/apis/type/autocomplete'

// =============== search content, popover ================
/** 搜索内容 */
const searchContent = ref('')
/** 使用光标选择标签 */
const activeTag = ref('')
/** 是否显示 */
const showView = ref(false)
/** 显示搜索标签推荐列表 */
const suggestedSearchTerms = ref<AutocompleteResponse>([])

// =============== query ================
const { result, loading } = useQuery<Query>(
  gql`query{
      getPopularTags(para:  { }) {
        popularTags {
          popluarity
          tag {
            id
            languages {
              lang
              value
            }
          }
        }
      }
    }`,
)
/** 热门标签 */
const popularTags = computed(() => {
  const tags = result.value?.getPopularTags.popularTags || []

  return tags.slice()
    .sort((a, b) => b.popluarity - a.popluarity)
    .map((item) => {
      const chs = item.tag.languages.find(l => l.lang === 'CHS')
      const eng = item.tag.languages.find(l => l.lang === 'ENG')
      const jpn = item.tag.languages.find(l => l.lang === 'JPN')
      const other = item.tag.languages[0]
      return {
        id: item.tag.id,
        value: chs?.value || eng?.value || jpn?.value || other?.value || '未知标签',
        popularity: item.popluarity,
      }
    })
})
function selectTag(tagValue: string) {
  activeTag.value = tagValue
  showView.value = false
  toSearch()
}

// ================ popover view change ================
const popover = ref<HTMLElement | null>(null)
const stopClickOutsideWatcher = onClickOutside(popover, () => {
  showView.value = false
})

// ================ Key select ================
const keySelecting = ref(-1)
/** 鼠标位置 */
const cursorPos = ref(0)
/** 判断是否为Input元素 */
function isInputElement(el: EventTarget | null): el is HTMLInputElement {
  return el instanceof HTMLInputElement
}
/** 搜索自动补全防抖 */
const debouncedSearch = useDebounceFn(() => {
  if (!activeTag.value.trim())
    return
  searchAutocomplete(activeTag.value).then((res) => {
    suggestedSearchTerms.value = res
  })
}, 200)
/**
 * 移动循环索引
 * @param current 要修改的值
 * @param delta 移动方向
 * @param length 总长度
 */
function moveCyclicIndex(current: number, delta: number, length: number): number {
  if (length <= 0)
    return 0
  const newIndex = (current + delta + length) % length
  return newIndex
}

onkeyup = (e: KeyboardEvent) => {
  if (!showView.value)
    return

  const el = e.target
  if (!isInputElement(el))
    return

  // Esc取消选择
  if (e.key === 'Escape') {
    showView.value = false
    keySelecting.value = -1
    el.blur()
    return
  }

  // 回车选择
  if (e.key === 'Enter') {
    e.preventDefault()
    showView.value = false
    toSearch()
    keySelecting.value = -1
    el.blur()
    return
  }

  if (e.key === 'Process' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Backspace') {
    cursorPos.value = el.selectionStart ?? 0
    const before = searchContent.value.substring(0, cursorPos.value)
    const parts = before.split(/\s+/)
    activeTag.value = parts[parts.length - 1] || ''

    debouncedSearch()
  }

  const items = suggestedSearchTerms.value.length > 0 ? suggestedSearchTerms.value : popularTags.value
  const length = items.length

  const nextIndex = () => moveCyclicIndex(keySelecting.value, 1, length)
  const prevIndex = () => moveCyclicIndex(keySelecting.value, -1, length)

  // 上下键tab键选择
  if (e.key === 'ArrowDown' || e.key === 'Tab') {
    e.preventDefault()
    const i = keySelecting.value = nextIndex()
    activeTag.value = 'keyword' in items[i] ? items[i].keyword : items[i].value
    return
  }

  // 上下键选择
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const i = keySelecting.value = prevIndex()
    activeTag.value = 'keyword' in items[i] ? items[i].keyword : items[i].value
  }
}

onmouseup = (e: MouseEvent) => {
  if (!showView.value)
    return

  const el = e.target
  if (!isInputElement(el))
    return

  cursorPos.value = el.selectionStart ?? 0
  const before = searchContent.value.substring(0, cursorPos.value)
  const parts = before.split(/\s+/)
  activeTag.value = parts[parts.length - 1] || ''

  debouncedSearch()
}

// ================ input event ================

const router = useRouter()
const route = useRoute()

function toSearch() {
  if (!searchContent.value.trim())
    return

  const query: { q: string, c?: string } = {
    q: searchContent.value,
  }

  const c = route.query.c?.length ? route.query.c as string : ''

  route.query.c ? query.c = c : delete query.c

  router.push({ path: '/search', query })
}

// ================ vue  ================
onBeforeUnmount(() => {
  stopClickOutsideWatcher?.()
})
</script>

<template>
  <div
    ref="popover"
    class="h-9 w-full flex items-center justify-start rounded-lg bg-white ring ring-1 ring-purple-300 dark:bg-dark-3 dark:ring-dark dark:focus-within:ring-indigo-600"
  >
    <input
      v-model="searchContent"
      class="h-full flex-1 border-transparent rounded-lg px-2 outline-none dark:bg-dark-3 dark:text-white"
      type="text" placeholder="搜索你想看的内容"
      @focus="showView = true"
    >
    <div>{{ activeTag }}</div>
    <div v-show="searchContent" class="i-mdi:close-circle-outline mr-2 inline-block flex-shrink-0 text-gray-500" @click="searchContent = ''" />
    <button
      class="hidden h-full cursor-pointer border-transparent rounded-r-lg bg-purple-200 px-3 text-purple-900 md:inline dark:bg-dark-200 dark:text-warmGray-100"
      @click="toSearch" v-text="'搜索'"
    />

    <transition name="fade">
      <div v-show="showView" class="absolute left-0 top-11 z-10 w-full rounded-lg bg-white ring ring-1 ring-purple-300 dark:bg-dark-3 dark:ring-indigo-600/40">
        <div v-if="loading" class="p-2 text-gray-500">
          少女祈祷中...
        </div>
        <div v-else-if="suggestedSearchTerms.length > 0 && searchContent" class="p-2">
          <div
            v-for="(tag, index) in suggestedSearchTerms"
            :key="tag.id"
            class="flex cursor-pointer justify-between rounded p-1 hover:bg-gray-100 dark:hover:bg-dark-2"
            :class="{ 'bg-purple-100 dark:bg-dark-2': keySelecting === index }"
            @click="selectTag(tag.keyword)"
          >
            <!-- {{ tag.value }} (热度: {{ tag.popularity }}) -->
            <div>
              <div>{{ tag.keyword }}</div>
              <div class="text-gray-500">
                {{ tag.langs.sort((a, b) => b.l - a.l)[0].w }}
              </div>
            </div>
            <div class="text-gray-500">
              热度: {{ tag.cnt }}
            </div>
          </div>
        </div>

        <div v-else-if="popularTags.length === 0" class="p-2 text-gray-500">
          暂无热门标签
        </div>
        <div v-else class="p-2">
          <div
            v-for="(tag, index) in popularTags"
            :key="tag.id"
            class="flex cursor-pointer justify-between rounded p-1 hover:bg-gray-100 dark:hover:bg-dark-2"
            :class="{ 'bg-purple-100 dark:bg-dark-2': keySelecting === index }"
            @click="selectTag(tag.value)"
          >
            <!-- {{ tag.value }} (热度: {{ tag.popularity }}) -->
            <div>{{ tag.value }}</div>
            <div class="text-gray-500">
              热度: {{ tag.popularity }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="postcss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
