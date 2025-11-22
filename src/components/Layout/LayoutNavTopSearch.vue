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
/** 鼠标位置 */
const cursorPos = ref(0)

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
/** Computed list of popular tags, sorted by popularity and mapped for display */
const popularTags = computed(() => {
  if (!result.value)
    return []

  const tags = result.value.getPopularTags.popularTags || []

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
/** Selects a tag and inserts it into the search input at the current active position */
function selectTag(tagValue: string) {
  const before = searchContent.value.substring(0, cursorPos.value)
  const after = searchContent.value.substring(cursorPos.value)
  const parts = before.split(/\s+/)
  parts[parts.length - 1] = tagValue
  searchContent.value = parts.join(' ') + after
  activeTag.value = tagValue
  showView.value = false
  toSearch()
}

// ================ popover view change ================
const popover = ref<HTMLElement | null>(null)
/** Watcher to hide popover when clicking outside of it */
const stopClickOutsideWatcher = onClickOutside(popover, () => {
  showView.value = false
})

// ================ Key select ================
const keySelecting = ref(-1)
/** Debounced function to perform search autocompletion based on activeTag */
const debouncedSearch = useDebounceFn(() => {
  const tag = activeTag.value.trim()
  if (!tag) {
    suggestedSearchTerms.value = []
    loading.value = false
    return
  }
  loading.value = true
  searchAutocomplete(activeTag.value).then((res) => {
    suggestedSearchTerms.value = res ?? []
  }).catch((err) => {
    if (err.name === 'AbortError')
      return
    console.error(err)
  }).finally(() => {
    loading.value = false
  })
}, 200)
/**
 * Moves an index cyclically within a range (e.g., for key selection in a list)
 * @param current current The current index
 * @param delta delta The direction of movement (+1 for down, -1 for up)
 * @param length length The total length of the list
 */
function moveCyclicIndex(current: number, delta: number, length: number): number {
  if (length <= 0)
    return 0
  const newIndex = (current + delta + length) % length
  return newIndex
}

/**
 * Handles changes in the input box content, updates cursor position and active tag
 * @param el Input element
 */
function handleContentChange(el: HTMLInputElement) {
  cursorPos.value = el.selectionStart ?? 0
  const before = searchContent.value.substring(0, cursorPos.value)
  const parts = before.split(/\s+/)
  const lastPart = parts[parts.length - 1] || ''

  if (activeTag.value === lastPart)
    return

  activeTag.value = lastPart

  debouncedSearch()
}
// Functions using 'as HTMLInputElement' are only meant for the search input element
function onInput(e: Event) {
  if (!showView.value)
    return
  handleContentChange(e.target as HTMLInputElement)
}
function onCompositionEnd(e: CompositionEvent) {
  handleContentChange(e.target as HTMLInputElement)
}
function onMouseUp(e: MouseEvent) {
  if (!showView.value)
    return
  handleContentChange(e.target as HTMLInputElement)
}

/** Prevents default behavior */
function keydown(e: KeyboardEvent) {
  if (
    showView.value
    && (e.key === 'Tab'
      || e.key === 'ArrowDown'
      || e.key === 'ArrowUp')
  ) {
    e.preventDefault()
  }
}

function keyup(e: KeyboardEvent) {
  if (!showView.value)
    return
  const el = e.target as HTMLInputElement

  // close popover and reset selection
  if (e.key === 'Escape') {
    showView.value = false
    keySelecting.value = -1
    el.blur()
    return
  }

  // change text/cursor position
  if (
    e.key === 'Process'
    || e.key === 'Backspace'
    || e.key === 'ArrowLeft'
    || e.key === 'ArrowRight'
  ) {
    handleContentChange(el)
    return
  }

  // Use suggestions if available, otherwise use popular tags
  const items = suggestedSearchTerms.value.length > 0 ? suggestedSearchTerms.value : popularTags.value
  const length = items.length

  // select current highlighted item and perform search
  if (e.key === 'Enter') {
    e.preventDefault()
    showView.value = false
    if (keySelecting.value !== -1) {
      const selectedItem = items[keySelecting.value]
      const selectedValue = 'keyword' in selectedItem ? selectedItem.keyword : selectedItem.value
      selectTag(selectedValue)
    }

    keySelecting.value = -1
    el.blur()
    return
  }

  const nextIndex = () => moveCyclicIndex(keySelecting.value, 1, length)
  const prevIndex = () => moveCyclicIndex(keySelecting.value, -1, length)

  // move selection down
  if (e.key === 'ArrowDown' || e.key === 'Tab') {
    e.preventDefault()
    const i = keySelecting.value = nextIndex()
    activeTag.value = 'keyword' in items[i] ? items[i].keyword : items[i].value
    return
  }

  // move selection up
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const i = keySelecting.value = prevIndex()
    activeTag.value = 'keyword' in items[i] ? items[i].keyword : items[i].value
  }
}
// ================ Search Event ================
const router = useRouter()
const route = useRoute()

/** Navigates to the search route with the current search content */
function toSearch() {
  if (!searchContent.value.trim())
    return

  const query: { q: string, c?: string } = { q: searchContent.value }
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
      @input="onInput"
      @compositionend="onCompositionEnd"
      @focus="showView = true"
      @mouseup="onMouseUp"
      @keydown="keydown"
      @keyup="keyup"
    >
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
