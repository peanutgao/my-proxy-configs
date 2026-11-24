#!/bin/bash
# setup-verge-global.sh —— 新 Mac 上一键部署 Clash Verge 全局分流脚本（global-script）
#
# 做什么：
#   1. 检查依赖（Clash Verge Rev 是否安装/运行，Node.js 是否可用）并自动读取 Verge 端口/控制器配置
#   2. 更新 my-proxy-configs 仓库（代理优先，失败自动回退直连）
#   3. 检测默认路由接口并检查 Verge 全局扩展脚本开关
#   4. deploy.sh 部署到 Verge（含 JS 语法与 verge-mihomo -t 内核校验）
#   5. 自动重载 Verge、切回规则模式并执行宿主机 3 项验收
#
# 用法：
#   bash setup-verge-global.sh
#   LOCAL_PROXY=http://127.0.0.1:7897 bash setup-verge-global.sh
#   NO_RESTART_VERGE=1 bash setup-verge-global.sh   # 跳过自动重启 Verge
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
if [ -z "${VERGE_DATA:-}" ]; then
    for d in "$HOME/Library/Application Support/"*clash-verge* "$HOME/Library/Application Support/"*verge*; do
        if [ -d "$d" ] && [ -f "$d/verge.yaml" ]; then VERGE_DATA="$d"; break; fi
    done
fi
VERGE_DATA="${VERGE_DATA:-$HOME/Library/Application Support/io.github.clash-verge-rev.clash-verge-rev}"
USER_LOCAL_PROXY="${LOCAL_PROXY:-}"

progress_bar() {
    local cur="$1" tot="$2" label="$3" width="${4:-20}"
    local pct=$(( cur * 100 / tot ))
    local filled=$(( cur * width / tot ))
    local empty=$(( width - filled ))
    local bar="" i=0
    while [ "$i" -lt "$filled" ]; do bar="${bar}█"; i=$((i + 1)); done
    i=0
    while [ "$i" -lt "$empty" ]; do bar="${bar}░"; i=$((i + 1)); done
    printf '\n\033[1;34m[%s] %3d%% (%s/%s) %s\033[0m\n' "$bar" "$pct" "$cur" "$tot" "$label"
}

progress_inline() {
    local cur="$1" tot="$2" label="$3" width="${4:-20}"
    local pct=$(( cur * 100 / tot ))
    local filled=$(( cur * width / tot ))
    local empty=$(( width - filled ))
    local bar="" i=0
    while [ "$i" -lt "$filled" ]; do bar="${bar}█"; i=$((i + 1)); done
    i=0
    while [ "$i" -lt "$empty" ]; do bar="${bar}░"; i=$((i + 1)); done
    if [ -t 1 ]; then
        printf '\r\033[K\033[0;36m  [%s] %3d%% %s\033[0m' "$bar" "$pct" "$label"
    else
        printf '  [%s] %3d%% %s\n' "$bar" "$pct" "$label"
    fi
}

run_with_spinner() {
    local label="$1"; shift
    local log
    log=$(mktemp "${TMPDIR:-/tmp}/verge-spin.XXXXXX")
    if [ ! -t 1 ]; then
        printf '  → %s…\n' "$label"
        if "$@" >"$log" 2>&1; then
            rm -f "$log"; return 0
        else
            local rc=$?; cat "$log" >&2; rm -f "$log"; return "$rc"
        fi
    fi
    "$@" >"$log" 2>&1 &
    local pid=$!
    local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    local idx=0 start_ts
    start_ts=$(date +%s)
    while kill -0 "$pid" 2>/dev/null; do
        local elapsed=$(( $(date +%s) - start_ts ))
        printf '\r\033[K\033[0;36m  %s %s (%ds)\033[0m' "${frames[$idx]}" "$label" "$elapsed"
        idx=$(( (idx + 1) % 10 ))
        sleep 0.15
    done
    local rc=0
    wait "$pid" || rc=$?
    local elapsed=$(( $(date +%s) - start_ts ))
    if [ "$rc" -eq 0 ]; then
        printf '\r\033[K\033[1;32m  ✓ %s (%ds)\033[0m\n' "$label" "$elapsed"
    else
        printf '\r\033[K\033[1;31m  ✗ %s 失败 (%ds)\033[0m\n' "$label" "$elapsed" >&2
        cat "$log" >&2
    fi
    rm -f "$log"
    return "$rc"
}

