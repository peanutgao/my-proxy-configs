# Verge 全局脚本（fork 自 YaNet）

托管 Clash Verge Rev 的 `profiles/Script.js`。上游：[dahaha-365/YaNet](https://github.com/dahaha-365/YaNet/tree/main/Mihomo)。

## 与上游的差异

1. **不接管网络基础设施**（`INFRASTRUCTURE_TAKEOVER = false`）
   上游会覆盖 `mixed-port` / `external-controller` / `secret` / `tun` / `dns` / `ntp` /
   `external-ui`。本机这些值由 Clash Verge 注入且被依赖（mixed-port 6152 供系统代理与
   Revix 下载；TUN utun1024 承载 OrbStack VM 的链路），因此交回 Verge。

2. **OrbStack 外层隧道直连**：`PROCESS-PATH,…/OrbStack Helper,直连` 置于规则首位。
   缺这条时 VM 的机场连接会被宿主机节点二次代理，实测健康链 51/74 → 5/74。

3. **App Store 专用组**：`itunes/appldnld/xp.apple.com`、`mzstatic.com` 走按节点名
   动态筛选的 `App Store` 组（日本优先、其次美国）。背景：`availableStoreFronts`
   对 CN/HK 出口返回 404，只有 JP/US 返回 200。无 JP/US 节点时整体跳过，不留悬空规则。

4. **dedione 拦截规则**：迁移广告拦截 592 条 + 应用净化 1023 条，目标统一为 `拒绝`。
   `category-ads-all` 交由上游 `ads` 服务项，不重复。

5. **两处稳健性修复**：
   - `rules` 数组在每次 `main()` 调用时重置（上游是模块级数组，切订阅会累加到 3000+）。
   - 保留被 `dialer-proxy` 引用的原始分组（MyDedione 有 147 条链指向 `中转-*` 组，
     YaNet 重建分组会让它们消失、配置直接校验失败）；`直连`/`拒绝` 同名节点先去重。

## 部署

```sh
./deploy.sh          # 复制到 Verge 并校验
```

改完务必跑一次部署脚本里的 `mihomo -t`：脚本错误只在真实配置合成时暴露。
