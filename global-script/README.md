# 全局脚本配置（fork 自 YaNet）

Clash Verge Rev 的 `profiles/Script.js` 部署源。上游：[dahaha-365/YaNet](https://github.com/dahaha-365/YaNet/tree/main/Mihomo)。

## 文件

| 文件 | 用途 |
|---|---|
| `global_script.js` | 全局脚本本体：策略组、规则、DNS 与分组重建 |
| `dedione-reject-rules.json` | 拦截规则备份清单（广告 590 条 + 应用净化 1021 条，与 `global_script.js` 内联数组同步） |

## 上游

fork 自 [YaNet / Mihomo](https://github.com/dahaha-365/YaNet/tree/main/Mihomo)，上游订阅：<https://fastly.jsdelivr.net/gh/dahaha-365/YaNet@main/Mihomo/global_script.js>

- 上游 API 默认 `127.0.0.1:9090` / `YaNet`；本 fork 由 Verge 注入端口与密钥，不沿用该值。
- 完整 changelog 与截图见上游仓库，未随本目录保存。

## 与上游的差异

| 项 | 做法 | 原因 |
|---|---|---|
| 网络基础设施 | `INFRASTRUCTURE_TAKEOVER=false`，不接管 `mixed-port` / `external-controller` / `secret` / `tun` / `dns` / `ntp` / `external-ui` | 这些值由 Verge 注入且被依赖：mixed-port 6152 供系统代理与 Revix 下载；TUN utun1024 承载 OrbStack VM 链路 |
| OrbStack 直连 | `PROCESS-PATH,…/OrbStack Helper,直连` 置于规则首位 | 缺这条时 VM 的机场连接被宿主机节点二次代理，健康链 51/74 → 5/74 |
| 谷歌AI 独立组 | `googleai` 排在 `openai` / `google` 之前，默认第一项为 `US美国`（若订阅含美国节点） | Gemini / Antigravity 对非美出口限制最多，且避免被 `category-ai-!cn` / `GEOSITE,google` 提前命中 |
| App Store 组 | `itunes/appldnld/xp.apple.com`、`mzstatic.com`、`aaplimg.com` 走 `App Store` select 组（默认 `直连`，保留 JP/US IEPL 节点供手动切换） | 代理出口切换会打断 Apple 下载会话导致 403/404/EOF；默认直连保稳定，特殊情况可手动切专线 |
| 拦截规则 | 广告 590 + 应用净化 1021，目标 `拒绝`；`category-ads-all` 交给上游 `ads` 服务项 | 去重与清理无效后缀后与 `dedione-reject-rules.json` 保持同步 |
| 稳健性 | `rules` 与 `ruleProviders` 每次 `main()` 独立重置；先剥离 `直连`/`拒绝` 再做地区分类；保留 `dialer-proxy` 引用的原始分组 | 避免切订阅规则累加、`直连` 混入 `其他节点`、以及 YaNet 重建分组导致 MyDedione `中转-*` 消失 |

## 部署

**原因**：脚本错误只在真实配置合成时暴露，改完必须做语法与内核校验。

**用法**：

```sh
bash ../setup-scripts/deploy.sh
```

**注意**：Verge 必须处于规则模式，否则规则链整体失效。`deploy.sh` 会先做 Node.js 语法校验与 `verge-mihomo -t` 合成校验，通过后备份当前 `Script.js` 再写入；部署后需在 Verge 里重新应用配置，验收步骤见工作区 `OPERATIONS.md` 第 2 节。

## 关联

- 规则源：`../rule-sets/clash/google-ai.list`
- 部署脚本：`../setup-scripts/`
- VM 固定出口原理：MyDedione `docs/TECHNICAL-SPEC.md` 第 4 节
