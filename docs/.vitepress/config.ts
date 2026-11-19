import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 站点基础配置
// 说明：v1 仅中文；后续多语言按 VitePress locales 结构扩展。
// 搜索：v1 使用内置本地搜索；二期可替换为 Pagefind 等离线路线，不接入 Algolia。
export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: '马东东的技术教程',
    description: '技术让生活更美好',
    cleanUrls: true,
    lastUpdated: true,

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
    ],

    markdown: {
      // LaTeX 公式（markdown-it-mathjax3，本地渲染，不依赖外部 CDN）
      math: true,
      // 代码块显示行号
      lineNumbers: true
    },

    themeConfig: {
      logo: '/logo.svg',

      // 内置本地搜索
      search: {
        provider: 'local'
      },

      nav: [
        { text: '首页', link: '/' },
        { text: 'Java', link: '/java/' },
        { text: 'Spring Boot', link: '/spring-boot/' },
        { text: '数据库', link: '/database/' },
        { text: '写作指南', link: '/guide/writing' }
      ],

      sidebar: {
        '/java/': [
          {
            text: 'Java 基础',
            items: [{ text: '概述', link: '/java/' }]
          }
        ],
        '/spring-boot/': [
          {
            text: 'Spring Boot',
            items: [{ text: '概述', link: '/spring-boot/' }]
          }
        ],
        '/database/': [
          {
            text: '数据库',
            items: [{ text: '概述', link: '/database/' }]
          }
        ],
        '/guide/': [
          {
            text: '本站指南',
            items: [{ text: '写作规范', link: '/guide/writing' }]
          }
        ]
      },

      outline: { level: [2, 3] },

      footer: {
        message: '技术让生活更美好',
        copyright: 'Copyright © 2026 madongdong.com · Lumosylva'
      }

      // 二期：关联 GitHub private 仓库后，在此添加 socialLinks：
      // socialLinks: [{ icon: 'github', link: 'https://github.com/<owner>/<repo>' }]
    },

    // Mermaid 主题配置；明暗主题由插件自动适配
    mermaid: {
      theme: 'default'
    },

    vite: {
      optimizeDeps: {
        // fastdom 为 Mermaid 的 CJS/UMD 传递依赖，dev 模式需预打包以提供默认导出互操作；
        // 否则浏览器端报 "does not provide an export named 'default'"，页面无法加载。
        include: ['fastdom', 'fastdom/extensions/fastdom-promised.js']
      }
    }
  })
)
