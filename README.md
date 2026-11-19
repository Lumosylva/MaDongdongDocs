# 马东东的技术教程

自建学习笔记 / 教程站点，基于 [VitePress](https://vitepress.dev/) 静态生成，纯文字 + 代码块，沉淀 Java、Spring Boot、数据库等计算机知识。

- 站点标题：马东东的技术教程
- 站点描述：技术让生活更美好
- 版权署名：© madongdong.com · Lumosylva

## 环境要求

- Node.js 22+（开发机本机已验证 v22.23.2）
- npm 10+
- Git（版本管理）

## 常用命令

在项目根目录执行：

| 命令 | 说明 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run docs:dev` | 本地开发预览，默认 http://localhost:5173 |
| `npm run docs:build` | 生产构建，产物输出到 `docs/.vitepress/dist` |
| `npm run docs:preview` | 本地预览构建产物，默认 http://localhost:4173 |
| `pwsh scripts/build-check.ps1` | 扫描产物中是否存在外部资源引用（离线发布检查） |

## 目录结构

```
MaDongdongDocs/
├── docs/                        # VitePress 文档源目录
│   ├── index.md                 # 首页
│   ├── public/                  # 静态资源（logo、图片等）
│   ├── guide/writing.md         # 写作规范
│   ├── java/                    # Java 笔记
│   ├── spring-boot/             # Spring Boot 笔记
│   ├── database/                # 数据库笔记
│   └── .vitepress/
│       ├── config.ts             # 站点、导航、侧边栏、搜索、页脚配置
│       └── theme/
│           ├── index.ts         # 主题扩展（挂载评论占位插槽）
│           └── components/Comment.vue  # 二期评论组件占位
├── scripts/build-check.ps1       # 产物外链检查脚本
└── package.json
```

## 写作约定

新增文章前先阅读 [写作规范](docs/guide/writing.md)，涵盖目录命名、代码块语言标注、表格、LaTeX 公式与 Mermaid 图的写法。

## 发布到自有服务器（Nginx）

站点为纯静态产物，服务器上无需安装 Node。

1. 本机执行 `npm run docs:build`，生成 `docs/.vitepress/dist`。
2. 将 `dist` 目录内容上传到服务器站点目录（例如 `/var/www/madongdong-docs`）。
3. Nginx 配置示例（配合 cleanUrls）：

```nginx
server {
    listen 80;
    server_name madongdong.com;
    root /var/www/madongdong-docs;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
```

4. 重载 Nginx：`nginx -s reload`。

## 二期路线

- **搜索增强**：内容规模扩大后，接入 Pagefind 等离线索引方案；不使用 Algolia。
- **评论区**：在自有服务器部署 Waline 后端，替换 `Comment.vue` 占位实现；当前 v1 不渲染评论。
- **部署自动化**：补充上传脚本或 CI 流程，构建后自动发布到服务器。
- **多语言**：按 VitePress locales 结构扩展英文等语言。
- **品牌素材**：替换正式 Logo 与 favicon。

## 技术栈

- VitePress 1.6
- markdown-it-mathjax3（LaTeX 公式，本地渲染）
- vitepress-plugin-mermaid + Mermaid 11（流程图 / 序列图）
- 内置本地搜索
