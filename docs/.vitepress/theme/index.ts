import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BackToTop from './components/BackToTop.vue'
import Comment from './components/Comment.vue'
import './style.css'

/**
 * 自定义主题：扩展 VitePress 默认主题。
 * v1 仅在每页底部挂载评论占位组件；二期接入 Waline 时只需替换 Comment.vue 实现。
 */
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 评论插槽放在正文之后、页脚之内：doc-bottom 会落在 VPDoc 最外层，
      // 宽度不受 688px 内容列约束，会横向压到右侧文章导航（aside）。
      'doc-after': () => h(Comment),
      // 全局布局底部插槽：悬浮回顶按钮适用于首页和文档页
      'layout-bottom': () => h(BackToTop)
    })
  }
}
