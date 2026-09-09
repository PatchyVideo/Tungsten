<script lang="ts" setup>
import type { RatingStars } from '@/apis/type/rate'
import { ratePlaylist, rateVideo } from '@/apis/userAuthManager'

interface video {
  vid: string
  pid?: never
  rating: schema.Rating | null
}
interface playlist {
  pid: string
  vid?: never
  rating: schema.Rating | null
}
const props = defineProps<video | playlist>()

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

const showRankDialog = ref(false)

const myScore = ref<RatingStars>(0)

function openRank() {
  myScore.value = 0
  showRankDialog.value = true
}

async function submitRating() {
  if (!myScore.value)
    return

  showRankDialog.value = false

  // vid 与 pid 互斥，按当前评分目标选择对应接口
  const rank = props.vid !== undefined
    ? await rateVideo(props.vid, myScore.value)
    : await ratePlaylist(props.pid, myScore.value)
  if (!rank.ok) {
    useToast().error(`评分失败${rank.error.message}`)
    return
  }

  useToast().success('评分成功')
}
</script>

<template>
  <div>
    <div v-if="!rating || !rating.totalUser" class="cursor-pointer text-sm text-onSurfaceVariant dark:text-dark-onSurfaceVariant" @click="openRank()">
      暂无评分，点击打分
    </div>
    <div v-else class="flex cursor-pointer items-center gap-3" @click="openRank()">
      <div class="text-lg text-onSurface font-bold dark:text-dark-onSurface">
        {{ (average).toFixed(1) }} 分
      </div>
      <div class="flex flex-col items-center gap-0.5">
        <div class="flex items-center gap-0.5">
          <div
            v-for="i in stars.full"
            :key="`full-${i}`"
            class="i-mdi-star text-amber-400 dark:text-amber-300"
          />
          <div
            v-for="i in stars.half"
            :key="`half-${i}`"
            class="i-mdi-star-half-full text-amber-400 dark:text-amber-300"
          />
          <div
            v-for="i in stars.empty"
            :key="`empty-${i}`"
            class="i-mdi-star-outline text-gray-300 dark:text-gray-600"
          />
        </div>
        <div class="text-xs text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
          {{ rating.totalUser }}人评分
        </div>
      </div>
      <slot />
    </div>

    <!-- 评分界面 -->
    <HDialog :open="showRankDialog" class="relative z-50" @close="showRankDialog = false">
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <HDialogPanel class="max-w-xl rounded-2xl bg-surfaceContainerLowest p-6 shadow-xl dark:bg-dark-surfaceContainer">
          <HDialogTitle class="text-lg text-onSurface font-semibold dark:text-dark-onSurface">
            评分
          </HDialogTitle>

          <div class="mt-5 flex items-center justify-center gap-1">
            <div v-for="i in (10)" :key="i" class="cursor-pointer" @click="myScore = (i as RatingStars)">
              <div v-if="i <= myScore" class="i-mdi-star text-8 text-amber-400 dark:text-amber-300" />
              <div v-else class="i-mdi-star-outline text-8 text-gray-300 dark:text-gray-600" />
            </div>
          </div>

          <div class="mt-2 text-center text-xl text-onSurfaceVariant dark:text-dark-onSurfaceVariant">
            {{ `${myScore} 分` }}
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button class="btn-outline btn" @click="showRankDialog = false">
              取消
            </button>
            <button class="btn" :disabled="!myScore" @click="submitRating">
              提交
            </button>
          </div>
        </HDialogPanel>
      </div>
    </HDialog>
  </div>
</template>
