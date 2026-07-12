<script setup lang="ts">
import { KAOMOJI_LIST } from '@/utils/kaomoji'

/* ====== Props & Emits ====== */
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  submitLabel?: string
  loading?: boolean
  showCancel?: boolean
  rows?: number
}>(), {
  placeholder: '写下你的评论',
  submitLabel: '发布',
  loading: false,
  showCancel: false,
  rows: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
  'cancel': []
}>()

/* ====== State & Computeds ====== */
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 计算 v-model 绑定，避免直接修改 prop
const text = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const canSubmit = computed(() => text.value.trim().length > 0 && !props.loading)

/* ====== Emoji 列表与插入辅助 ====== */
const EMOJI_RANGES: [number, number][] = [
  [0x1F600, 0x1F64F], // 😀–🙏 (80)
  [0x1F910, 0x1F92F], // 🤐–🤯 (32)
  [0x1F446, 0x1F450], // 👆–👐 (11)
  [0x1F494, 0x1F49F], // 💔–💟 (12)
  [0x1F4A2, 0x1F4AF], // 💢–💯 (14)
]
const EMOJI_LIST = EMOJI_RANGES.flatMap(([start, end]) =>
  Array.from({ length: end - start + 1 }, (_, i) => String.fromCodePoint(start + i)),
)

/** 在当前光标位置插入 emoji 并恢复光标 */
function insertEmoji(emoji: string) {
  const textarea = textareaRef.value
  if (!textarea) {
    text.value = text.value + emoji
    return
  }
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  text.value = text.value.substring(0, start) + emoji + text.value.substring(end)
  nextTick(() => {
    textarea.focus()
    const pos = start + emoji.length
    textarea.setSelectionRange(pos, pos)
  })
}
</script>

<template>
  <div>
    <textarea
      ref="textareaRef"
      v-model="text"
      class="box-border w-full resize-none overflow-y-auto b-none bg-transparent caret-onSurface outline-none transition-colors dark:text-dark-onSurface dark:caret-dark-onSurface"
      :placeholder="placeholder"
      :rows="rows"
    />

    <div class="flex items-center justify-between gap-3">
      <span class="flex items-center gap-2 text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
        <Popover placement="bottom-start">
          <div class="i-mdi-emoticon-outline m-0.5 cursor-pointer text-xl" />
          <template #dropdown>
            <div class="grid grid-cols-10 max-h-60 w-64 gap-0.5 overflow-y-auto p-2 text-lg">
              <button
                v-for="emoji in EMOJI_LIST"
                :key="emoji"
                class="cursor-pointer border-0 bg-transparent p-0.5 text-center transition-colors hover:bg-surfaceContainer dark:hover:bg-dark-surfaceContainerHigh"
                @click="insertEmoji(emoji)"
              >
                {{ emoji }}
              </button>
            </div>
          </template>
        </Popover>
        <Popover placement="bottom-start">
          <div class="i-mdi-sticker-emoji cursor-pointer text-xl" />
          <template #dropdown>
            <div class="grid grid-cols-4 max-h-48 w-90 gap-1 overflow-y-auto p-2 text-base">
              <button
                v-for="kw in KAOMOJI_LIST"
                :key="kw"
                class="cursor-pointer whitespace-nowrap border-0 rounded bg-transparent p-1 text-center transition-colors hover:bg-surfaceContainer dark:hover:bg-dark-surfaceContainerHigh"
                @click="insertEmoji(kw)"
              >
                {{ kw }}
              </button>
            </div>
          </template>
        </Popover>
        <p>请遵守 <a href="https://patchyvideo.wiki/zh/Comments" target="_blank" rel="noopener noreferrer">评论规范</a> 哟</p>
      </span>

      <div class="flex items-center gap-2">
        <button
          v-if="showCancel"
          type="button"
          class="btn btn-outline"
          @click="emit('cancel')"
        >
          取消
        </button>
        <button
          type="button"
          class="btn"
          :disabled="!canSubmit"
          @click="emit('submit')"
        >
          {{ submitLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
