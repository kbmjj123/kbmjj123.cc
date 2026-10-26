# 08 · 升级改造清单

> 按顺序执行。**上一阶段未通过，不进入下一阶段。**
> 每一条都有验收标准，验收不了就是没做完。

---

## 总原则

1. **重启的验收标准是"第 14 天有一篇文章已发布"，不是"系统搭好了"**
2. **凡是手工维护的环节都会断**（证据：`relatedPosts` 19 篇只填 10 篇，GSC 停拉三个月）
   → 能脚本化的先脚本化，不能脚本化的干脆别设
3. **先验证价值，再建管道** —— dev-log 的自动化放在手工验证之后

---

## Phase 0 · 建立事实基线（今天，30 分钟）

不停机，可立即做。

- [x] **P0.1** 拉取 GSC 数据 ✅ **2026-10-19 已完成**（此前"永久不可用"的结论已证伪，见下方更正）

  ```bash
  env http_proxy=http://127.0.0.1:7890 https_proxy=http://127.0.0.1:7890 \
      HTTP_PROXY=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 \
      NO_PROXY=localhost,127.0.0.1,0.0.0.0,::1 \
      node scripts/gsc-pull.cjs --days 120
  ```

  **拿到的数据（2026-06-21 → 2026-10-16，118 天）：**

  | 指标 | 数值 |
  |---|---|
  | 总 impressions | **405** |
  | 总 clicks | **0** |
  | 日均 impressions | **3.4** |
  | GSC 有数据的 URL | 13（其中文章 9、页面 4） |
  | **118 天里零曝光的文章** | **11 / 20 篇** |

  **位次分布（决定 0 点击的性质）：**

  | 路径 | imp | avgPos |
  |---|---|---|
  | /about | 12 | **4.4** |
  | /archive | 5 | **5.0** |
  | /from-zero-to-2-dollar… | 2 | **6.0** |
  | / | 2 | 9.5 |
  | /projects | 14 | 12.5 |
  | /going-serverless-part-3 | 22 | 28.4 |
  | /fixing-adsense… | 48 | 34.3 |
  | /going-serverless-part-2 | 42 | 36.0 |
  | /platform-agnostic-ad… | 69 | 44.2 |
  | /self-hosting-umami-part-1 | **140** | 46.5 |
  | /self-hosting-umami-part-3 | 18 | 48.8 |
  | /going-serverless-part-1 | 25 | 59.4 |
  | /68k-impressions… | 6 | 43.5 |

- [x] **P0.2** 基线快照已存 → `content/.gsc-baseline-2026-10.json`
- [x] **P0.3** 收录状况已用 **URL Inspection API** 精确查出（比 `site:` 准，逐 URL 官方判定）
  - **20 篇文章：9 篇已收录，11 篇 `URL is unknown to Google`（从未被抓取）**
  - 已收录的 9 篇恰好 = GSC 里有数据的那 9 篇一一对应
  - 已收录的抓取时间全部落在 10/08–10/18 → Google 正在以约每天 1 篇的速度慢慢发现
  - 有多少 query 进过前 10：**13 条 query 中只有 `wwads` 到过第 1 位**
- [ ] **P0.4** DR（Ahrefs 免费版 / Moz）—— 仍需外部工具，唯一未拿到的指标

**验收**：能一口气答出"我现在多少 impressions / clicks / 收录 / DR"，不用现查。

> 这一步不依赖后面任何决定。**现在就能做，别等。**

### ⚠️ 更正：2026-10-18 的"永久不可用"结论是**错的**

**当时的错误判断**：认定本机到 Google API 是结构性黑洞，`gsc-pull.cjs` 永久跑不通。

**实际原因**：本机代理在 `127.0.0.1:7890`，但 shell 环境里的 `HTTP_PROXY/HTTPS_PROXY`
被 WorkBuddy 沙箱**覆盖成了自己的 `127.0.0.1:51595`**，那个代理不放行 Google。
脚本用 `curl` 且没显式指定 `-x`，于是走到沙箱代理 → 超时。

**证据**（2026-10-19 复测）：

