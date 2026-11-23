<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import posts from 'virtual:recent-posts'

const route = useRoute()
const isEn = computed(() => route.path.startsWith('/en'))

const LIMIT = 5

const labels: Record<string, { zh: string; en: string }> = {
  java: { zh: 'Java', en: 'Java' },
  'spring-boot': { zh: 'Spring Boot', en: 'Spring Boot' },
  database: { zh: '数据库', en: 'Database' },
  'software-testing': { zh: '软件测试', en: 'Software Testing' },
  guide: { zh: '指南', en: 'Guide' }
}

const sectionLabel = (section: string) => {
  const hit = labels[section]
  if (hit) return hit[isEn.value ? 'en' : 'zh']
  return section
}

const fmtDate = (date: string) => (date || '').replace(/-/g, '.')

const items = computed(() =>
  posts
    .filter((p: any) => p.lang === (isEn.value ? 'en' : 'zh'))
    .slice(0, LIMIT)
)
</script>

<template>
  <section class="recent-posts" :aria-label="isEn ? 'Latest updates' : '最近更新'">
    <header class="recent-header">
      <h2 class="recent-title">{{ isEn ? 'Latest updates' : '最近更新' }}</h2>
      <span class="recent-hint">{{ isEn ? 'Newest notes first' : '按更新时间排序' }}</span>
    </header>

    <ul class="recent-list">
      <li v-for="item in items" :key="item.url">
        <a class="recent-item" :href="withBase(item.url)">
          <span class="recent-date">{{ fmtDate(item.date) }}</span>
          <span class="recent-name">{{ item.title }}</span>
          <span class="recent-chip">{{ sectionLabel(item.section) }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>
