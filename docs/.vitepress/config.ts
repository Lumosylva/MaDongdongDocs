import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import footnote from 'markdown-it-footnote'
import {
  pagefindPlugin,
  chineseSearchOptimize
} from 'vitepress-plugin-pagefind'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

/**
 * 首页「最近更新」与「文章统计」的数据源。
 *
 * 构建时扫描 docs 下的 Markdown，取首个 H1 作标题、取 git 最后提交日期作更新时间
 * （没有 git 记录时退回文件 mtime），再通过虚拟模块 `virtual:recent-posts`
 * 交给首页组件，避免浏览器端发请求、也不必手工维护文章清单。
 *
 * docs:dev 下修改 markdown（含改标题、增删文章）会自动失效重算，无需重启。
 */
type RecentPost = {
  title: string
  url: string
  date: string
  section: string
  lang: 'zh' | 'en'
}

const docsRoot = fileURLToPath(new URL('..', import.meta.url))

const titleOf = (content: string) => {
  const match = /^#\s+(.+)$/m.exec(content)
  return match ? match[1].trim() : ''
}

const gitDateOf = (file: string) => {
  try {
    // 构建环境必须有 git（VitePress 的 lastUpdated 同样依赖它）
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', file],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out
  } catch {
    // git 不可用、文件未提交等情况，退回文件时间
  }
  return fs.statSync(file).mtime.toISOString().slice(0, 10)
}

const collectPosts = (dir: string, acc: RecentPost[] = []): RecentPost[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectPosts(full, acc)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const rel = path.relative(docsRoot, full).split(path.sep).join('/')
    // 两个语言首页本身不是文章
    if (rel === 'index.md' || rel === 'en/index.md') continue

    const content = fs.readFileSync(full, 'utf8')
    const title = titleOf(content)
    if (!title) continue

    const lang: RecentPost['lang'] = rel.startsWith('en/') ? 'en' : 'zh'
    const segments = rel.split('/')
    // 英文内容在 docs/en/ 下，专栏名要跳过语言目录，否则所有英文页都会归到 "en"
    const section = (lang === 'en' ? segments[1] : segments[0]).replace(/\.md$/, '')
    const routePath = ('/' + segments.join('/'))
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')

    acc.push({
      title,
      url: routePath,
      date: gitDateOf(full),
      section,
      lang
    })
  }
  return acc
}

// 每次读取都重新扫描，这样 markdown 改动后（dev 下模块失效重载）标题与日期都是新的
const getRecentPosts = () =>
  collectPosts(docsRoot).sort((a, b) => (a.date < b.date ? 1 : -1))

const RECENT_POSTS_ID = '\0virtual:recent-posts'

const recentPostsPlugin = {
  name: 'recent-posts-data',
  resolveId(id: string) {
    if (id === 'virtual:recent-posts') return RECENT_POSTS_ID
    return null
  },
  load(id: string) {
    if (id === RECENT_POSTS_ID) {
      return `export default ${JSON.stringify(getRecentPosts())}`
    }
    return null
  },
  // docs:dev 下要能感知 markdown 变化：内容改动让虚拟模块失效重算（标题/日期跟着更新），
  // 文件新增或删除则整页刷新，避免列表与统计停留在启动时的快照。
  configureServer(server: any) {
    const reload = (file: string) => {
      if (!file.endsWith('.md')) return
      const mod = server.moduleGraph.getModuleById(RECENT_POSTS_ID)
      if (mod) server.moduleGraph.invalidateModule(mod)
      server.ws.send({ type: 'full-reload' })
    }
    server.watcher.on('add', reload)
    server.watcher.on('unlink', reload)
  },
  handleHotUpdate(ctx: any) {
    if (!ctx.file.endsWith('.md')) return
    const mod = ctx.server.moduleGraph.getModuleById(RECENT_POSTS_ID)
    if (!mod) return
    ctx.server.moduleGraph.invalidateModule(mod)
    return [...ctx.modules, mod]
  }
}


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
                  { text: '集成测试', link: '/software-testing/integration-testing' },
                  { text: '性能测试', link: '/software-testing/performance-testing' },
                  { text: '回归测试', link: '/software-testing/regression-testing' }
                ]
              }
            ]
          },

          outline: { level: [2, 3] },

          // 404 页文案：VitePress 会生成 dist/404.html，由 Nginx error_page 指过去。
          notFound: {
            code: '404',
            title: '页面不存在',
            quote: '这个地址没有对应的文章。可能是链接过期，或者拼写有误。',
            linkLabel: '返回首页',
            linkText: '返回首页'
          },

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
            '/en/software-testing/': [
              {
                text: 'Software Testing',
                items: [
                  { text: 'Overview', link: '/en/software-testing/' },
                  { text: 'Functional Testing', link: '/en/software-testing/functional-testing' },
                  { text: 'Integration Testing', link: '/en/software-testing/integration-testing' },
                  { text: 'Performance Testing', link: '/en/software-testing/performance-testing' },
                  { text: 'Regression Testing', link: '/en/software-testing/regression-testing' }
                ]
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

          // 英文侧 404 文案，与 root 的 notFound 一一对应。
          notFound: {
            code: '404',
            title: 'PAGE NOT FOUND',
            quote: 'This page does not exist. The link may be outdated, or the URL mistyped.',
            linkLabel: 'Back to home',
            linkText: 'Back to home'
          },

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
        recentPostsPlugin,
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