| 方式 | 结果 |
|---|---|
| 默认环境（走 51595 沙箱代理） | `000` 超时 ❌ |
| `curl -x http://127.0.0.1:7890` | `404` ✅ 到达 Google |
| `env https_proxy=...7890 node gsc-pull.cjs` | ✅ 完整拉取成功 |

**教训**：故障结论写得太死了。实际只是**代理变量被覆盖**这一层，一指定就通。
以后下"不可用"判断前，先确认环境里到底哪一层在生效。

**连带修正**：P3.4 的 cron 不再必须跑在 Cloudflare 上——本机 API 路径是通的。
但仍**建议**走 Worker + Cron，理由不是网络，而是：本机要开机、要手动执行，
而历史上"手工跑脚本"已经断过一次（停了三个月）。**cron 解决的是人会忘，不是网络不通。**

---

## 🚨 关键发现：索引断裂（优先级高于一切内容优化）

**2026-10-19 通过 GSC URL Inspection API 逐 URL 精确判定。**

### 事实

| 指标 | 数值 |
|---|---|
| 已收录 | **9 / 20 篇** |
| `URL is unknown to Google`（从未被抓取） | **11 / 20 篇** |
| sitemap 被 Google 处理过吗 | **从未**（`isPending: true`，2026-07-21 提交后三个月未处理） |
| 已收录 9 篇的抓取时间 | 全部落在 10/08–10/18 |

**已收录的 9 篇，与 GSC 里有曝光数据的 9 篇完全重合。**

> 零曝光不是因为排名差，是因为 Google 根本不知道它们存在。

### 这意味着什么

此前所有关于"排名优化"的讨论都建立在错误前提上。真实顺序是：

```
未收录  →  收录  →  排名  →  点击
   ↑
  卡在这里
```

**以下工作在当前阶段无效，应推迟：**

- 修内链 / 统一分类 —— 作用于已收录页面之间的权重传递
- 改文章结构 / TL;DR —— 作用于已收录页面的排名与 CTR
- 挑文章做 A/B 对比 —— 405 imp 的样本量无法归因

### 已执行

- [x] 重新提交 sitemap → **HTTP 204 成功**，`lastSubmitted` 从 `2026-07-21` 更新为 `2026-10-19`
  ```bash
  env https_proxy=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 \
      node scripts/gsc-submit-sitemap.cjs
  ```
  注意：必须用 **full scope** 自行取 token。复用 `gsc-pull.cjs` 的 readonly token 会 403
  （`ACCESS_TOKEN_SCOPE_INSUFFICIENT`）—— 卡点是 scope 声明，不是 GSC 用户级别。

### 待验证（1–7 天后）

- [ ] sitemap 的 `isPending` 是否变 false，并出现"已发现 URL 数"
- [ ] 重跑 `gsc-pull.cjs`，看 impressions 是否因收录增加而跳涨
- [ ] 重跑 URL Inspection，看 11 篇未收录是否变成 Discovered / Crawled / Indexed

### 已排除的四种可能

| 假设 | 验证方式 | 结果 |
|---|---|---|
| robots.txt 屏蔽 | 拉取线上 robots.txt | ❌ `Allow: *`，已收录页 `robotsTxtState: ALLOWED` |
| 页面带 noindex | 检查未收录页 HTML | ❌ 是 `index, follow` |
| 移动端渲染差异 | Googlebot Mobile UA 抓首页 | ❌ 与桌面端逐字节一致（51520 bytes，均含 20 条链接） |
| 首页/归档页缺链接 | grep 静态 HTML | ❌ 两页都有完整 20 条链接 |

**剩下的解释**：站点权重极低，抓取预算只够每天发现约 1 篇。
而本该绕过这个限制的 sitemap 通道，因三个月未被处理而失效。
**重新提交 sitemap 是目前唯一能显著加速的杠杆。**

## Phase 1 · 环境搭建

- [x] **P1.1** 建全局数据目录
  ```bash
  mkdir -p ~/.dev-log/projects ~/.dev-log/drafts
  ```
- [x] **P1.2** 写用户级 skill `~/.workbuddy/skills/dev-log/SKILL.md`
  - 内容以 `01-skill/core-rules.md` 为准
  - frontmatter 用 WorkBuddy 格式（见附录 A）
  - 附加规则：`config.desc` 自动写入每条日志（跨项目上下文）
  - 已装配 `references/`（4 份）、`config-template.md`、`scripts/init-devlog.sh`
