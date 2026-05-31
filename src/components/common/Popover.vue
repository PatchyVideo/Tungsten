<script lang="ts" setup>
type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

const { placement = 'bottom', gap = 4, edgePadding = 8 } = defineProps<{
  placement?: Placement
  /** 面板与按钮之间的间距 */
  gap?: number
  /** 面板与视口边缘的最小安全间距 */
  edgePadding?: number
}>()

const show = ref(false)

const buttonComp = shallowRef<HTMLElement | null>(null)
const panelEl = shallowRef<HTMLElement | null>(null)

const { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight } = useElementBounding(buttonComp)
const { width: panelWidth, height: panelHeight } = useElementSize(panelEl)

const panelStyle = computed(() => {
  const panelW = panelWidth.value || 0
  const panelH = panelHeight.value || 0

  const buttonCX = buttonX.value + buttonWidth.value / 2
  const buttonCY = buttonY.value + buttonHeight.value / 2

  let top: number
  let left: number

  switch (placement) {
    // ── Top ──────────────────────────────
    case 'top':
      top = buttonY.value - panelH - gap
      left = buttonCX - panelW / 2
      break
    case 'top-start':
      top = buttonY.value - panelH - gap
      left = buttonX.value
      break
    case 'top-end':
      top = buttonY.value - panelH - gap
      left = buttonX.value + buttonWidth.value - panelW
      break

    // ── Bottom ───────────────────────────
    case 'bottom':
      top = buttonY.value + buttonHeight.value + gap
      left = buttonCX - panelW / 2
      break
    case 'bottom-start':
      top = buttonY.value + buttonHeight.value + gap
      left = buttonX.value
      break
    case 'bottom-end':
      top = buttonY.value + buttonHeight.value + gap
      left = buttonX.value + buttonWidth.value - panelW
      break

    // ── Left ─────────────────────────────
    case 'left':
      top = buttonCY - panelH / 2
      left = buttonX.value - panelW - gap
      break
    case 'left-start':
      top = buttonY.value
      left = buttonX.value - panelW - gap
      break
    case 'left-end':
      top = buttonY.value + buttonHeight.value - panelH
      left = buttonX.value - panelW - gap
      break

    // ── Right ────────────────────────────
    case 'right':
      top = buttonCY - panelH / 2
      left = buttonX.value + buttonWidth.value + gap
      break
    case 'right-start':
      top = buttonY.value
      left = buttonX.value + buttonWidth.value + gap
      break
    case 'right-end':
      top = buttonY.value + buttonHeight.value - panelH
      left = buttonX.value + buttonWidth.value + gap
      break

    default:
      top = buttonY.value + buttonHeight.value + gap
      left = buttonCX - panelW / 2
  }

  // 限制面板不溢出视口边界（clientWidth/Height 排除滚动条）
  const viewW = document.documentElement.clientWidth
  const viewH = document.documentElement.clientHeight
  left = Math.max(edgePadding, Math.min(left, viewW - panelW - edgePadding))
  top = Math.max(edgePadding, Math.min(top, viewH - panelH - edgePadding))

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
})

useEventListener(document, 'click', (e: MouseEvent) => {
  if (!panelEl.value || !buttonComp.value)
    return

  const target = e.target as HTMLElement
  if (!panelEl.value.contains(target) && !buttonComp.value.contains(target)) {
    show.value = false
  }
})
</script>

<template>
  <div>
    <div ref="buttonComp" @click="show = !show">
      <slot />
    </div>
    <Transition
      enter-active-class="transform transition duration-100 ease-out"
      enter-from-class="scale-95 -translate-y-1/20 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transform transition duration-75 ease-out"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 -translate-y-1/20 opacity-0"
    >
      <div v-if="show" ref="panelEl" class="fixed z-40 border border-purple-100 rounded border-solid bg-white dark:border-gray-700 dark:bg-dark" :style="panelStyle">
        <div class="">
          <slot name="dropdown" />
        </div>
      </div>
    </Transition>
  </div>
</template>
