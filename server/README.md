# Waline 评论后端（自建）

本目录存放马东东技术教程站点的 Waline 后端部署模板：Node 进程 + systemd 常驻 + Nginx 子域名反代，SQLite 默认存储，保留 MySQL 适配。

- 后端包：`@waline/vercel`，独立运行入口 `node node_modules/@waline/vercel/vanilla.js`，默认监听 `127.0.0.1:8360`。
- 对外入口：`https://comment.madongdong.com`（Nginx 反代到本地 8360）。
- 前端组件：仓库 `docs/.vitepress/theme/components/Comment.vue`，后端地址由根目录 `.env.local` 的 `VITE_WALINE_SERVER_URL` 注入。

## 目录文件

| 文件 | 作用 |
| --- | --- |
| `package.json` | 后端依赖清单（`@waline/vercel`），`npm start` 启动 |
| `.env.example` | 环境变量模板；复制为 `.env` 填真实值，`.env` 不入库 |
| `waline.service` | systemd 单元（工作目录 `/var/www/waline`，`EnvironmentFile` 注入 `.env`） |
| `nginx-comment.conf` | `comment.madongdong.com` 的 Nginx 反代配置 |
| `init-sqlite.cjs` | SQLite 表结构初始化脚本（幂等建三张表与索引），由 `setup.sh` 自动调用 |
| `setup.sh` | 生产机初始化脚本（装依赖、建表、落单元、挂 Nginx、起服务），幂等可重复执行 |

## 部署前必备条件

1. **Node 22**：生产机宿主机需安装 Node 22（`node -v` 可用）。
2. **DNS**：在域名服务商为两个子域分别添加 A 记录 → 生产机公网 IP（`36.150.231.4`）：`comment.madongdong.com`（评论后端）、`docs.madongdong.com`（文档站前端）。本机现有主站/子域均为逐条显式 A 记录，无泛域名解析。
3. **证书**：复用现有泛域名证书 `/etc/letsencrypt/live/madongdong.com/`，子域无需新签。
4. **凭据准备**（仅填入生产机 `.env`，不入 Git）：
   - `JWT_TOKEN`：生产机执行 `openssl rand -hex 32` 生成。
   - QQ 邮箱 SMTP：完整邮箱地址 + SMTP 授权码（QQ 邮箱设置 → 账号 → 开启 SMTP → 生成授权码，非登录密码）。
   - `AUTHOR_EMAIL`：管理员接收新评论通知的邮箱。

## 首次部署步骤

1. 在生产机安装 Node 22（示例，Ubuntu 24.04）：

   ```bash
   # NodeSource 方式；若网络访问慢，可改用 npmmirror 二进制安装
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node -v && npm -v
   ```

2. 把本 `server/` 目录上传到生产机（可随仓库 clone，或 scp 上传）。

3. 复制并填写环境变量：

   ```bash
   cd /path/to/server
   cp .env.example .env
   # 编辑 .env：填 JWT_TOKEN、SMTP_USER、SMTP_PASS、SENDER_EMAIL、AUTHOR_EMAIL
   ```

   至少确认：`SQLITE_PATH=/var/www/waline/data`、`SITE_URL=https://docs.madongdong.com`、`SERVER_URL=https://comment.madongdong.com`、`SECURE_DOMAINS` 包含 `docs.madongdong.com` 与 `comment.madongdong.com`。

4. 运行初始化脚本：

   ```bash
   sudo bash setup.sh
   ```

   脚本会：创建 `/var/www/waline/data` → 安装生产依赖 → `init-sqlite.cjs` 初始化 SQLite 三张表与索引（幂等）→ 落 systemd 单元（运行用户 `www-data`）→ 挂 Nginx 站点 → `nginx -t` → 启动 `waline` 服务。

   > SQLite 场景 Waline 不会自动建表；表结构由 `init-sqlite.cjs` 依据官方 `waline.sqlite` / `waline.sql` 生成，无需再手动下载二进制模板。

5. 验证服务与后台：

   ```bash
   systemctl status waline
   ss -ltnp | grep 8360
   curl -I http://127.0.0.1:8360/
   ```

   浏览器打开 `https://comment.madongdong.com/ui/register` 注册管理员账号（**第一个注册用户自动成为管理员**）。

6. 前端回填：在本机仓库根目录 `.env.local` 填：

   ```env
   VITE_WALINE_SERVER_URL=https://comment.madongdong.com
   ```

   重新 `npm run docs:build` 并发布静态产物，评论区即渲染。

## 日常运维

```bash
# 查看实时日志
sudo journalctl -u waline -f

# 改完 .env 后重启生效
sudo systemctl restart waline

# 升级后端版本（注意：当前精确锁定 1.43.4；1.43.5+ 的 engines 要求 Node 26，
# 升级版本前需先把 Node 升到 26，否则保持 1.43.4）
cd /var/www/waline
sudo npm install @waline/vercel@1.43.4 --production
sudo systemctl restart waline

# 备份 SQLite（停服或在线拷贝均可，建议备份 data 目录）
sudo cp -r /var/www/waline/data /var/backups/waline-data-$(date +%F)
```

## 切换到 MySQL（预留）

适配器选择优先级：MongoDB → PostgreSQL → SQLite → MySQL → TiDB。

1. 在 MySQL 建库与专用账号（`utf8mb4`）。
2. 编辑 `/var/www/waline/.env`：注释/删除 SQLite 段的 `SQLITE_PATH`、`SQLITE_DB`、`SQLITE_PREFIX`，填写 MySQL 段。
3. `sudo systemctl restart waline`。
4. 历史 SQLite 评论需自行迁移；新库首次启动自动建表。

## 审核与反垃圾策略（当前配置）

- `COMMENT_AUDIT=true`：评论先审后显，管理员在 `/ui/` 后台通过后才对外展示。
- `IPQPS=60`：同一 IP 两次评论最小间隔 60 秒；`0` 为不限。
- `FORBIDDEN_WORDS`：敏感词逗号分隔，命中按反垃圾规则处理。
- Akismet 默认开启（内置公共 Key）；不需要时 `AKISMET_KEY=false`。
- 后续如需人机验证，可再接入 Cloudflare Turnstile 或 reCAPTCHA v3，需服务端与前端组件同时配 Key。

## 故障排查

- **启动报 `Error: Not initialized` / 回退 LeanCloud**：`SQLITE_PATH` 或 `JWT_TOKEN` 未被进程读到，检查 systemd `EnvironmentFile` 路径与 `.env` 键名，重启服务。
- **接口 500 `no such table: wl_Comment`**：SQLite 表结构未初始化。在 `/var/www/waline` 下执行 `sudo node init-sqlite.cjs` 后 `sudo systemctl restart waline`；或直接重跑 `sudo bash setup.sh`。
- **Nginx 502 / 503**：先 `systemctl status waline` 看进程是否在 8360 监听；`journalctl -u waline` 看启动报错。
- **邮件发不出**：核对 SMTP 主机/端口/授权码；QQ 邮箱 465 端口 `SMTP_SECURE=true`；授权码不是登录密码。
- **前端评论区不渲染**：确认前端 `.env.local` 的 `VITE_WALINE_SERVER_URL` 已填并重新构建；未配置时组件按设计不渲染。
- **跨域 / 评论提交被拒**：`SECURE_DOMAINS` 需同时包含站点域名与后端域名，不含 `http://`、`https://` 与端口。
- **环境变量改动不生效**：Waline 环境变量变更后必须重启进程，仅改文件不够。