- [x] **P1.3** 迁移两个发布端 skill 到项目级
  ```
  .claude/skills/content-strategist/  →  .workbuddy/skills/content-strategist/
  .claude/skills/blog-post-producer/  →  .workbuddy/skills/blog-post-producer/
  ```
  frontmatter 改成 WorkBuddy 格式，正文不动。
  **原位置留软链接指回 `.workbuddy/`，Claude Code 仍可用，且只有一份正文不会漂移。**
- [x] **P1.4** 本站接入 dev-log
  ```bash
  cd ~/Desktop/fullstack/kbmjj123.cc
  bash ~/.workbuddy/skills/dev-log/scripts/init-devlog.sh kbmjj123.cc
  ```
- [x] **P1.5** 填本站 `config.md`（tags / focus / ignore / desc）
  - ignore 里已写死订阅者邮箱与 `.env`/credentials（站点有订阅功能，这是真实隐私面）
- [x] **P1.6** 在 `blog-post-producer` 的 Phase 0 前加一步：先读 `~/.dev-log/projects/*/log.md`
- [x] **P1.7** 在 `content-strategist` 加一条：选题时参考日志里的真实踩坑，不只靠关键词

**验收**：
- [x] 在任意项目说"记一下这个"，日志落到 `~/.dev-log/projects/<项目>/log.md`
- [x] `.dev-log/shots` 软链接存在且可写（实测写入落到全局目录）
- [x] `~/.dev-log/index.md` 里有本站
- [x] 三个 skill 的 frontmatter YAML 均通过解析

### 本次修复的两个脚本缺陷

| 问题 | 修复 |
|---|---|
| `init-devlog.sh` 把 `config-template.md`（整份说明文档）复制成 `config.md` | 改为生成最小可解析配置；说明文档只留在 skill 目录作参考 |
| `.gitignore` 整段忽略 `.dev-log/`，导致唯一该提交的 `config.md` 也被忽略 | 改为 `.dev-log/*` + `!.dev-log/config.md`，只提交配置 |

---

## Phase 2 · 手工验证（2–3 周）— 有止损点

**这一阶段不做任何新的自动化。** 目的是先证明这套东西在你手上有价值。

- [ ] **P2.1** 手工按 `01-skill/record-format.md` 记 **5 条**日志
- [ ] **P2.2** 让 agent 说"生成博客草稿"，看聚合产物
- [ ] **P2.3** 自检两个问题：
  - 5 条里有 ≥ 3 条是"这个能写"的吗？
  - 聚合出来是文章还是流水账？

### 止损点

| 情况 | 动作 |
|---|---|
| **第 14 天还没有 1 篇发布** | **停。** 这次重启已失败，不要再往下建系统 |
| 5 条里 < 3 条能写 | 信号检测阈值对你不成立，调 `signal-detection.md` 再试一轮 |
| 聚合出来是流水账 | "按问题类型分组"方法不成立，先解决聚合质量 |

**验收**：至少 1 篇文章**已发布**（不是草稿）。

---

## Phase 3 · 站点改造（工程）

Phase 2 通过后才启动。这一阶段与 dev-log 无关，是站点质量改造。

- [ ] **P3.1** `content.config.ts` 加 zod schema
  - 现在只有 `type:'page'`，frontmatter 全靠自觉
  - 加了之后：草稿 frontmatter 不合格直接构建失败，不会上线一篇 SEO 残缺的文章
  - **收益最高，建议第一个做**
- [ ] **P3.2** series → relatedPosts 自动互链
  - 现状：有系列的 8 篇 `relatedPosts` 全空，内链网络是断的
  - 改法：同系列前后篇构建时自动注入，`relatedPosts` 只用于跨系列
- [ ] **P3.3** 统一分类体系
  - `content-strategist` 的支柱（Building/Tools/Growth/Learning/Mindset）
  - vs 站点 category（dev-practice / tools-workflow / startup-diary / indie-mindset / product-business）
  - **以 category 为准，砍掉支柱那套**（category 已在 19 篇里，是既成事实）
