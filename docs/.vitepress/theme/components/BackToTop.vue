<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const SHOW_THRESHOLD = 300
const visible = ref(false)
let updateFrame = 0

const updateVisibility = () => {
  if (updateFrame) return

  updateFrame = requestAnimationFrame(() => {
    updateFrame = 0
    visible.value = window.scrollY > SHOW_THRESHOLD
  })
}

const scrollToTop = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    window.scrollTo(0, 0)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility)
  if (updateFrame) cancelAnimationFrame(updateFrame)
})
</script>

<template>
  <Transition name="back-to-top">
    <button
      v-if="visible"
      class="back-to-top"
      type="button"
      aria-label="返回页面顶部"
      title="返回顶部"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5m-7 7 7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  z-index: 40;
  right: max(20px, env(safe-area-inset-right));
  bottom: max(20px, env(safe-area-inset-bottom));
  display: grid;
  width: 44px;
  height: 44px;
  padding: 0;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 4px 14px rgb(0 0 0 / 12%);
  cursor: pointer;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease;
}

.back-to-top:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.back-to-top svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top {
    transition: none;
  }
}
</style>
