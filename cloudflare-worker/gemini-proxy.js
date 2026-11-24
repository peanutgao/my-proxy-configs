// Gemini API 反代 —— 部署到 Cloudflare Worker
//
// 作用：generativelanguage.googleapis.com 对 IP 地理有限制（出口 IP 被
// Google 判为非支持地区时返回 FAILED_PRECONDITION）。本 Worker 把请求
// 转发到 Google API 网关；Cloudflare Worker 出口走 Google/Cloudflare
// 边缘网络，不受本地出口 IP 地理影响。
//
// 安全：纯透明反代，不存储、不记录、不改写 Authorization / x-goog-api-key。
// 请求体透传，支持 GET/POST/流式响应（generateContent / streamGenerateContent）。
//
// 部署：Cloudflare Dashboard → Workers & Pages → Create Worker → 粘贴本文件
// → Deploy。记下分配的 workers.dev 域名（如 gemini-proxy.<你的子域>.workers.dev），
// 或绑定自定义域名。

const UPSTREAM = 'https://generativelanguage.googleapis.com';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 可选路径前缀：/gemini/xxx → /xxx，方便与自定义域名共存
    let path = url.pathname;
    if (path.startsWith('/gemini/')) path = path.slice('/gemini'.length);
    if (path === '/') {
      return new Response(
        'Gemini reverse proxy is running.\nUsage: https://<this-host>/v1beta/...\n',
        { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8' } }
      );
    }

    const upstream = new URL(path + url.search, UPSTREAM);

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
      // Google API 支持 keepalive 流；转发时保持双工
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
