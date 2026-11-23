<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import posts from 'virtual:recent-posts'

const route = useRoute()
const isEn = computed(() => route.path.startsWith('/en'))

const scoped = computed(() => posts.filter((p: any) => p.lang === (isEn.value ? 'en' : 'zh')))
const total = computed(() => scoped.value.length)
const sections = computed(() => new Set(scoped.value.map((p: any) => p.section)).size)
const latest = computed(() => (scoped.value[0]?.date ?? '').replace(/-/g, '.'))
const articleWord = computed(() => (isEn.value ? (total.value === 1 ? 'article' : 'articles') : '篇文章'))
const sectionWord = computed(() =>
  isEn.value ? (sections.value === 1 ? 'section' : 'sections') : '个专栏'
)
</script>

<template>
  <ul class="hero-stats" :aria-label="isEn ? 'Site statistics' : '站点统计'">
    <li>
      <strong>{{ total }}</strong>
      <span>{{ articleWord }}</span>
    </li>
    <li class="sep" aria-hidden="true" />
    <li>
      <strong>{{ sections }}</strong>
      <span>{{ sectionWord }}</span>
    </li>
    <li class="sep" aria-hidden="true" />
    <li>
      <strong>{{ latest }}</strong>
      <span>{{ isEn ? 'latest update' : '最近更新' }}</span>
    </li>
  </ul>
</template>