step() { progress_bar "$1" "$2" "$3"; }
ok()   { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m  ⚠ %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m  ✗ %s\033[0m\n' "$*" >&2; exit 1; }

read_verge_meta() {
    VERGE_DATA="$VERGE_DATA" python3 - <<'PY'
import os, pathlib, re, shlex

vd = pathlib.Path(os.environ['VERGE_DATA'])

def scalar(path, key):
    if not path.is_file():
        return ''
    for line in path.read_text(encoding='utf-8', errors='replace').splitlines():
        m = re.match(rf'^{re.escape(key)}\s*:\s*(.*)$', line)
        if m:
            val = m.group(1).strip()
            if len(val) >= 2 and val[0] == val[-1] and val[0] in ("'", '"'):
                val = val[1:-1]
            return val
    return ''

mixed_port = (
    scalar(vd / 'verge.yaml', 'verge_mixed_port')
    or scalar(vd / 'clash-verge.yaml', 'mixed-port')
    or scalar(vd / 'config.yaml', 'mixed-port')
    or '6152'
)
ctrl = scalar(vd / 'config.yaml', 'external-controller') or '127.0.0.1:9097'
if ctrl.startswith(':'):
    ctrl = '127.0.0.1' + ctrl
elif ctrl.startswith('0.0.0.0:'):
    ctrl = '127.0.0.1:' + ctrl.split(':', 1)[1]
secret = scalar(vd / 'config.yaml', 'secret') or scalar(vd / 'clash-verge.yaml', 'secret')
unix_sock = scalar(vd / 'clash-verge.yaml', 'external-controller-unix')
builtin_enh = scalar(vd / 'verge.yaml', 'enable_builtin_enhanced')
cur_profile = scalar(vd / 'profiles.yaml', 'current')
if cur_profile.lower() in ('null', '~'):
    cur_profile = ''

for k, v in (
    ('VERGE_MIXED_PORT', mixed_port),
    ('VERGE_CTRL_ADDR', ctrl),
    ('VERGE_CTRL_SECRET', secret),
    ('VERGE_UNIX_SOCK', unix_sock),
    ('VERGE_BUILTIN_ENHANCED', builtin_enh),
    ('VERGE_CURRENT_PROFILE', cur_profile),
):
    print(f'{k}={shlex.quote(v)}')
PY
}

verge_api() {
    local method="$1" path="$2" body="${3:-}"
    local svc_sock="/var/run/clash-verge-service/users/$(id -u)/verge-mihomo.sock"
    local sock=""
    if [ -S "$svc_sock" ] && [ -r "$svc_sock" ]; then
        sock="$svc_sock"
    elif [ -n "${VERGE_UNIX_SOCK:-}" ] && [ -S "$VERGE_UNIX_SOCK" ] && [ -r "$VERGE_UNIX_SOCK" ]; then
        sock="$VERGE_UNIX_SOCK"
    fi

    local auth_args=()
    [ -n "${VERGE_CTRL_SECRET:-}" ] && auth_args=(-H "Authorization: Bearer ${VERGE_CTRL_SECRET}")
    local data_args=()
    [ -n "$body" ] && data_args=(-H "Content-Type: application/json" -d "$body")

    if [ -n "$sock" ]; then
        curl -fsS --noproxy '*' --max-time 5 --unix-socket "$sock" -X "$method" \
            ${auth_args[@]+"${auth_args[@]}"} ${data_args[@]+"${data_args[@]}"} \
            "http://localhost${path}" 2>/dev/null && return 0
    fi
    if [ -n "${VERGE_CTRL_ADDR:-}" ]; then
        curl -fsS --noproxy '*' --max-time 5 -X "$method" \
            ${auth_args[@]+"${auth_args[@]}"} ${data_args[@]+"${data_args[@]}"} \
            "http://${VERGE_CTRL_ADDR}${path}" 2>/dev/null && return 0
    fi
    return 1
}

step 1 5 "宿主机：检查依赖与读取 Verge 配置"
[ -d "$VERGE_APP" ] || die "未找到 Clash Verge（${VERGE_APP}）。请先安装 Clash Verge Rev 并导入订阅后再运行本脚本。"
ok "Clash Verge 已安装"
command -v node >/dev/null 2>&1 || die "未安装 Node.js（deploy.sh 语法与合成校验需要）。"
ok "Node.js 就绪"

if ! pgrep -f "MacOS/clash-verge" >/dev/null 2>&1; then
    warn "Clash Verge 未在运行，正在启动…"
    open -a "Clash Verge"
    for i in $(seq 1 8); do
        progress_inline "$i" 8 "等待 Clash Verge 启动 (${i}s/8s)"
        pgrep -f "MacOS/clash-verge" >/dev/null 2>&1 && break
        sleep 1
    done
    [ -t 1 ] && printf '\r\033[K'
    pgrep -f "MacOS/clash-verge" >/dev/null 2>&1 || die "Clash Verge 启动失败，请手动打开后重试。"
fi
ok "Clash Verge 运行中"

eval "$(read_verge_meta)"
LOCAL_PROXY="${USER_LOCAL_PROXY:-http://127.0.0.1:${VERGE_MIXED_PORT}}"
ok "已识别 Verge 代理端口: ${VERGE_MIXED_PORT}（LOCAL_PROXY=${LOCAL_PROXY}）"
if [ "$VERGE_BUILTIN_ENHANCED" = "false" ]; then
    warn "检测到 verge.yaml 中 enable_builtin_enhanced=false，请在 Verge 设置中开启「全局扩展脚本」否则 Script.js 不会生效"
fi
if [ -z "${VERGE_CURRENT_PROFILE:-}" ]; then
    warn "检测到 profiles.yaml 中未选中订阅（current 为空），请在 Clash Verge 中先选择一个订阅"
fi

step 2 5 "宿主机：更新 my-proxy-configs 仓库"
cd "$REPO_DIR"
if run_with_spinner "通过代理拉取 my-proxy-configs" git -c http.proxy="$LOCAL_PROXY" pull --ff-only origin main; then
    :
elif run_with_spinner "直连拉取 my-proxy-configs" git pull --ff-only origin main; then
    :
else
    warn "仓库更新失败，使用本地现有版本继续: ${REPO_DIR}"
fi
[ -f "$SCRIPT_DIR/deploy.sh" ] || die "未找到 $SCRIPT_DIR/deploy.sh"
[ -f "$CONFIG_DIR/global_script.js" ] || die "未找到 $CONFIG_DIR/global_script.js"
cd "$SCRIPT_DIR"

step 3 5 "宿主机：检测默认路由接口"
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

step 4 5 "宿主机：校验并部署 Script.js 到 Verge"
SCRIPT_CHANGED=1
if [ -f "$VERGE_DATA/profiles/Script.js" ] && diff -q "$CONFIG_DIR/global_script.js" "$VERGE_DATA/profiles/Script.js" >/dev/null 2>&1; then
    SCRIPT_CHANGED=0
fi

run_with_spinner "JS 语法与 verge-mihomo 内核校验并写入 Script.js" ./deploy.sh

[ -f "$VERGE_DATA/profiles/Script.js" ] && ok "Script.js 已就位" || die "部署后未找到 Script.js"
diff -q "$CONFIG_DIR/global_script.js" "$VERGE_DATA/profiles/Script.js" >/dev/null && ok "部署内容与仓库一致" || warn "部署内容与仓库有差异（deploy.sh 有备份机制，可回查）"

step 5 5 "宿主机：自动重载与验收"
NEED_RESTART="$SCRIPT_CHANGED"
if [ "${FORCE_RESTART_VERGE:-0}" = "1" ]; then
    NEED_RESTART=1
fi
if [ "$NEED_RESTART" = "0" ] && verge_api GET /configs >/dev/null; then
    FIRST_LIVE=$(verge_api GET /rules | python3 -c 'import json,sys; r=json.load(sys.stdin).get("rules") or []; print((r[0].get("payload","") + "," + r[0].get("proxy","")) if r else "")' 2>/dev/null || true)
    GAI_LIVE=$(verge_api GET /providers/rules | python3 -c 'import json,sys; p=(json.load(sys.stdin).get("providers") or {}).get("google-ai"); print("1" if p is not None else "")' 2>/dev/null || true)
    if [[ "$FIRST_LIVE" != *"OrbStack Helper"* ]] || [ -z "$GAI_LIVE" ]; then
        NEED_RESTART=1
    fi
fi

if [ "$NEED_RESTART" = "1" ] && [ "${NO_RESTART_VERGE:-0}" != "1" ]; then
    BEFORE_MTIME=$(stat -f %m "$VERGE_DATA/clash-verge.yaml" 2>/dev/null || echo 0)
    osascript -e 'quit app "Clash Verge"' >/dev/null 2>&1 || true
    for i in $(seq 1 8); do
        progress_inline "$i" 28 "正在退出旧 Clash Verge (${i}s)"
        pgrep -f "MacOS/clash-verge" >/dev/null 2>&1 || break
        sleep 1
    done
    open -a "Clash Verge"
    for i in $(seq 1 20); do
        progress_inline "$((8 + i))" 28 "等待 Clash Verge 重载配置 (${i}s/20s)"
        if pgrep -f "MacOS/clash-verge" >/dev/null 2>&1; then
            eval "$(read_verge_meta)"
            if verge_api GET /configs >/dev/null; then
                if [ "$VERGE_BUILTIN_ENHANCED" = "false" ] || [ -z "${VERGE_CURRENT_PROFILE:-}" ]; then
                    break
                fi
                AFTER_MTIME=$(stat -f %m "$VERGE_DATA/clash-verge.yaml" 2>/dev/null || echo 0)
                if [ "$AFTER_MTIME" != "$BEFORE_MTIME" ] || [ "$i" -ge 3 ]; then
                    LIVE_R0=$(verge_api GET /rules | python3 -c 'import json,sys; r=json.load(sys.stdin).get("rules") or []; print(r[0].get("payload","") if r else "")' 2>/dev/null || true)
                    LIVE_GAI=$(verge_api GET /providers/rules | python3 -c 'import json,sys; p=(json.load(sys.stdin).get("providers") or {}).get("google-ai"); print("1" if p is not None else "")' 2>/dev/null || true)
                    if [[ "$LIVE_R0" == *"OrbStack Helper"* ]] && [ -n "$LIVE_GAI" ]; then
                        break
                    fi
                fi
            fi
        fi
        sleep 1
    done
    [ -t 1 ] && printf '\r\033[K'
    ok "Clash Verge 已重启加载配置"
elif [ "$NEED_RESTART" = "0" ]; then
    ok "Script.js 未变更且当前规则已就位，无需重启 Clash Verge"
else
    warn "NO_RESTART_VERGE=1：已跳过自动重启，请手动在 Verge 里「重新应用当前配置」"
fi

eval "$(read_verge_meta)"
LOCAL_PROXY="${USER_LOCAL_PROXY:-http://127.0.0.1:${VERGE_MIXED_PORT}}"

if CFG_JSON=$(verge_api GET /configs); then
    if [ -z "$USER_LOCAL_PROXY" ]; then
        # 只认 mixed-port：/configs 里的 port 是 Verge 的 HTTP 代理端口（verge_port，
        # 常见 7891），语义不同，用它覆盖会把混合端口误判成 7891（而 OrbStack 也占
        # 宿主机 7890，容易混淆）。取不到就保留从 verge.yaml 读到的 verge_mixed_port。
        LIVE_PORT=$(printf '%s' "$CFG_JSON" | python3 -c 'import json,sys; p=(json.load(sys.stdin).get("mixed-port") or 0); print(p if int(p) > 0 else "")' 2>/dev/null || true)
        if [ -n "$LIVE_PORT" ]; then
            VERGE_MIXED_PORT="$LIVE_PORT"
            LOCAL_PROXY="http://127.0.0.1:${VERGE_MIXED_PORT}"
        fi
    fi

    CUR_MODE=$(printf '%s' "$CFG_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("mode",""))' 2>/dev/null || true)
    if [ "$CUR_MODE" != "rule" ]; then
        warn "当前 Verge 模式为 '${CUR_MODE}'，正在自动切换为规则模式 (rule)…"
        if verge_api PATCH /configs '{"mode":"rule"}' >/dev/null; then
            ok "已自动切换为规则模式 (rule)"
        else
            warn "自动切换规则模式失败，请在 Verge 面板手动切到「规则模式」"
        fi
    else
        ok "Verge 运行模式: rule（规则模式）"
    fi

    RULE0=$(verge_api GET /rules | python3 -c 'import json,sys; r=json.load(sys.stdin).get("rules") or []; print(",".join(str(r[0].get(k,"")) for k in ("type","payload","proxy")) if r else "")' 2>/dev/null || true)
    if [[ "$RULE0" == *"OrbStack Helper"* && ( "$RULE0" == *",直连" || "$RULE0" == *",DIRECT" ) ]]; then
        ok "首条规则已生效: ${RULE0}"
    else
        warn "首条规则未命中 OrbStack 直连（实际: ${RULE0:-空}），请确认 Verge 已选中订阅且启用全局扩展脚本"
    fi

    GAI_COUNT=$(verge_api GET /providers/rules | python3 -c 'import json,sys; p=(json.load(sys.stdin).get("providers") or {}).get("google-ai"); print(p.get("ruleCount","") if p else "")' 2>/dev/null || true)
    if [ -n "$GAI_COUNT" ]; then
        ok "google-ai 规则集已加载（${GAI_COUNT} 条规则）"
    else
        warn "未在运行中检测到 google-ai provider（若首次加载可稍等几秒或在 Verge 中刷新规则集）"
    fi
else
    if [ -f "$VERGE_DATA/clash-verge.yaml" ]; then
        VERGE_DATA="$VERGE_DATA" python3 - <<'PY'
import os, pathlib, re
text = (pathlib.Path(os.environ['VERGE_DATA']) / 'clash-verge.yaml').read_text(encoding='utf-8', errors='replace')
m_mode = re.search(r'^mode:\s*(\S+)', text, re.M)
mode = m_mode.group(1) if m_mode else 'unknown'
has_orb = 'OrbStack Helper,直连' in text or 'OrbStack Helper,DIRECT' in text
has_gai = 'google-ai:' in text
print(f'  {"✓" if mode == "rule" else "⚠"} clash-verge.yaml mode={mode}')
print(f'  {"✓" if has_orb else "⚠"} clash-verge.yaml 含 OrbStack Helper 直连规则={has_orb}')
print(f'  {"✓" if has_gai else "⚠"} clash-verge.yaml 含 google-ai provider={has_gai}')
PY
    else
        warn "未能连接 Verge 控制器且未找到 clash-verge.yaml，请确认 Verge 已导入并选中订阅后在界面点「重新应用」"
    fi
fi

if run_with_spinner "探访 gemini.google.com（经 ${LOCAL_PROXY}）" curl -fsS -m 10 -x "$LOCAL_PROXY" https://gemini.google.com -o /dev/null; then
    :
else
    warn "经 ${LOCAL_PROXY} 探访 gemini.google.com 超时（若尚未选中可用节点属正常）"
fi

echo ""
echo "手机端共用规则源（无需部署）："
echo "  https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/clash/google-ai.list"
echo "完成。部署脚本: ${SCRIPT_DIR}；配置: ${CONFIG_DIR}"
