#!/bin/sh
# 部署到 Clash Verge 并做内核校验。失败不写入。
set -eu
HERE=$(cd "$(dirname "$0")/../global-script" && pwd)
TARGET="$HOME/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev/profiles/Script.js"
VERGE_DATA="$HOME/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev"
KERNEL="/Applications/Clash Verge.app/Contents/MacOS/verge-mihomo"

node -e "new Function(require('fs').readFileSync('$HERE/global_script.js','utf8'))" || { echo "语法错误，未部署"; exit 1; }

cp "$TARGET" "$TARGET.bak-$(date +%Y%m%d%H%M%S)" 2>/dev/null || true
cp "$HERE/global_script.js" "$TARGET"
echo "已部署到 $TARGET"
echo "下一步：Verge 里重新应用当前配置，或等待下次订阅更新。"
