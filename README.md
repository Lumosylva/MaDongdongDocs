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
| `npm run docs:deploy` | 构建 + 外链检查 + 打包；配置服务器信息后可一键上传 |
| `pwsh scripts/build-check.ps1` | 扫描产物中是否存在外部资源引用（离线发布检查） |

## 目录结构

```
MaDongdongDocs/
├── docs/                        # VitePress 文档源目录
│   ├── index.md                 # 中文首页
│   ├── public/                  # 静态资源（logo、favicon、图片等）
│   ├── guide/writing.md          # 中文写作规范
│   ├── java/                    # 中文 Java 笔记
│   ├── spring-boot/             # 中文 Spring Boot 笔记
│   ├── database/                 # 中文数据库笔记
│   ├── en/                       # 英文镜像（与中文目录一一对应）
│   └── .vitepress/
│       ├── config.ts             # 站点、导航、侧边栏、搜索、locales、页脚配置
│       └── theme/
│           ├── index.ts          # 主题扩展（挂载评论插槽）
│           └── components/Comment.vue  # Waline 评论组件（未配置后端时不渲染）
├── scripts/
│   ├── build-check.ps1           # 产物外链检查脚本
│   └── deploy.ps1                # 构建 + 检查 + 打包 / 可选上传脚本
├── .env.example                  # 环境变量示例（Waline 后端地址）
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

## 搜索（Pagefind 离线索引）

- 采用 `vitepress-plugin-pagefind` + `pagefind`，索引在本地构建时生成，随静态产物一起发布，不依赖公网搜索服务、不接 Algolia。
- 中文查询经 `Intl.Segmenter` 分词优化；搜索框文案在 `config.ts` 的 `pagefindPlugin.locales` 中维护。
- 插件以 `manual` 模式运行：索引由 `docs:build` 末尾的 `pagefind` CLI 生成，前端加载脚本在 `config.ts` 的 `head` 中显式指定 `basePath: '/pagefind/'` 并关闭 SharedWorker，避免子目录（如 `/en/`）下相对路径解析错误。
- 索引产物位于 `dist/pagefind/`；dev 模式下不生成索引，搜索面板以构建产物（`docs:preview`）为准。
- 某篇文章不希望被索引时，在该页 frontmatter 加 `pagefind-indexed: false`。

## 评论区（Waline）

- 前端组件已接入 `@waline/client`，评论会话按当前路由路径区分，明暗主题跟随站点外观。
- **后端尚未部署**：在项目根目录复制 `.env.example` 为 `.env.local`，填写 `VITE_WALINE_SERVER_URL`（自有服务器或托管部署的 Waline 服务地址）；未配置时评论区不渲染、不发起请求。
- Waline 后端需配套数据库（LeanCloud / MySQL / MongoDB / Supabase 等），部署后端后回填地址即可启用。`.env.local` 已被 Git 忽略。

## 部署自动化

`scripts/deploy.ps1` 流程：安装依赖（如缺失）→ `docs:build` → 外链检查 → 打包 `deploy/madongdong-docs-<时间戳>.zip`。

默认只构建打包，不上传。开启上传需通过环境变量提供服务器信息：

```powershell
$env:DEPLOY_UPLOAD="true"
$env:DEPLOY_SSH_USER="deploy"
$env:DEPLOY_SSH_HOST="你的服务器"
$env:DEPLOY_REMOTE_PATH="/var/www/madongdong-docs"
npm run docs:deploy
```

脚本会先备份远端当前目录（`<remote-path>.bak-<时间戳>`），再解压新版本；未提供信息时安全跳过上传。

## 多语言与品牌

- `config.ts` 按 VitePress `locales` 结构组织：root 为中文（`docs/` 根目录），`en` 为英文镜像（`docs/en/`），导航、侧边栏、页脚与搜索文案分别维护。
- 新增语言时在 `locales` 下追加键，复制对应内容目录并补齐导航 / 侧边栏。
- Logo 与 favicon 位于 `docs/public/`（`logo.svg` / `favicon.svg`）；品牌素材可直接替换同名文件。

## 技术栈

- VitePress 1.6
- markdown-it-mathjax3（LaTeX 公式，本地渲染）
- vitepress-plugin-mermaid + Mermaid 11（流程图 / 序列图）
- Pagefind（离线全文搜索，中文分词优化）
- @waline/client（评论前端，后端地址可配置）
