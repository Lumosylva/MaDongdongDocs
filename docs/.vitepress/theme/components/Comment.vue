<script setup lang="ts">
import { useRoute } from 'vitepress'

/**
 * 评论区占位组件（v1 不渲染）。
 *
 * 二期接入 Waline 时：
 * 1. 安装 @waline/client 及其样式；
 * 2. 在此挂载 Waline 组件，serverURL 指向自有服务器部署的 Waline 后端；
 * 3. 用下方 pagePath / pageTitle 定位当前页评论会话。
 */
const route = useRoute()

const pagePath = route.path
const pageTitle = (route.data?.title as string | undefined) ?? ''
</script>

<template>
  <!-- v1：评论区留空，不输出任何占位可见元素 -->
  <div class="comment-slot" :data-page-path="pagePath" :data-page-title="pageTitle" />
</template>

<style scoped>
.comment-slot {
  display: none;
}
</style>
