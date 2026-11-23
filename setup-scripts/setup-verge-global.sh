#!/bin/bash
# setup-verge-global.sh —— 新 Mac 上一键部署 Clash Verge 全局分流脚本（global-script）
#
# 做什么：
#   1. 检查依赖（Clash Verge Rev 是否安装/运行，Node.js 是否可用）
#   2. 更新 my-proxy-configs 仓库（脚本从自身位置定位仓库，部署脚本在 setup-scripts/，配置在 global-script/）
#   3. 检测当前默认路由接口并给出核对提示（本脚本不修改 interface-name）
#   4. deploy.sh 部署到 Verge（含 JS 语法与 mihomo 内核校验）
#   5. 提示重启 Verge 并做验收（规则链顺序 + 谷歌AI provider 拉取 + git 代理）
#
# 用法：
#   bash setup-verge-global.sh
#   LOCAL_PROXY=http://127.0.0.1:7897 bash setup-verge-global.sh
#
# 不做什么：
#   - 不安装 Clash Verge 本体（请先自行安装并导入订阅）
#   - 不碰 TUN/端口/控制器（脚本本身也不接管这些，Verge 注入值保持原样）
#   - 不处理凭据（分流规则全部来自公开远端，无敏感内容）

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPT_DIR="$REPO_DIR/setup-scripts"
CONFIG_DIR="$REPO_DIR/global-script"
VERGE_APP="/Applications/Clash Verge.app"
VERGE_DATA="$HOME/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev"
LOCAL_PROXY="${LOCAL_PROXY:-http://127.0.0.1:6152}"

step() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m  ⚠ %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m  ✗ %s\033[0m\n' "$*" >&2; exit 1; }

step "1/5 检查依赖"
[ -d "$VERGE_APP" ] || die "未找到 Clash Verge（${VERGE_APP}）。请先安装 Clash Verge Rev 并导入订阅后再运行本脚本。"
ok "Clash Verge 已安装"
command -v node >/dev/null 2>&1 || die "未安装 Node.js（deploy.sh 语法与合成校验需要）。"
ok "Node.js 就绪"

if ! pgrep -f "MacOS/clash-verge" >/dev/null 2>&1; then
    warn "Clash Verge 未在运行，尝试启动…"
    open -a "Clash Verge"; sleep 6
    pgrep -f "MacOS/clash-verge" >/dev/null 2>&1 || die "Clash Verge 启动失败，请手动打开后重试。"
fi
ok "Clash Verge 运行中"

step "2/5 更新仓库"
cd "$REPO_DIR"
if git -c http.proxy="$LOCAL_PROXY" pull --ff-only origin main 2>/dev/null; then
    ok "仓库已通过代理更新: ${REPO_DIR}"
elif git pull --ff-only origin main 2>/dev/null; then
    ok "仓库已直连更新: ${REPO_DIR}"
else
    warn "仓库更新失败，使用本地现有版本继续: ${REPO_DIR}"
fi
[ -f "$SCRIPT_DIR/deploy.sh" ] || die "未找到 $SCRIPT_DIR/deploy.sh"
[ -f "$CONFIG_DIR/global_script.js" ] || die "未找到 $CONFIG_DIR/global_script.js"
cd "$SCRIPT_DIR"

step "3/5 检测默认路由接口"
IFACE=$(route -n get default 2>/dev/null | awk '/interface:/{print $2}' || true)
case "$IFACE" in
    en*|eth*)
        ok "默认物理接口: $IFACE"
        ;;
    utun*)
        warn "默认路由当前在 TUN 接口 (${IFACE})，属于 Verge TUN 已开启时的正常现象"
        ;;
    "")
        warn "无法检测默认路由接口（网络未连接？），继续部署"
        ;;
    *)
        warn "默认接口是 ${IFACE}（非典型物理网卡），请确认 Verge 接口绑定无误"
        ;;
esac
# 说明：本 fork 的 INFRASTRUCTURE_TAKEOVER=false，不接管 interface-name——
# 该值由 Clash Verge 自己注入/管理，脚本无需（也不该）写入网卡名。
# 若新机器 Clash Verge 里手动设置过「接口绑定」，请核对其与物理网卡一致。

step "4/5 部署到 Verge"
./deploy.sh

[ -f "$VERGE_DATA/profiles/Script.js" ] && ok "Script.js 已就位" || die "部署后未找到 Script.js"
diff -q "$CONFIG_DIR/global_script.js" "$VERGE_DATA/profiles/Script.js" >/dev/null && ok "部署内容与仓库一致" || warn "部署内容与仓库有差异（deploy.sh 有备份机制，可回查）"

step "5/5 验收提示"
cat <<EOF

  自动部署完成。请手动完成最后一步并验收：

  A. 重启 Clash Verge（菜单栏退出 → 重新打开），或 Verge 里「重新应用当前配置」
  B. 确认 Verge 处于「规则模式」（全局模式下规则链整体失效）
  C. 终端验收（Verge 的 API：127.0.0.1:9097，secret 见 Verge 设置；默认 set-your-secret）：
       SECRET=set-your-secret
       # 1) 规则链首位必须是 OrbStack 直连（fork 特征）
       curl -s -H "Authorization: Bearer \$SECRET" http://127.0.0.1:9097/rules | head -c 300
       # 2) 谷歌AI provider 已从 my-proxy-configs 拉到规则
       curl -s -H "Authorization: Bearer \$SECRET" http://127.0.0.1:9097/providers/rules | grep -o "google-ai[^,]*"
       # 3) 实测命中：访问 gemini，链路应含「谷歌AI」组
       curl -s -m 10 -x ${LOCAL_PROXY} https://gemini.google.com -o /dev/null
       curl -s -H "Authorization: Bearer \$SECRET" http://127.0.0.1:9097/connections | grep -o "谷歌AI" | head -1

  D. git 代理：本脚本拉取 my-proxy-configs 时优先尝试 LOCAL_PROXY=${LOCAL_PROXY}，失败则回退直连。
     若新机器 Clash 端口不同，可传入 LOCAL_PROXY=http://127.0.0.1:<端口> 或配置：
       git config --global http.proxy http://127.0.0.1:<你的mixed-port>

  E. 手机端共用规则源（无需部署）：
       https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/clash/google-ai.list

  F. 若新机器不用 OrbStack/VM 固定出口，OrbStack 直连规则命中不了属正常（无此进程），
     其余分流不受影响。

EOF
echo "完成。部署脚本: ${SCRIPT_DIR}；配置: $CONFIG_DIR"
