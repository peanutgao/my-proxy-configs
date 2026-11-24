#!/bin/bash
# 用 API Token 部署 Gemini 反代 Worker（无需浏览器 OAuth）
# 用法: CLOUDFLARE_API_TOKEN=<token> bash deploy.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
: "${CLOUDFLARE_API_TOKEN:?需要设置 CLOUDFLARE_API_TOKEN（CF Dashboard → My Profile → API Tokens → Edit Cloudflare Workers 模板）}"
cd "$HERE"
command -v npx >/dev/null 2>&1 || { echo "需要 Node.js/npx"; exit 1; }
npx wrangler deploy
