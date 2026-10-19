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

- [ ] **P0.1** 拉取 GSC 数据 —— **注意：本机网络不可达 Google，见下方阻断说明**

  **路径 A（本机 API，当前不可用）**
  ```bash
  node scripts/gsc-pull.cjs --days 120
  ```

  **路径 B（手工 CSV 导入，随时可用）** ← 当前走这条
  1. GSC 后台 → Performance → 日期选 **Last 3 months**
  2. Tab **Pages** → Export → Download CSV
  3. Tab **Queries** → Export → Download CSV（可选）
  4. 想看涨跌就再切上一个等长周期，导出一份 prev CSV
  ```bash
  node scripts/gsc-import.cjs \
    --pages ~/Downloads/pages.csv \
    --queries ~/Downloads/queries.csv \
    --compare-pages ~/Downloads/prev.csv \
    --start 2026-07-19 --end 2026-10-16 \
    --baseline
  ```
  产出结构与 `gsc-pull.cjs` **完全一致**，下游（content-strategist / 聚合）无需改动。

- [ ] **P0.2** 存基线快照（**不要被下次拉取覆盖**，单独存一份）
  ```bash
  cp content/.gsc-performance.json content/.gsc-baseline-2026-10.json
  ```
  （用 `gsc-import.cjs --baseline` 会自动写到带月份的文件名，可跳过这步）
- [ ] **P0.3** 补查另外三个开站阈值指标，记进快照文件
  - `site:kbmjj123.cc` 收录页数
  - DR（Ahrefs 免费版 / Moz）
  - 有多少 query 进过前 10

**验收**：能一口气答出"我现在多少 impressions / clicks / 收录 / DR"，不用现查。

> 这一步不依赖后面任何决定。**现在就能做，别等。**

### ⚠️ 已确认的阻断：本机无法访问 Google API

实测（2026-10-18）：

| 目标 | 结果 |
|---|---|
| `example.com` / `baidu.com` / `cloudflare.com` | 200 / 301 / 301 ✅ |
| `www.google.com` | 超时 ❌ |
| `oauth2.googleapis.com` | 超时 ❌ |
| `www.googleapis.com` | 超时 ❌ |

DNS 能解析（74.125.204.95），握手超时 —— 网络层面黑洞，不是凭据问题。
凭据本身是完好的（`.claude/credentials/gsc-service-account.json`，service account + 1704 位私钥）。

**这意味着 `gsc-pull.cjs` 在本机永远跑不通。** 它不是"暂时失败"，是结构性不可用。

**连带结论：P3.4 的 cron 必须跑在 Cloudflare 上，不能跑在本地。**
Cloudflare Worker 运行在 CF 网络内，可以到达 Google API；本地不行。
所以 GSC 自动化的正确形态是 **Worker + Cron Trigger 写入 D1**，而不是本地定时任务。
这同时也顺带解决了原问题：手工跑脚本会断（已经断了三个月），cron 不会。

---

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
