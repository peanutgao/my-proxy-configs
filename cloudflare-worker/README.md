# Gemini Cloudflare Worker 反代

`FAILED_PRECONDITION: User location is not supported` 的根因是 Google 对出口
IP（188.255.157.121，RIPE 注册国塞尔维亚）按注册地判定，不在 Gemini API 支持
地区。本 Worker 反代把 API 请求经 Cloudflare 边缘转发到 Google，绕开出口 IP
地理判定。

## 文件

- `gemini-proxy.js` — Worker 代码（透明反代，不碰 key，支持流式）
- `wrangler.toml` — wrangler 部署清单

## 部署方式 A：Dashboard 上传（单文件直传，最简单）

Workers & Pages → Create application → Create Worker → Deploy → Edit code →
粘贴 `gemini-proxy.js` 全文 → Deploy。
（注：如果通过「Upload assets」上传目录会提示需要 wrangler——单文件代码用
「Edit code 粘贴」或下面的 wrangler 均可。）

## 部署方式 B：wrangler CLI（推荐）

```bash
cd my-proxy-configs/cloudflare-worker
npx wrangler login        # 首次会打开浏览器授权
npx wrangler deploy
```

成功输出里会有：

```
Uploaded gemini-proxy (x.x sec)
Published gemini-proxy (x.xx sec)
  https://gemini-proxy.<你的子域>.workers.dev
```

## 验证

```bash
curl "https://gemini-proxy.<你的子域>.workers.dev/"
# 应返回: Gemini reverse proxy is running.
```

## 配置接入（部署后告诉我域名）

拿到 workers.dev 域名后，需要改两处（由维护者操作）：

1. `my-proxy-configs/rule-sets/clash/google-ai.list` 增加：
   `DOMAIN-SUFFIX,<你的子域>.workers.dev`
2. 应用侧把 base URL 指向 `https://gemini-proxy.<你的子域>.workers.dev/v1beta`
   （或保持 `generativelanguage.googleapis.com` 不变、由配置把该域名 DNS+TLS
   劫持到 Worker——需要自定义域名方案）

注意：`workers.dev` 域名在国内可能被墙；若直连不通，分流规则会把它交给
代理出口（任意出口都行——Worker 在 Cloudflare 边缘，出口 IP 无关紧要）。

