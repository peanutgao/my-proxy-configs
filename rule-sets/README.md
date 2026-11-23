# rule-sets

个人使用的代理分流规则集，随 `my-proxy-configs` 仓库维护。

支持：

- Clash / Mihomo / Clash Verge Rev
- Surge
- Shadowrocket

## 目录结构

```text
rule-sets/
├── README.md
├── clash/
│   ├── AI.yaml
│   ├── Claude.yaml
│   ├── Gemini.yaml
│   ├── OpenAI.yaml
│   └── Ozon.yaml
├── surge/
│   ├── AI.list
│   ├── Claude.list
│   ├── Gemini.list
│   ├── OpenAI.list
│   └── Ozon.list
└── shadowrocket/
    ├── AI.list
    ├── Claude.list
    ├── Gemini.list
    ├── OpenAI.list
    └── Ozon.list
```

## 远程引用

raw URL 前缀：

```text
https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/
```

示例：

```text
https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/clash/Claude.yaml
https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/surge/AI.list
https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/shadowrocket/AI.list
```

原 `peanutgao/rule-sets` 仓库内容已并入本目录。若还有配置引用 `raw.githubusercontent.com/peanutgao/rule-sets/main/...`，须把前缀改为上面的地址，否则旧仓库下线后会断链。

## 与 clash-rules/ 的区别

- `clash-rules/google-ai.list`：classical text 格式，供 mihomo `rule-providers` 使用，覆盖 Gemini / Antigravity / AI Studio / DeepMind。当前宿主机全局脚本在用。
- `rule-sets/clash/*.yaml`：`payload:` YAML 格式，供多端规则集订阅使用，按 Claude / Gemini / OpenAI / Ozon 及 AI 合集分开。两种格式不能直接互换。
