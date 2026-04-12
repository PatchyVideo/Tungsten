<script lang="ts" setup>
const show = ref(false)

const buttonComp = shallowRef<HTMLElement | null>(null)
const panelEl = shallowRef<HTMLElement | null>(null)

const { x: buttonX, width: buttonWidth } = useElementBounding(buttonComp)
const { width: panelWidth } = useElementSize(panelEl)

const buttonCenterRight = computed(() => window.innerWidth - buttonX.value - buttonWidth.value / 2)
const panelRight = computed(() => Math.max(buttonCenterRight.value - panelWidth.value / 2, 6))

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
      <div v-if="show" ref="panelEl" class="absolute border border-purple-100 rounded border-solid bg-white dark:border-gray-700 dark:bg-dark" :style="{ right: `${panelRight}px` }">
        <div class="m-2">
          <slot name="dropdown" />
        </div>

        <!-- {{ buttonComp }} -->
      </div>
    </Transition>
  </div>
</template>
