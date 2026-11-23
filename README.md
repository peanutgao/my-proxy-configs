# my-proxy-configs

个人代理配置仓库：全局分流脚本、规则集与多端客户端配置。

原 `my-scripts` 仓库，2026-11-22 更名——内容不再限于脚本。

## 目录

| 路径 | 用途 |
|---|---|
| `global-script/` | Clash Verge 全局脚本（fork 自 YaNet）。`deploy.sh` 部署到 Verge；`setup-verge-global.sh` 新机一键部署 |
| `clash-rules/` | mihomo `rule-providers` 使用的 classical text 规则。当前宿主机全局脚本在用 |
| `rule-sets/` | Clash / Surge / Shadowrocket 三端规则集，详见该目录 README |
| `quantumult/` | Quantumult X 的 YouTube 去广告 + DualSubs 双语字幕合并配置 |

## 远程引用

raw URL 前缀：

```text
https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/
```

常用地址：

```text
.../clash-rules/google-ai.list
.../rule-sets/clash/Claude.yaml
.../rule-sets/surge/AI.list
.../rule-sets/shadowrocket/AI.list
.../quantumult/youtube_qx_merge/YouTubeAds_DualSubs_Merged.conf
```

旧仓库名 `my-scripts` 由 GitHub 重定向到本仓库；订阅端仍建议更新为新前缀，避免客户端不跟随重定向。

## 与 MyDedione 的关系

`MyDedione` 是 OrbStack VM 固定出口方案（独立仓库）。宿主机侧「OrbStack Helper 直连」规则由本仓库 `global-script/` 提供；VM 自身的订阅、DNS、出口与防火墙不依赖本仓库。
