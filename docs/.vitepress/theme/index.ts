import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Comment from './components/Comment.vue'

/**
 * 自定义主题：扩展 VitePress 默认主题。
 * v1 仅在每页底部挂载评论占位组件；二期接入 Waline 时只需替换 Comment.vue 实现。
 */
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 文档内容底部插槽：预留评论区位置
      'doc-bottom': () => h(Comment)
    })
  }
}
