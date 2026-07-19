<script lang="ts" setup>
const props = defineProps<{
  rating: schema.Rating | null
}>()

// 计算平均分（10 分制）
const average = computed(() => {
  if (!props.rating || !props.rating.totalUser)
    return 0
  return props.rating.totalRating / props.rating.totalUser
})

const stars = computed(() => {
  const roundedStars = Math.round(average.value - 0.1) / 2

  const full = Math.floor(roundedStars)
  const half = roundedStars % 1 !== 0 ? 1 : 0
  const empty = 5 - full - half

  return { full, half, empty }
})
</script>

<template>
  <div>
    <div v-if="!rating || !rating.totalUser" class="text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
      暂无评分
    </div>
    <div v-else class="flex items-center gap-3">
      <div class="text-lg text-onSurface font-bold dark:text-dark-onSurface">
        {{ (average).toFixed(1) }} 分
      </div>
      <div class="flex flex-col items-center gap-0.5">
        <div class="flex items-center gap-0.5">
          <template v-for="i in stars.full" :key="`full-${i}`">
            <div class="i-mdi-star text-amber-400 dark:text-amber-300" />
          </template>
          <template v-for="i in stars.half" :key="`half-${i}`">
            <div class="i-mdi-star-half-full text-amber-400 dark:text-amber-300" />
          </template>
          <template v-for="i in stars.empty" :key="`empty-${i}`">
            <div class="i-mdi-star-outline text-gray-300 dark:text-gray-600" />
          </template>
        </div>
        <div class="text-xs text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
          {{ rating.totalUser }}人评分{{ stars }}
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>