- [ ] **P3.4** 把 GSC 拉取改成 **Cloudflare Worker + Cron Trigger**
  - `wrangler.toml` 里 `# crons = ["0 9 * * *"]` 是注释状态
  - **必须跑在 Worker 上，不能跑本地** —— 本机到 Google 不可达（见 Phase 0 阻断说明）
  - Worker 逻辑照搬 `gsc-pull.cjs` 的 JWT → token → searchAnalytics/query 三步，改成 `fetch`
  - 结果写 D1（已绑定 `DB`），按月份存快照 → **永远不再盲飞**
  - 单独建一个 worker 项目，不要塞进 Nuxt 的 `.output/server/index.mjs`
- [ ] **P3.5** 文章模板预留"相关工具"小节位
  - 现在留位成本为零，将来开专区直接挂

**验收**：
- 故意写错 frontmatter 构建会失败
- 同系列文章页面能看到互链
- cron 跑过一次并生成了带日期的快照

---

## Phase 4 · 内容改造

- [ ] **P4.1** 新文章一律按 `07-article-archetypes.md` 的四类原型
- [ ] **P4.2** TL;DR 规则生效：默认不写 / 长文改写为"你会得到什么"
- [ ] **P4.3** 挑 **2 篇**复盘叙事型改结构，标记改造日期
  - 候选：`from-zero-to-2-dollar-6-months-tool-site`、`nuxt-cloudflare-zero-cost`
- [ ] **P4.4** 一个月后再拉 GSC，对比这两篇的 impressions / clicks
  - 有效果 → 推到其余复盘型
  - 没效果 → 结构不是瓶颈，停下

**验收**：新旧结构各至少 2 篇，有可对比的数据。

---

## Phase 5 · 护栏（现在就写死）

- [ ] **P5.1** 系统数量上限 = 3（dev-log + content-strategist + blog-post-producer）
  再加第四个之前必须先砍掉一个
- [ ] **P5.2** dev-log 能力边界划线：
  > dev-log 只喂饱 Building / Tools / Learning。
  > Growth 的供给是 GSC pipeline，Mindset 的供给是你自己，都不能指望 dev-log。
- [ ] **P5.3** 止损线写进 `04-motivation-system.md`（那份只有里程碑，没有停止信号）

---

## 明确不做的事

| 不做 | 原因 |
|---|---|
| 截图自动化（原 T4） | mtime 关联在拖拽/复制场景不可靠；先手工跑一个月看实际频率 |
| 孤儿素材自动归类 | 同上，等有足够孤儿再说 |
| L1 自动展开（模式 A） | 会增加每次回答的产出成本，转嫁到编码等待感 |
| 批量改存量 19 篇 | 已有 4 个月权重，批量改可能引起波动，且现在没有基线无法判断效果 |
| 日志存项目内 | 消费者是博客，不是项目；项目归档后素材必须还在 |

---

## 附录 A · WorkBuddy skill frontmatter 格式

```yaml
---
name: dev-log
display_name: 开发过程记录
description: 在编码过程中静默沉淀可复用的开发素材。当用户遇到报错并解决、做了技术选型、引入新库、发现性能或成本数据变化时使用。不主动打断用户。
description_zh: 在编码过程中静默沉淀可复用的开发素材，供后续生成博客文章。
version: 1.0.0
author: kbmjj123
tags: [dev-log, 素材采集, 博客, 踩坑记录]
examples_zh:
  - "记一下这个坑"
  - "整理一下最近的记录"
  - "生成博客草稿"
---
```

落点：
- 采集端 → `~/.workbuddy/skills/dev-log/`（用户级，所有项目可用）
- 发布端 → `<本站>/.workbuddy/skills/`（项目级，只服务本站）

---

## 附录 B · 目录速查

```
~/.dev-log/                          全局数据（采集端产出）
├── projects/<project>/{log.md,shots/,outputs/}
├── drafts/
└── index.md                         自动生成

~/.workbuddy/skills/dev-log/         采集端 skill（用户级）
<项目根>/.dev-log/config.md          唯一需要手写的文件
<项目根>/.dev-log/shots -> 软链接    写路径短 + 物理集中

<本站>/.workbuddy/skills/            发布端 skill（项目级）
<本站>/content/posts/                成品
```
