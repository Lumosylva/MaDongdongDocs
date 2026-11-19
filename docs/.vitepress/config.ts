import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import {
  pagefindPlugin,
  chineseSearchOptimize
} from 'vitepress-plugin-pagefind'

// 站点品牌信息（二期固化）
const siteTitle = '马东东的技术教程'
const siteDescription = '技术让生活更美好'

// 站点基础配置
// 搜索：二期切换为 Pagefind 离线索引（本地打包，不接 Algolia、不依赖公网 CDN）。
// 多语言：当前仅中文（root）；后续新增语言时在 locales 下追加键并补齐内容目录。
export default withMermaid(
  defineConfig({
    cleanUrls: true,
    lastUpdated: true,

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    ],

    markdown: {
      // LaTeX 公式（markdown-it-mathjax3，本地渲染，不依赖外部 CDN）
      math: true,
      // 代码块显示行号
      lineNumbers: true
    },

    locales: {
      root: {
        lang: 'zh-CN',
        label: '简体中文',
        title: siteTitle,
        description: siteDescription,

        themeConfig: {
          logo: '/logo.svg',

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

          // 二期：关联 GitHub 仓库后，在此添加 socialLinks：
          // socialLinks: [{ icon: 'github', link: 'https://github.com/Lumosylva/MaDongdongDocs' }]
        }
      }

      // 预留：新增英文等语言时在此追加，例如：
      // en: {
      //   lang: 'en-US',
      //   label: 'English',
      //   title: 'Ma Dongdong Tech Notes',
      //   description: 'Technology makes life better',
      //   themeConfig: { nav: [...], sidebar: {...} }
      // }
    },

    // Mermaid 主题配置；明暗主题由插件自动适配
    mermaid: {
      theme: 'default'
    },

    vite: {
      plugins: [
        pagefindPlugin({
          // 中文分词查询优化（基于浏览器内置 Intl.Segmenter）
          customSearchQuery: chineseSearchOptimize,
          // 各语言搜索框文案；键与 locales 键对应
          locales: {
            root: {
              btnPlaceholder: '搜索',
              placeholder: '搜索文档',
              emptyText: '暂无匹配结果',
              heading: '共 {{searchResult}} 条结果',
              showDate: false
            }
          }
        })
      ],
      optimizeDeps: {
        // fastdom 为 Mermaid 的 CJS/UMD 传递依赖，dev 模式需预打包以提供默认导出互操作；
        // 否则浏览器端报 "does not provide an export named 'default'"，页面无法加载。
        include: ['fastdom', 'fastdom/extensions/fastdom-promised.js']
      }
    }
  })
)
