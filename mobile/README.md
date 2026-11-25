# 手机端懒人配置（Dedione 固定出口）

一套自己维护的 Shadowrocket 懒人配置：**导入即用，节点靠订阅，规则靠远程，凭据不进仓库**。

## 文件

| 文件 | 客户端 | 说明 |
|---|---|---|
| `shadowrocket/dedione.conf` | Shadowrocket | 完整配置，基于本人日常配置改造，只改了 AI 分组与分流 |

## 与原始配置的区别（只改了这些）

基于 `lazy_group_my.conf` 改造，**其余一切保留**（DNS、隧道、流媒体/社交/支付/游戏分组、Host、URL Rewrite、MITM 开关）：

1. **新增 `Dedione` 分组**（line ~58）— 固定出口组，成员是手填的落地节点 `Dedione出口`
2. **废弃 `AI-All` 组**（保留但注释掉）— 这是原配置"设了 AI 服务还是不可用"的根因：该组**没有任何规则引用它**，所以在此组选什么都没用
3. **AI 分流改为统一走 `Dedione`**：
   - 你维护的 `rule-sets/shadowrocket/AI.list`（Claude/Gemini/GPT/DeepMind/Antigravity）→ `Dedione`
   - 第三方 `global.list`（Adobe/AWS 等）→ `Dedione`
4. **修复两条 404 规则**：旧 `peanutgao/rule-sets` 仓库已并入本仓库，Gemini/Ozon 规则 URL 已换成新前缀
5. **脱敏**：删除 `[MITM]` 段的 `ca-p12`/`ca-passphrase` 证书私钥（导入后需重新生成）

## 使用方法

### 第一步：添加机场订阅（提供中转节点）
Shadowrocket 首页 → 节点 → 右上角 + → 订阅 → 填你的机场订阅 URL。
节点会自动按地区归入配置里已有的 `香港节点`/`日本节点`/`美国节点` 等 url-test 组（靠 `policy-regex-filter` 自动匹配）。

### 第二步：手填落地节点（固定出口，一次性的）
首页 → 节点 → 右上角 + → 手动添加：
- 类型：`ss`（shadowsocks）
- 服务器/端口/密码/加密：填你自建 VPS 的 SS 落地参数
- **备注必须填 `Dedione出口`**（与配置里的组名对应）
- ⓘ 详情 → 「代理通过」→ 选一个机场节点（如 `美国节点`）
  - 这一步是链式代理：流量先到机场，再到自建落地，绕过被封的裸 IP

### 第三步：导入配置
配置 → 右上角 + → 从 URL 导入：
```
https://raw.githubusercontent.com/peanutgao/my-proxy-configs/main/mobile/shadowrocket/dedione.conf
```
导入后：
- 全局路由选「配置」（不是「代理」）
- 关闭「启用回退」（避免 AI 流量掉回普通节点）

### 第四步：MITM（如需解密，可选）
原配置的证书私钥已脱敏。如需要 MITM：配置 → 编辑 → `[MITM]` → 生成新证书并安装信任。
不解密也能正常分流（规则基于域名，不依赖解密）。

### 第五步：验证
打开浏览器访问 `https://api.ipify.org`，确认出口 IP = 你的自建落地 IP。
再访问 `https://claude.ai`，确认走固定出口。

## 维护方式

- **规则更新**：改 `../rule-sets/shadowrocket/AI.list`，手机端所有引用它的设备下次拉规则自动生效
- **分组调整**：改 `shadowrocket/dedione.conf` 的 `[Proxy Group]` 段
- **改完推送**：`git push` 后手机重新导入 URL（或等客户端自动更新）

## 为什么是这个形态

"懒人配置"的关键是三件事分离：
- **节点**：靠订阅自动更新，配置里不写
- **规则**：靠远程 RULE-SET，改一处全端生效
- **凭据**：落地节点手填一次，永不进仓库

这样仓库可以公开、可以分享，而你的 VPS 密码和订阅 token 只在自己手机里。
