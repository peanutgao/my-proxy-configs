#!/bin/sh
# 部署到 Clash Verge 并做 JS 语法 + mihomo 内核校验。任一失败不写入。
set -eu
HERE=$(cd "$(dirname "$0")/../global-script" && pwd)
SRC="$HERE/global_script.js"
VERGE_DATA="$HOME/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev"
TARGET="$VERGE_DATA/profiles/Script.js"
KERNEL="/Applications/Clash Verge.app/Contents/MacOS/verge-mihomo"

command -v node >/dev/null 2>&1 || { echo "未安装 Node.js，无法执行语法校验"; exit 1; }

# 1. JS 语法校验（通过 argv 传路径，避免路径含引号导致注入/语法错）
node -e "new Function(require('fs').readFileSync(process.argv[1],'utf8'))" "$SRC" \
    || { echo "语法错误，未部署"; exit 1; }

# 2. 用模拟配置运行 main()，再由 verge-mihomo -t 做真实内核校验（YAML/规则/分组/provider 完整性）
TMP_CFG=$(mktemp "${TMPDIR:-/tmp}/verge-script-check.XXXXXX.yaml")
trap 'rm -f "$TMP_CFG"' EXIT

node - "$SRC" "$TMP_CFG" <<'NODE'
const fs = require('fs')
const code = fs.readFileSync(process.argv[1], 'utf8')
const mainFn = new Function(code + '\nreturn main;')()
const sample = {
  'mixed-port': 6152,
  mode: 'rule',
  proxies: [
    { name: '直连', type: 'direct' },
    { name: '🇯🇵 日本 IEPL 01', type: 'ss', server: '1.1.1.1', port: 443, cipher: 'aes-128-gcm', password: 'x' },
    { name: '🇺🇸 美国 01', type: 'ss', server: '1.1.1.2', port: 443, cipher: 'aes-128-gcm', password: 'x' },
    { name: '🇭🇰 香港 01', type: 'ss', server: '1.1.1.3', port: 443, cipher: 'aes-128-gcm', password: 'x' },
  ],
  'proxy-groups': [],
  rules: [],
}
const out = mainFn(sample)
if (!out || !Array.isArray(out.rules) || !out.rules[0] || !out.rules[0].includes('OrbStack Helper')) {
  throw new Error('首条规则不是 OrbStack Helper 直连')
}
const otherGroup = (out['proxy-groups'] || []).find((g) => g.name === '其他节点')
if (otherGroup && (otherGroup.proxies || []).some((n) => n === '直连' || n === '拒绝')) {
  throw new Error('内置节点误混入其他节点组')
}
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 2))
NODE

if [ -x "$KERNEL" ]; then
    "$KERNEL" -t -d "$VERGE_DATA" -f "$TMP_CFG" >/dev/null \
        || { echo "mihomo 内核校验失败，未部署"; exit 1; }
else
    echo "⚠ 未找到 ${KERNEL}，已跳过内核校验（仅完成 JS 语法与合成校验）"
fi

mkdir -p "$(dirname "$TARGET")"
cp "$TARGET" "$TARGET.bak-$(date +%Y%m%d%H%M%S)" 2>/dev/null || true
cp "$SRC" "$TARGET"
echo "已通过校验并部署到 $TARGET"
echo "下一步：Verge 里重新应用当前配置，或等待下次订阅更新。"
