#!/bin/bash
# sync-to-my-scripts.sh —— 把 verge-global-script 的最新内容同步到 my-scripts 公开仓库
#
# 背景：verge 分流脚本的部署源在本地 `~/Documents/work/ai-env/verge-global-script`
# （deploy.sh 从这里部署到 Verge），公开仓库 my-scripts/verge-global-script/ 是它的对外副本。
# 改完脚本跑本脚本一次即可完成「同步 + 提交 + 推送」。
#
# 用法：
#   bash sync-to-my-scripts.sh          # 同步 + 提交 + 推送（有变化时）
#   bash sync-to-my-scripts.sh --check  # 只看差异，不推送

set -euo pipefail

SRC="$HOME/Documents/work/ai-env/verge-global-script"
DST="$HOME/Documents/work/ai-env/my-scripts/verge-global-script"

step() { printf '\033[1;34m==> %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }

[ -d "$SRC/.git" ] || { echo "✗ 源不存在: $SRC" >&2; exit 1; }
[ -d "$DST" ]      || { echo "✗ 目标不存在: $DST（先 clone peanutgao/my-scripts）" >&2; exit 1; }

# my-scripts 里跟踪的文件清单（新增文件要同步需同时改这里）
FILES="global_script.js deploy.sh setup-verge-global.sh README.md UPSTREAM-README.md dedione-reject-rules.json"

step "同步文件"
CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1
changed=0
for f in $FILES; do
    if [ ! -f "$SRC/$f" ]; then
        echo "  ⚠ 源缺失（跳过）: $f"
        continue
    fi
    if ! diff -q "$SRC/$f" "$DST/$f" >/dev/null 2>&1; then
        if [ "$CHECK_ONLY" = "1" ]; then
            echo "  待更新: $f"
        else
            cp "$SRC/$f" "$DST/$f"
            echo "  更新: $f"
        fi
        changed=1
    fi
done
[ "$changed" = "1" ] || { ok "无变化，my-scripts 已是最新"; exit 0; }
if [ "$CHECK_ONLY" = "1" ]; then
    echo "（--check 模式：未做任何修改。去掉 --check 执行同步推送）"
    exit 0
fi

step "提交并推送（my-scripts，公开仓库）"
cd "$DST"
git add -A
git commit -q -m "verge-global-script 同步自本地部署源 $(date +%Y-%m-%d)"
git push origin main 2>&1 | tail -1
ok "已推送。远端 my-scripts/verge-global-script/ 已更新"
