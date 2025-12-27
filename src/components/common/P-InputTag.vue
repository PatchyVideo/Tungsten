<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  placeholder: String,
  disabled: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const input = ref('')
const tags = computed({
  get() { return props.modelValue },
  set(value) { emit('update:modelValue', value) },
})

function addTag() {
  if (input.value.trim() && !tags.value.includes(input.value.trim())) {
    tags.value.push(input.value.trim())
    input.value = ''
  }
}
function removeTag(idx: number) {
  tags.value.splice(idx, 1)
}
</script>

<template>
  <div class="mx-1 flex flex-wrap items-center gap-1 rounded p-1 ring-1 ring-purple:20 transition duration-300 ease-in-out focus-within:bg-purple:10 hover:bg-purple:10 focus-within:ring-purple">
    <span
      v-for="(tag, idx) in tags"
      :key="idx"
      class="flex items-center rounded bg-copyright:30 px-2 py-0.5 text-sm dark:text-gray-2:70"
    >
      {{ tag }}
      <button
        class="i-mdi-close ml-1 rounded-full text-xs text-gray-500 hover:text-red-500"
        type="button"
        @click="removeTag(idx)"
      />
    </span>
    <input
      v-model="input"
      :placeholder="placeholder"
      :disabled="disabled"
      class="flex-1 border-none bg-transparent py-0.5 text-base outline-none dark:text-gray:50 placeholder:text-gray-500"
      @keydown.delete="input.length === 0 && tags.length > 0 && removeTag(tags.length - 1)"
      @keydown.space.prevent="addTag"
      @keydown.enter="addTag"
      @blur="addTag"
    >
  </div>
</template>
