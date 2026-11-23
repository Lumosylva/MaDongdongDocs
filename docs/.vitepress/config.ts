import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import footnote from 'markdown-it-footnote'
import {
  pagefindPlugin,
  chineseSearchOptimize
} from 'vitepress-plugin-pagefind'

// Mermaid 组件需要在根节点主题 class 变化时重绘图表。上游当前监听根节点所有属性，
// autosize 在删除 textarea 内容时改写 html.style.scrollBehavior，会误触发图表重绘，
// 造成页面高度瞬时变化；此适配将监听范围限制为 class（明暗主题切换）。
const mermaidThemeObserverFilter = {
  name: 'mermaid-theme-class-observer-filter',
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    const normalizedId = id.replace(/\\/g, '/')
    if (!normalizedId.endsWith('/vitepress-plugin-mermaid/dist/Mermaid.vue')) {
      return null
    }

    const broadObserver = 'mut.observe(document.documentElement, { attributes: true });'
    if (!code.includes(broadObserver)) {
      throw new Error(
        'vitepress-plugin-mermaid observer changed; review the scroll-jitter compatibility patch.'
      )
    }

    return code.replace(
      broadObserver,
      'mut.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });'
    )
  }
}

// 站点品牌信息
const siteTitle = '马东东的技术教程'
const siteDescription = '技术让生活更美好'

// 站点基础配置
// 搜索：Pagefind 离线索引（本地打包，不接 Algolia、不依赖公网 CDN）。
// 多语言：root 为中文（内容在 docs/ 根目录）；en 为英文（内容在 docs/en/）。
export default withMermaid(
  defineConfig({
    cleanUrls: true,
    lastUpdated: true,

    // 站点地图：构建时输出 dist/sitemap.xml，供搜索引擎抓取；
    // robots.txt（docs/public/robots.txt）里声明了同一地址。
    sitemap: {
      hostname: 'https://docs.madongdong.com'
    },

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      // Pagefind 离线搜索：manual 模式下由本站手动加载。
      // 显式指定 basePath 并关闭 SharedWorker，避免子目录（如 /en/）下
      // 相对路径解析错误；索引在 docs:build 末尾由 pagefind CLI 生成。
      [
        'script',
        {},
        `
        const __loadPagefind = () => {
          import('/pagefind/pagefind.js')
            .then((module) => {
              window.__pagefind__ = module
              module.options({ noWorker: true, basePath: '/pagefind/' })
              module.init()
            })
            .catch(() => {})
        }
        if (window.requestIdleCallback) {
          window.requestIdleCallback(__loadPagefind)
        } else {
          setTimeout(__loadPagefind, 0)
        }
        `
      ]
    ],

    markdown: {
      // LaTeX 公式（markdown-it-mathjax3，本地渲染，不依赖外部 CDN）
      math: true,
      // 代码块显示行号
      lineNumbers: true,
      // 脚注：[^1] 引用 + 页面底部 [^1]: 定义；VitePress 默认的 markdown-it 不含该语法
      config: (md) => {
        md.use(footnote)
      }
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
            { text: '软件测试', link: '/software-testing/' },
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
            ],
            '/software-testing/': [
              {
                text: '软件测试',
                items: [
                  { text: '概述', link: '/software-testing/' },
                  { text: '功能测试', link: '/software-testing/functional-testing' },
                  { text: '集成测试', link: '/software-testing/integration-testing' }
                ]
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
      },

      en: {
        lang: 'en-US',
        label: 'English',
        link: '/en/',
        title: 'Ma Dongdong Tech Notes',
        description: 'Technology makes life better',

        themeConfig: {
          logo: '/logo.svg',

          nav: [
            { text: 'Home', link: '/en/' },
            { text: 'Java', link: '/en/java/' },
            { text: 'Spring Boot', link: '/en/spring-boot/' },
            { text: 'Database', link: '/en/database/' },
            { text: 'Writing Guide', link: '/en/guide/writing' }
          ],

          sidebar: {
            '/en/java/': [
              {
                text: 'Java Basics',
                items: [{ text: 'Overview', link: '/en/java/' }]
              }
            ],
            '/en/spring-boot/': [
              {
                text: 'Spring Boot',
                items: [{ text: 'Overview', link: '/en/spring-boot/' }]
              }
            ],
            '/en/database/': [
              {
                text: 'Database',
                items: [{ text: 'Overview', link: '/en/database/' }]
              }
            ],
            '/en/guide/': [
              {
                text: 'Site Guide',
                items: [{ text: 'Writing Conventions', link: '/en/guide/writing' }]
              }
            ]
          },

          outline: { level: [2, 3] },

          footer: {
            message: 'Technology makes life better',
            copyright: 'Copyright © 2026 madongdong.com · Lumosylva'
          }
        }
      }
    },

    // Mermaid 主题配置；明暗主题由插件自动适配
    mermaid: {
      theme: 'default'
    },

    vite: {
      build: {
        // Mermaid 各图种、KaTeX 均为按需懒加载分包，单包体积偏大属预期；
        // 这里仅调高 Rollup 告警阈值，不关闭代码分包。
        chunkSizeWarningLimit: 800
      },
      plugins: [
        mermaidThemeObserverFilter,
        pagefindPlugin({
          // manual：索引生成与资源加载由本站脚本/构建命令接管（见 head 脚本与 docs:build）
          manual: true,
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
            },
            en: {
              btnPlaceholder: 'Search',
              placeholder: 'Search docs',
              emptyText: 'No matching results',
              heading: 'Total: {{searchResult}} results',
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
