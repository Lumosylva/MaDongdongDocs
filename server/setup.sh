#!/usr/bin/env bash
# Waline 后端生产机初始化脚本（幂等，可重复执行）。
# 用法：把仓库 server/ 目录上传到生产机后，sudo bash server/setup.sh
# 前提：Node 22 已安装（node -v 可用）；DNS A 记录 comment.madongdong.com 已解析到本机。
set -euo pipefail

APP_DIR=/var/www/waline
APP_USER=www-data
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> 检查 Node"
command -v node >/dev/null || { echo "未检测到 Node，请先安装 Node 22"; exit 1; }
node -v

echo "==> 准备目录 $APP_DIR"
sudo mkdir -p "$APP_DIR/data"

echo "==> 拷贝后端清单文件"
sudo cp "$SRC_DIR/package.json" "$APP_DIR/"
sudo cp "$SRC_DIR/init-sqlite.cjs" "$APP_DIR/"
if [ -f "$SRC_DIR/package-lock.json" ]; then
  sudo cp "$SRC_DIR/package-lock.json" "$APP_DIR/"
fi

echo "==> 安装生产依赖"
cd "$APP_DIR"
if [ -f package-lock.json ]; then
  sudo npm ci --production --no-audit --no-fund
else
  sudo npm install --production --no-audit --no-fund
fi

echo "==> 检查 .env"
if [ ! -f "$APP_DIR/.env" ]; then
  if [ -f "$SRC_DIR/.env" ]; then
    sudo cp "$SRC_DIR/.env" "$APP_DIR/.env"
  else
    sudo cp "$SRC_DIR/.env.example" "$APP_DIR/.env"
    echo "!! 已从 .env.example 复制 .env；请先填写 JWT_TOKEN、SMTP_USER/SMTP_PASS、AUTHOR_EMAIL 后再启动"
  fi
fi

echo "==> 初始化 SQLite 表结构（幂等）"
# 应用不会自动加载 .env，这里导出 SQLite 相关变量供建表脚本读取
set -a
# shellcheck disable=SC1091
source "$APP_DIR/.env"
set +a
sudo node "$APP_DIR/init-sqlite.cjs"

echo "==> 目录属主（运行用户 $APP_USER）"
sudo chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

echo "==> 安装 systemd 单元"
sudo cp "$SRC_DIR/waline.service" /etc/systemd/system/waline.service
sudo systemctl daemon-reload
sudo systemctl enable waline

echo "==> 安装 Nginx 站点配置"
sudo cp "$SRC_DIR/nginx-comment.conf" /etc/nginx/sites-available/comment.madongdong.com
sudo ln -sf /etc/nginx/sites-available/comment.madongdong.com /etc/nginx/sites-enabled/comment.madongdong.com
sudo nginx -t
sudo systemctl reload nginx

echo "==> 启动 Waline"
sudo systemctl restart waline
sleep 2
sudo systemctl --no-pager status waline || true
ss -ltnp | grep 8360 || true

echo
echo "完成。后台注册入口：https://comment.madongdong.com/ui/register"
echo "（第一个注册的用户自动成为管理员）"
