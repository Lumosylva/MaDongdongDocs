<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useRoute, useData } from 'vitepress'
import { Waline } from '@waline/client/component'
import '@waline/client/style'

/**
 * 评论区组件（Waline）。
 *
 * 接入方式：
 * 1. 部署 Waline 后端（自有服务器 / Vercel / 其他托管，配套 LeanCloud、MySQL、MongoDB 等数据库）；
 * 2. 在 `docs/.env.local` 中配置后端地址：`VITE_WALINE_SERVER_URL=https://你的-waline-后端`；
 * 3. 未配置该地址时，本组件不渲染任何评论区，避免访问空后端。
 *
 * 评论会话按当前路由路径（path）区分，明暗主题跟随站点语言。
 */
const route = useRoute()
const { isDark, lang } = useData()

const serverURL = computed(
  () => (import.meta.env?.VITE_WALINE_SERVER_URL ?? '') as string
)
const enabled = computed(() => serverURL.value.trim().length > 0)
const pagePath = computed(() => route.path)

/**
 * IME 组合输入期间冻结编辑框尺寸，避免 autosize 对临时拼音/候选内容测量时
 * 产生不稳定布局。compositionend 后保持冻结到下一帧，等最终 input 完成后重算。
 * 页面级滚动跳动的根因是 autosize 改写 html.style 触发 Mermaid 重绘，已在
 * VitePress 配置中将 Mermaid 观察范围限制为根节点的主题 class。
 */
const slotRef = ref<HTMLElement | null>(null)
let editorEl: HTMLTextAreaElement | null = null
let detach: (() => void) | null = null
let observer: MutationObserver | null = null

const unbindEditor = () => {
  detach?.()
  detach = null
  editorEl = null
}

const bindEditor = (el: HTMLTextAreaElement) => {
  if (el === editorEl) return
  unbindEditor()
  editorEl = el
  let pendingResizeFrame: number | null = null
  let compositionVersion = 0

  const onCompositionStart = () => {
    compositionVersion += 1
    if (pendingResizeFrame !== null) {
      cancelAnimationFrame(pendingResizeFrame)
      pendingResizeFrame = null
    }
    el.style.setProperty('--wl-freeze-h', `${el.offsetHeight}px`)
    el.classList.add('is-composing')
  }
  const onCompositionEnd = () => {
    const version = ++compositionVersion
    if (pendingResizeFrame !== null) {
      cancelAnimationFrame(pendingResizeFrame)
    }
    pendingResizeFrame = requestAnimationFrame(() => {
      pendingResizeFrame = null
      if (version !== compositionVersion) return

      el.dispatchEvent(new Event('autosize:update'))
      el.classList.remove('is-composing')
      el.style.removeProperty('--wl-freeze-h')
    })
  }

  el.addEventListener('compositionstart', onCompositionStart)
  el.addEventListener('compositionend', onCompositionEnd)
  detach = () => {
    compositionVersion += 1
    if (pendingResizeFrame !== null) {
      cancelAnimationFrame(pendingResizeFrame)
      pendingResizeFrame = null
    }
    el.removeEventListener('compositionstart', onCompositionStart)
    el.removeEventListener('compositionend', onCompositionEnd)
    el.classList.remove('is-composing')
    el.style.removeProperty('--wl-freeze-h')
  }
}

const scanEditor = () => {
  const el = slotRef.value?.querySelector<HTMLTextAreaElement>('.wl-editor')
  if (el) bindEditor(el)
}

onMounted(async () => {
  await nextTick()
  scanEditor()
  // 回复/编辑切换时输入框可能被重建，用观察器重新绑定。
  observer = new MutationObserver(scanEditor)
  if (slotRef.value) {
    observer.observe(slotRef.value, { childList: true, subtree: true })
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  unbindEditor()
})
</script>

<template>
  <div v-if="enabled" ref="slotRef" class="comment-slot" :data-page-path="pagePath">
    <Waline :serverURL="serverURL" :path="pagePath" :dark="isDark" :lang="lang" />
  </div>
</template>

<style scoped>
.comment-slot {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-divider-color);
}

/*
 * Waline 输入框由 autosize 逐键内联调整高度。
 * Waline 默认样式是 `transition: all .25s ease`，高度一旦参与过渡，
 * autosize 在动画过程中读到滞后的 scrollHeight/height，会造成高度来回
 * 震荡（输入框抖动/闪动）。这里把过渡收窄为只保留聚焦背景色，排除高度动画。
 */
:deep(.wl-editor),
:deep(.wl-input) {
  transition: background-color .25s ease;
}

/*
 * 组词（IME composition）期间锁定高度：`!important` 盖过 autosize 写入的
 * 内联高度，避免临时候选词导致高度来回跳动；组词结束后由 autosize:update 重算。
 */
:deep(.wl-editor.is-composing) {
  height: var(--wl-freeze-h, auto) !important;
  overflow-y: auto;
  resize: none;
}
</style>
