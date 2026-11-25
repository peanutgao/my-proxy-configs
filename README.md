# my-proxy-configs

个人代理配置仓库：全局分流配置、规则集与客户端 rewrite 脚本。原 `my-scripts` 仓库，2026-11-22 更名并按类型重组。

## 目录

| 路径 | 用途 |
|---|---|
| `global-script/` | Clash Verge 全局脚本配置（fork 自 YaNet）+ dedione 拦截规则 |
| `setup-scripts/` | `deploy.sh` 部署配置到 Verge；`setup-verge-global.sh` 新机一键部署 |
| `rule-sets/` | 按平台分类的规则，详见该目录 README |
| `mobile/` | 手机端懒人配置（Shadowrocket）：Dedione 固定出口，节点靠订阅、规则靠远程、凭据不入库 |
| `rewrite/quantumult/` | Quantumult X 的 YouTube 去广告 + DualSubs 双语字幕 rewrite 脚本 |

## 远程引用

raw URL 前缀：`https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/`

```text
.../rule-sets/clash/google-ai.list
.../rule-sets/clash/Claude.yaml
.../rule-sets/shadowrocket/AI-GPT.list
.../rule-sets/shadowrocket/AI-Google.list
.../rule-sets/shadowrocket/AI-Claude.list
.../mobile/shadowrocket/dedione.conf
.../rewrite/quantumult/youtube_qx_merge/YouTubeAds_DualSubs_Merged.conf
```

旧仓库名 `my-scripts` 由 GitHub 重定向到本仓库；订阅端建议更新为新前缀，避免客户端不跟随重定向。

## 与 MyDedione 的关系

`MyDedione` 是 OrbStack VM 固定出口方案（独立仓库）。宿主机侧「OrbStack Helper 直连」规则由本仓库 `global-script/` 提供；VM 自身的订阅、DNS、出口与防火墙不依赖本仓库。
