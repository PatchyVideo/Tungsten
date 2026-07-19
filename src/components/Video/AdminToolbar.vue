<script setup lang="ts">
interface ClearenceOption {
  name: string
  value: string
}

const props = defineProps<{
  vid: string
  clearence: number
}>()

const emit = defineEmits<{
  refetch: []
}>()

const CLEARENCE_OPTIONS: ClearenceOption[] = [
  { name: '仅管理员可见', value: '0' },
  { name: '发布者和管理员可见', value: '1' },
  { name: '登录用户可见', value: '2' },
  { name: '所有人可见', value: '3' },
]

const selectedOp = ref<ClearenceOption>(
  CLEARENCE_OPTIONS.find(o => o.value === String(props.clearence)) ?? CLEARENCE_OPTIONS[3],
)

// 同步外部 prop 变化
watch(() => props.clearence, (val) => {
  selectedOp.value = CLEARENCE_OPTIONS.find(o => o.value === String(val)) ?? CLEARENCE_OPTIONS[3]
})

const { mutate: mutateClearence, loading: mutating } = useMutation(gql`
  mutation ($vid: String!, $clearence: Int) {
    setVideoClearence(para: { vid: $vid, clearence: $clearence })
  }
`)

const toast = useToast()

async function handleClearenceChange(option: ClearenceOption) {
  const newClearence = Number(option.value)
  if (newClearence === props.clearence)
    return

  NProgress.start()
  try {
    await mutateClearence({ vid: props.vid, clearence: newClearence })
    toast.success('视频等级已更新')
    emit('refetch')
  }
  catch (error) {
    toast.error(`等级更新失败：${error}`)
    // 回退选择到原值
    selectedOp.value = CLEARENCE_OPTIONS.find(o => o.value === String(props.clearence)) ?? CLEARENCE_OPTIONS[3]
  }
  finally {
    NProgress.done()
  }
}
</script>

<template>
  <section class="border border-outlineVariant rounded-2xl bg-surfaceContainerLowest p-3 shadow-sm dark:border-dark-outlineVariant dark:bg-dark-surfaceContainer">
    <h3 class="m-none text-base text-onSurface font-semibold dark:text-dark-onSurface">
      管理员工具
    </h3>

    <div class="space-y-3">
      <!-- 等级管理 -->
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">视频等级</span>
        <Select
          :selected-op="selectedOp"
          :ops="CLEARENCE_OPTIONS"
          :ring="false"
          :class="{ 'pointer-events-none opacity-50': mutating }"
          @update:selected-op="handleClearenceChange"
        />
      </div>

      <!-- 重新索引（TODO: 后端 API 就绪后接入） -->
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">索引</span>
        <button
          type="button"
          disabled
          class="btn"
        >
          重新索引
        </button>
      </div>
      <p class="text-xs text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
        重新索引功能暂未上线
      </p>
    </div>
  </section>
</template>
