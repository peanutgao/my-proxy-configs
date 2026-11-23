# 全局脚本配置（fork 自 YaNet）

Clash Verge Rev 的 `profiles/Script.js` 部署源。上游：[dahaha-365/YaNet](https://github.com/dahaha-365/YaNet/tree/main/Mihomo)。

## 文件

| 文件 | 用途 |
|---|---|
| `global_script.js` | 全局脚本本体：策略组、规则、DNS 与分组重建 |
| `dedione-reject-rules.json` | 拦截规则源（广告 592 条 + 应用净化 1023 条），目标统一 `拒绝` |

## 上游

fork 自 [YaNet / Mihomo](https://github.com/dahaha-365/YaNet/tree/main/Mihomo)，上游订阅：<https://fastly.jsdelivr.net/gh/dahaha-365/YaNet@main/Mihomo/global_script.js>

- 上游 API 默认 `127.0.0.1:9090` / `YaNet`；本 fork 由 Verge 注入端口与密钥，不沿用该值。
- 完整 changelog 与截图见上游仓库，未随本目录保存。

## 与上游的差异

| 项 | 做法 | 原因 |
|---|---|---|
| 网络基础设施 | `INFRASTRUCTURE_TAKEOVER=false`，不接管 `mixed-port` / `external-controller` / `secret` / `tun` / `dns` / `ntp` / `external-ui` | 这些值由 Verge 注入且被依赖：mixed-port 6152 供系统代理与 Revix 下载；TUN utun1024 承载 OrbStack VM 链路 |
| OrbStack 直连 | `PROCESS-PATH,…/OrbStack Helper,直连` 置于规则首位 | 缺这条时 VM 的机场连接被宿主机节点二次代理，健康链 51/74 → 5/74 |
| App Store 组 | `itunes/appldnld/xp.apple.com`、`mzstatic.com` 走按节点名筛选的 `App Store` 组（JP 优先、其次 US） | `availableStoreFronts` 对 CN/HK 出口返回 404；无 JP/US 节点时整体跳过，不留悬空规则 |
| 拦截规则 | 广告 592 + 应用净化 1023，目标 `拒绝`；`category-ads-all` 交给上游 `ads` 服务项 | 不重复 |
| 稳健性 | `rules` 数组每次 `main()` 重置；保留 `dialer-proxy` 引用的原始分组；`直连`/`拒绝` 同名节点去重 | 上游切订阅会累加到 3000+；YaNet 重建分组会让 MyDedione 147 条链的 `中转-*` 组消失，配置校验失败 |

## 部署

**原因**：脚本错误只在真实配置合成时暴露，改完必须做内核校验。

**用法**：

```sh
bash ../setup-scripts/deploy.sh
```

**注意**：Verge 必须处于规则模式，否则规则链整体失效。脚本备份当前 `Script.js` 后写入并校验；部署后需在 Verge 里重新应用配置，验收步骤见工作区 `OPERATIONS.md` 第 3 节。

## 关联

- 规则源：`../rule-sets/clash/google-ai.list`
- 部署脚本：`../setup-scripts/`
- VM 固定出口原理：MyDedione `docs/TECHNICAL-SPEC.md` 第 4 节
