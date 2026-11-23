#!/bin/bash
# bootstrap.sh —— 新机一键引导
#
# 用法（新机，任意目录）：
#   curl -fsSL https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/bootstrap.sh | bash -s
#   curl -fsSL https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/bootstrap.sh | bash -s -- <目标目录>
# 本地已克隆时：
#   bash bootstrap.sh [目标目录]      # 默认 $PWD/proxy-env
#
# 做什么：
#   1. 检查前置（git / OrbStack / Clash Verge / Ruby / PyYAML）
#   2. 克隆或更新两个仓库到目标目录
#   3. 检查凭据（缺失则中止，需手动从旧机复制）
#   4. 依次部署宿主机全局脚本与 VM 固定出口
#   5. 打印验收命令与手机端订阅地址
#
# 不做什么：
#   - 不安装 OrbStack / Clash Verge（请先自行安装并导入订阅）
#   - 不生成或传输凭据（private-config.json 需从旧机带）
#   - 不创建 VM（需先 orb start 创建）

set -euo pipefail

WORKDIR="${1:-$PWD/proxy-env}"
VM_NAME="${VM_NAME:-claude-official}"
REPO_MYPROXY="https://github.com/peanutgao/my-proxy-configs.git"
REPO_MD="https://github.com/peanutgao/MyDedione.git"

step() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m  ⚠ %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m  ✗ %s\033[0m\n' "$*" >&2; exit 1; }

clone_or_update() {
    name="$1"; url="$2"; dir="$WORKDIR/$name"
    if [ -d "$dir/.git" ]; then
        (cd "$dir" && git pull --ff-only 2>/dev/null) || warn "$name 更新失败，使用本地现有版本"
        ok "$name 已更新"
    else
        [ -e "$dir" ] && die "$dir 已存在但不是 git 仓库，请换目标目录"
        git clone "$url" "$dir" || die "克隆 $name 失败（网络/权限）"
        ok "$name 已克隆"
    fi
}

step "1/5 检查前置"
command -v git   >/dev/null || die "未安装 git"
command -v orb   >/dev/null || die "未安装 OrbStack（orb 命令不存在）"
[ -d "/Applications/Clash Verge.app" ] || die "未安装 Clash Verge Rev"
command -v ruby  >/dev/null || die "未安装 Ruby"
python3 -c 'import yaml' 2>/dev/null || die "Python3 缺 PyYAML：python3 -m pip install --user pyyaml"
ok "前置就绪"

step "2/5 准备目录"
mkdir -p "$WORKDIR"
cd "$WORKDIR"
ok "目标目录: $WORKDIR"

step "3/5 获取仓库"
clone_or_update my-proxy-configs "$REPO_MYPROXY"
clone_or_update MyDedione "$REPO_MD"

step "4/5 检查凭据"
CRED="$WORKDIR/MyDedione/private/private-config.json"
if [ ! -f "$CRED" ]; then
    warn "缺少凭据：$CRED"
    echo "  仓库内有模板 private/private-config.example.json，复制后按注释填写："
    echo "    cp \"$WORKDIR/MyDedione/private/private-config.example.json\" \"$CRED\""
    echo "  需要填：vps.server / vps.password、airports 的 url 与 file（file 为本机 Verge profiles 里的 yaml 文件名）。"
    echo "  机场订阅需先在 Clash Verge 里导入；填好后重新运行："
    echo "    bash \"$WORKDIR/my-proxy-configs/bootstrap.sh\" \"$WORKDIR\""
    exit 1
fi
[ "$(stat -f %Lp "$CRED")" = "-rw-------" ] || chmod 600 "$CRED"
ok "凭据就位（600）"

step "5/5 部署"
warn "确认 Clash Verge 已导入订阅且处于规则模式，目标 VM '$VM_NAME' 已创建。"
printf "继续？[y/N] "
read -r ans </dev/tty || ans=""
[ "$ans" = "y" ] || die "已取消；准备好后重新运行 bash \"$WORKDIR/my-proxy-configs/bootstrap.sh\" \"$WORKDIR\""

bash "$WORKDIR/my-proxy-configs/setup-scripts/setup-verge-global.sh"
bash "$WORKDIR/MyDedione/scripts/setup-vm-direct.sh" "$VM_NAME"

cat <<EOF

────────────────────────────────────────
部署完成。验收：

  orb -m $VM_NAME -u root python3 /usr/local/libexec/check-dedione-egress.py
  # TCP/UDP/DNS 出口应全为 188.255.157.121；等 30-60 秒后跑

  SECRET=<Verge 设置里的 secret>
  curl -s -H "Authorization: Bearer \$SECRET" http://127.0.0.1:9097/rules | head -c 300
  # 首条必须是 PROCESS-PATH,…/OrbStack Helper,直连

手机端订阅：
  https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/clash/Claude.yaml
  https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/clash/Gemini.yaml
  https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/surge/AI.list
  https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/shadowrocket/AI.list
  https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rewrite/quantumult/youtube_qx_merge/YouTubeAds_DualSubs_Merged.conf
────────────────────────────────────────
EOF
