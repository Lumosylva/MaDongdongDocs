<script setup lang="ts">
import { computed } from 'vue'
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
 * 评论会话按当前路由路径（path）区分，明暗主题跟随站点外观。
 */
const route = useRoute()
const { isDark, lang } = useData()

const serverURL = computed(
  () => (import.meta.env?.VITE_WALINE_SERVER_URL ?? '') as string
)
const enabled = computed(() => serverURL.value.trim().length > 0)
const pagePath = computed(() => route.path)
</script>

<template>
  <div v-if="enabled" class="comment-slot" :data-page-path="pagePath">
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
</style>
