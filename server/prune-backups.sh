#!/usr/bin/env bash
# 通用备份裁剪：按时间戳倒序，只保留最近 N 份 <base>.bak-* 目录。
#
# 用法：
#   bash prune-backups.sh <父目录> <基础名> [保留份数=3] [--dry-run]
#
# 示例：
#   bash prune-backups.sh /var/www waline            # 保留最近 3 份 /var/www/waline.bak-*
#   bash prune-backups.sh /var/www waline 2 --dry-run # 只打印将删除哪些，不实际删除
#
# 说明：
#   - 只处理目录，不动同名普通文件；
#   - 备份名格式必须为 <基础名>.bak-<yyyyMMdd-HHmmss>，靠名字倒序即时间倒序；
#   - 单份删除失败会打印警告但不中断，最后汇总失败数量，退出码 0；
#   - 参数非法时退出码 2，便于脚本调用方区分。
set -uo pipefail

usage() {
  sed -n '3,10p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

if [ "$#" -lt 2 ]; then
  echo "参数不足：需要 <父目录> <基础名> [保留份数] [--dry-run]" >&2
  usage >&2
  exit 2
fi

PARENT="$1"
BASE="$2"
KEEP="${3:-3}"
DRY_RUN=0

# 允许保留份数放在第 4 位（如 `prune-backups.sh /var/www waline --dry-run`）
if [ "$KEEP" = "--dry-run" ]; then
  KEEP=3
  DRY_RUN=1
fi
if [ "${4:-}" = "--dry-run" ]; then
  DRY_RUN=1
fi

case "$KEEP" in
  ''|*[!0-9]*) echo "保留份数必须是正整数，收到：'$KEEP'" >&2; exit 2 ;;
esac
if [ "$KEEP" -lt 1 ]; then
  echo "保留份数必须 >= 1，收到：$KEEP" >&2
  exit 2
fi
if [ ! -d "$PARENT" ]; then
  echo "父目录不存在：$PARENT" >&2
  exit 2
fi

echo "父目录：$PARENT  基础名：$BASE  保留：$KEEP 份  模式：$([ "$DRY_RUN" -eq 1 ] && echo '仅预览' || echo '实际删除')"

FAILED=0
COUNT=0
while IFS= read -r old; do
  [ -n "$old" ] || continue
  COUNT=$((COUNT + 1))
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "将删除：$old"
    continue
  fi
  if rm -rf "$old" 2>/dev/null; then
    echo "已删除：$old"
  else
    echo "警告：删除失败（权限或占用）：$old" >&2
    FAILED=$((FAILED + 1))
  fi
done < <(find "$PARENT" -maxdepth 1 -mindepth 1 -type d -name "$BASE.bak-*" 2>/dev/null | sort -r | tail -n +$((KEEP + 1)))

echo "待清理份数：$COUNT，失败：$FAILED"
exit 0
