# rule-sets

个人代理分流规则集，按客户端平台分目录。

| 平台 | 目录 | 格式 |
|---|---|---|
| Clash / Mihomo / Clash Verge Rev | `clash/` | `payload:` YAML + 1 个 classical text |
| Surge | `surge/` | classical text（`.list`） |
| Shadowrocket | `shadowrocket/` | classical text（`.list`） |

## Clash 目录的两种格式

- `clash/google-ai.list`：classical text，供 mihomo `rule-providers` 使用，覆盖 Gemini / Antigravity / AI Studio / DeepMind。当前宿主机全局脚本在用。
- `clash/{AI,Claude,Gemini,OpenAI,Ozon}.yaml`：`payload:` YAML，供多端规则集订阅使用。

两种格式不能直接互换。

## 远程引用

raw URL 前缀：`https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/rule-sets/`

```text
.../clash/google-ai.list
.../clash/Claude.yaml
.../shadowrocket/AI-GPT.list
.../shadowrocket/AI-Google.list
.../shadowrocket/AI-Claude.list
```

AI 规则已按用途拆为 `shadowrocket/AI-{GPT,Google,Claude}.list`（原聚合 `AI.list` 已删除）。

原 `peanutgao/rule-sets` 仓库内容已并入本目录；若仍有配置引用 `raw.githubusercontent.com/peanutgao/rule-sets/main/...`，须换成上面的前缀。
