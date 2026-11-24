// Google AI 多端点反代 —— 部署到 Cloudflare Worker
//
// 作用：generativelanguage / aicode 等 googleapis.com 端点对 IP 地理有限制
// （出口 IP 被 Google 判为非支持地区时返回 FAILED_PRECONDITION /
// PERMISSION_DENIED "Detected location: CN"）。本 Worker 把请求按域名前缀
// 路由转发到对应 Google 上游；Cloudflare Worker 出口走 Google/Cloudflare
// 边缘网络，不受本地出口 IP 地理影响。
//
// 路由：路径第一段 = 上游别名：
//   /gemini/<path> → https://generativelanguage.googleapis.com/<path>
//   /aicode/<path> → https://aicode.googleapis.com/<path>
//   /cloudcode/<path> → https://cloudcode-pa.googleapis.com/<path>
//   /daily-cloudcode/<path> → https://daily-cloudcode-pa.googleapis.com/<path>
// 兼容：无前缀路径 → generativelanguage（v1beta 等）。
//
// 安全：纯透明反代，不存储、不记录、不改写 Authorization / x-goog-api-key。
// 请求体透传，支持 GET/POST/流式响应。
//
// 部署：npx wrangler deploy（见同目录 wrangler.toml / deploy.sh）

const UPSTREAMS = {
  gemini: 'https://generativelanguage.googleapis.com',
  aicode: 'https://aicode.googleapis.com',
  cloudcode: 'https://cloudcode-pa.googleapis.com',
  'daily-cloudcode': 'https://daily-cloudcode-pa.googleapis.com',
};
const DEFAULT_ALIAS = 'gemini';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 解析 /<alias>/<path>；未知首段按 DEFAULT_ALIAS 处理（v1beta 等直连）
    let alias = DEFAULT_ALIAS;
    let rest = url.pathname;
    const seg = rest.split('/')[1];
    if (seg && UPSTREAMS[seg]) {
      alias = seg;
      rest = rest.slice(seg.length + 1); // 去掉 /<alias>
    }

    if (rest === '/' || rest === '') {
      const list = Object.keys(UPSTREAMS)
        .map((k) => `/${k}/<path> → ${UPSTREAMS[k]}`)
        .join('\n');
      return new Response(
        `Google AI reverse proxy is running.\nUsage:\n${list}\n(no prefix → ${UPSTREAMS[DEFAULT_ALIAS]})\n`,
        { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8' } }
      );
    }

    const upstream = new URL(rest + url.search, UPSTREAMS[alias]);

    const headers = new Headers(request.headers);
    // Worker 自身的 cf 头与 Host 必须交给 fetch 重算，保留鉴权与内容头
    headers.delete('host');
    headers.delete('cf-connecting-ip');
    headers.delete('cf-ipcountry');
    headers.delete('cf-ray');
    headers.delete('cf-visitor');
    headers.delete('x-forwarded-for');
    headers.delete('x-forwarded-proto');
    headers.delete('x-real-ip');

    const init = {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
    };

    const resp = await fetch(upstream.toString(), init);

    const respHeaders = new Headers(resp.headers);
    // 去掉可能干扰客户端的传输头，保留 CORS 以便浏览器端直连使用
    respHeaders.delete('content-encoding');
    respHeaders.delete('content-length');
    respHeaders.delete('transfer-encoding');
    respHeaders.set('access-control-allow-origin', '*');
    respHeaders.set('access-control-allow-headers', '*');
    respHeaders.set('access-control-allow-methods', 'GET, POST, OPTIONS');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: respHeaders });
    }

    return new Response(resp.body, { status: resp.status, headers: respHeaders });
  },
};
