# Keyword Research Roadmap

> 基于 SEMrush 关键词报告的内容规划清单。数据采集时间：2026-07。
> 每个主题对应 `.claude/keywords-{1,2,3}/` 中的一份 HTML 报告。

---

## 优先级说明

| 等级 | 标准 |
|------|------|
| 🔴 P0 | 搜索量大 + KD 低 + 与博客高度契合，优先写 |
| 🟡 P1 | 搜索量中等 + KD 中低 + 有真实经验可写 |
| 🟢 P2 | 搜索量较小或 KD 较高，作为补充内容 |
| ⚪ P3 | 暂时搁置，数据噪音大或与定位偏离 |

---

## 内容集群总览

```
集群 A：SEO & 搜索           集群 B：开发者工具链         集群 C：独立开发者
├─ technical-seo    🔴       ├─ sqlite           🔴      ├─ indie-developer  🔴
├─ seo-checklist    🔴       ├─ ci-cd            🟡      ├─ side-project     🟢
├─ seo-for-developers 🟡     ├─ github-actions   🟡      ├─ bootstrapping    ⚪
├─ free-seo-tools   🟡       ├─ serverless-functions 🟡  ├─ saas-pricing     🟡
├─ image-sitemap    🟡       ├─ vs-code-extensions 🟢    ├─ technical-writing 🟡
├─ sitemap-xml      🟡       ├─ cloudflare-pages  🟢
└─ google-search    ⚪       ├─ cloudflare-r2     🟢     集群 E：AI 编程
                             ├─ cloudflare-worker  🟢     ├─ claude-code      🔴
集群 D：分析 & 邮件           └─ edge-computing    🟡     ├─ cursor-ai        🟡
├─ google-analytics-alternatives 🔴                       └─ cursor-vs-copilot 🟡
├─ posthog          🟡
├─ plausible-analytics 🟢    集群 F：前端框架             集群 H：变现 & 运营
├─ umami-analytics  🟡       ├─ nuxt             🟡      ├─ google-adsense    🟡
├─ rss-feed         🔴       ├─ nuxt-vs-next     🟡      ├─ adsense-alternatives 🟡
├─ email-api        🟡       ├─ ssr-vs-ssg       🟢      ├─ newsletter        ⚪
├─ resend-email-api 🟡       └─ typescript-vs-javascript 🟡
├─ resend-vs-sendgrid 🟡                                  集群 I：其他
├─ og-images        🟡                                     ├─ freemium-vs-paid 🟢
└─ uptime-monitoring 🟢                                    └─ lemon-squeezy   ⚪
```

---

## 🔴 P0 — 最高优先级

### 1. technical-seo

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-1/technical-seo.html` |
| 总关键词 | 124 |
| 总搜索量 | 74,770 |
| 平均 KD | 19% |
| 高价值词 | "technical seo" (720, KD 6), "why is technical seo important" (210, KD 25) |

**已有内容**: `google-search-console-api-nodejs`, `68k-impressions-8-clicks-image-sitemap-blind-spot`

**建议文章**:
- [ ] Technical SEO for Developers: The Only Guide You Need
- [ ] 系列化：可拆为 3-4 篇（爬取、索引、结构化数据、性能）

**关键词策略**: 主攻 "technical seo" + "technical seo checklist" + "technical seo audit"，长尾词覆盖面极广

---

### 2. seo-checklist

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-1/seo-checklist.html` |
| 总关键词 | 81 |
| 总搜索量 | 43,160 |
| 平均 KD | 22% |
| 高价值词 | "technical seo checklist" (3,600, KD 34), "seo checklist template" (1,300, KD 37), "local seo checklist" (2,900, KD 19) |

**已有内容**: `google-search-console-api-nodejs` (GSC 数据实操)

**建议文章**:
- [ ] 2026 Developer SEO Checklist: 从零到可搜索
- [ ] 可附带可下载的 checklist PDF / Markdown 模板

**关键词策略**: 主攻 "seo checklist 2026" + "technical seo checklist" + "seo checklist for new website"，年份词竞争低

---

### 3. sqlite

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-1/sqlite.html` |
| 总关键词 | 208 |
| 总搜索量 | 42,540 |
| 平均 KD | 27% |
| 高价值词 | "sqlite python" (880, KD 30), "sqlite show tables" (720, KD 22), "mysql vs sqlite" (590, KD 28), "sqlite create database" (260, KD 5) |

**已有内容**: `nuxt-cloudflare-zero-cost`, `going-serverless-part-1` (D1/SQLite 经验)

**建议文章**:
- [ ] SQLite for Web Developers: From Zero to Production
- [ ] Cloudflare D1 实战：用 SQLite 替代你的 MySQL
- [ ] SQLite 高级查询技巧（JOIN, UPSERT, JSON, FTS5）

**关键词策略**: 主攻 "sqlite" 核心词 + "sqlite vs mysql" + "sqlite python"，教程型长尾词 KD 普遍 <30

---

### 4. rss-feed

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-1/rss-feed.html` |
| 总关键词 | 236 |
| 总搜索量 | 83,020 |
| 平均 KD | 25% |
| 高价值词 | "what is rss feed" (2,900, KD 29), "rss feed podcast" (590, KD 34), "rss feed maker" (480, KD 36), "rss feed to email" (260, KD 18) |

**已有内容**: 暂无专门 RSS 文章（但博客有 RSS 功能）

**建议文章**:
- [ ] What Is RSS Feed: 给现代开发者的完整指南
- [ ] How to Add RSS Feed to Your Blog (Nuxt + Nitro)
- [ ] RSS 2.0 vs Atom: 该选哪个？

**关键词策略**: 主攻 "what is rss feed" (2,900) + "rss feed" 相关长尾词，信息意图词 KD 低

---

### 5. google-analytics-alternatives

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-3/google-analytics-alternatives.html` |
| 总关键词 | 5 |
| 总搜索量 | 3,470 |
| 平均 KD | 21% |
| 高价值词 | "google analytics alternative" (1,600, KD 21), "google analytics alternatives" (1,300, KD 22) |

**已有内容**: `self-hosting-umami-part-1` ~ `part-4` (4 篇 Umami 系列)

**建议文章**:
- [ ] 5 Best Google Analytics Alternatives for Developers (2026)
- [ ] 可自然引用已有 Umami 系列作为深度教程

**关键词策略**: 主攻 "google analytics alternatives" + "google analytics alternative"，竞品对比文搜索意图明确

---

### 6. indie-developer

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-3/indie-developer.html` |
| 总关键词 | 263 |
| 总搜索量 | 56,560 |
| 平均 KD | 19% |
| 高价值词 | 注意：大量 "india" 地理噪音，实际有效词约 20 个 |
| 有效词示例 | "indie developer" (~500), "indie hacker tools" (~200), "indie dev blog" (~100) |

**已有内容**: `does-indie-dev-have-to-be-jack-of-all-trades`, `from-zero-to-2-dollar-6-months-tool-site`

**建议文章**:
- [ ] Indie Developer Tech Stack 2026: 我用什么工具做产品
- [ ] How I Built a Blog for $0: Indie Dev 的技术选型

**关键词策略**: 核心定位词，需过滤 "india" 噪音，主攻 "indie developer" + "indie hacker" 组合

---

### 7. claude-code

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-2/claude-code.html` |
| 总关键词 | 911 |
| 总搜索量 | 429,560 |
| 平均 KD | 27% |
| 高价值词 | "claude code vs cursor" (8,100, KD 36), "what is claude code" (6,600, KD 31), "codex vs claude code" (5,400, KD 40) |

**已有内容**: `claude-deepseek-workflow`

**建议文章**:
- [ ] Claude Code 完全指南：从安装到高级用法
- [ ] Claude Code vs Cursor: 哪个更适合你？
- [ ] 我用 Claude Code 写了一个博客的全过程

**关键词策略**: 超高热度话题，"claude code" 搜索量 43 万+，竞争相对适中。写对比文可抢占 "vs" 词

---

## 🟡 P1 — 高优先级

### 8. technical-writing

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-1/technical-writing.html` |
| 总关键词 | 114 |
| 总搜索量 | 43,030 |
| 平均 KD | 23% |
| 高价值词 | "what is technical writing" (3,600, KD 32), "types of technical writing" (110, KD 28) |

**建议文章**:
- [ ] Technical Writing for Developers: 写出让用户看懂的文档
- [ ] 可与 "seo-for-developers" 组合为系列

---

### 9. cursor-ai / cursor-vs-copilot

| 指标 | cursor-ai | cursor-vs-copilot |
|------|-----------|-------------------|
| 来源 | `keywords-2/cursor-ai.html` | `keywords-2/cursor-vs-copilot.html` |
| 总关键词 | 54 | 12 |
| 总搜索量 | 16,540 | 5,770 |
| 平均 KD | 27% | 29% |
| 高价值词 | "cursor 3 ai coding agents" (1,000, KD 37) | "cursor vs copilot" (1,900, KD 28) |

**建议文章**:
- [ ] Cursor AI 实战体验：值得付费吗？
- [ ] Cursor vs GitHub Copilot vs Claude Code: 三选一

---

### 10. ci-cd / github-actions

| 指标 | ci-cd | github-actions |
|------|-------|----------------|
| 来源 | `keywords-2/ci-cd.html` | `keywords-3/github-actions.html` |
| 总关键词 | 101 | 59 |
| 总搜索量 | 34,550 | 12,480 |
| 平均 KD | 27% | 32% |

**已有内容**: `going-serverless-part-2` (GitHub OAuth)

**建议文章**:
- [ ] CI/CD for Indie Developers: 用 GitHub Actions 自动部署
- [ ] 可结合 Cloudflare Pages 部署流程写实操

---

### 11. edge-computing

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-2/edge-computing.html` |
| 总关键词 | 89 |
| 总搜索量 | 51,000 |
| 平均 KD | 25% |
| 高价值词 | "edge computing news" (5,400, KD 16), "mobile edge computing" (1,600, KD 36) |

**已有内容**: `going-serverless-part-1`, `nuxt4-cloudflare-three-deployment-modes`

**建议文章**:
- [ ] Edge Computing Explained: 为什么你的博客应该部署在边缘
- [ ] 可与 Cloudflare Workers/ Pages 深度结合

---

### 12. og-images

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-3/og-images.html` |
| 总关键词 | 22 |
| 总搜索量 | 5,550 |
| 平均 KD | 27% |
| 高价值词 | "og image size" (880, KD 28), "meta property og image" (480, KD 36) |

**已有内容**: 刚为博客实现了 OG 图片功能（`AppOgImage` 组件）

**建议文章**:
- [ ] How to Generate Dynamic OG Images: Nuxt + Satori 实战
- [ ] OG Image Size & Best Practices (2026)

---

### 13. serverless-functions

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-1/serverless-functions.html` |
| 总关键词 | 7 |
| 总搜索量 | 2,230 |
| 平均 KD | 30% |
| 高价值词 | "serverless functions" (720, KD 35), "vercel post requests configuration serverless functions" (590, KD 29) |

**已有内容**: `going-serverless-part-1/2/3` (3 篇系列)

**建议文章**:
- [ ] Serverless Functions 入门：Vercel vs Cloudflare vs Netlify
- [ ] 扩展现有系列的第 4 篇

---

### 14. email-api / resend-email-api / resend-vs-sendgrid

| 指标 | email-api | resend-email-api | resend-vs-sendgrid |
|------|-----------|------------------|---------------------|
| 来源 | `keywords-2/email-api.html` | `keywords-1/resend-email-api.html` | `keywords-1/resend-vs-sendgrid.html` |
| 总关键词 | 45 | 1 | 1 |
| 总搜索量 | 12,610 | 210 | 140 |
| 平均 KD | 25% | 17% | 14% |

**已有内容**: `building-pixel-email-subscription`

**建议文章**:
- [ ] Resend Email API Tutorial: 零依赖发送邮件
- [ ] Resend vs SendGrid: 2026 年该选哪个？
- [ ] 可合并为一篇 "Email API for Developers" 长文

---

### 15. nuxt-vs-next / nuxt / ssr-vs-ssg / typescript-vs-javascript

| 指标 | nuxt-vs-next | nuxt | ssr-vs-ssg | ts-vs-js |
|------|-------------|------|------------|----------|
| 总关键词 | 2 | 25 | 1 | 2 |
| 总搜索量 | 320 | 5,390 | 140 | 3,740 |
| 平均 KD | 26% | 27% | 33% | 27% |

**建议文章**:
- [ ] Nuxt vs Next in 2026: 为什么我选了 Nuxt
- [ ] SSR vs SSG vs ISR: 现代前端渲染模式详解
- [ ] TypeScript vs JavaScript: 2026 年还需要用 JS 吗？

---

### 16. google-adsense / adsense-alternatives

| 指标 | google-adsense | adsense-alternatives |
|------|---------------|---------------------|
| 来源 | `keywords-3/google-adsense.html` | `keywords-2/adsense-alternatives.html` |
| 总关键词 | 38 | 12 |
| 总搜索量 | 15,810 | 2,980 |
| 平均 KD | 27% | 15% |

**已有内容**: `fixing-adsense-responsive-mobile-square`, `platform-agnostic-ad-component-nuxt4-ssg`

**建议文章**:
- [ ] Google AdSense 完整接入指南 (Nuxt 4)
- [ ] 5 个 Google AdSense 替代方案（独立开发者向）

---

### 17. saas-pricing

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-1/saas-pricing.html` |
| 总关键词 | 51 |
| 总搜索量 | 22,560 |
| 平均 KD | 24% |
| 高价值词 | "saas pricing models" (1,300, KD 37), "saas pricing news" (8,100, KD 25) |

**建议文章**:
- [ ] SaaS Pricing Models Explained: 独立开发者的定价指南
- [ ] 可结合 Lemon Squeezy / Stripe 支付经验

---

### 18. posthog

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-3/posthog.html` |
| 总关键词 | 29 |
| 总搜索量 | 8,670 |
| 平均 KD | 21% |
| 高价值词 | "posthog mcp claude code" (2,400, KD 21), "posthog pricing" (720, KD 28) |

**建议文章**:
- [ ] PostHog vs Umami: 开发者产品分析工具对比
- [ ] "posthog mcp claude code" 是新热词，可抢占

---

### 19. free-seo-tools

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-3/free-seo-tools.html` |
| 总关键词 | 30 |
| 总搜索量 | 9,720 |
| 平均 KD | 31% |

**建议文章**:
- [ ] 10 Free SEO Tools Every Developer Should Know
- [ ] 与 technical-seo / seo-checklist 互相内链

---

### 20. uptime-monitoring

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-1/uptime-monitoring.html` |
| 总关键词 | 4 |
| 总搜索量 | 1,180 |
| 平均 KD | 14% |

**建议文章**:
- [ ] Uptime Monitoring for Indie Developers: 免费方案对比
- [ ] 可结合 Cloudflare / Uptime Kuma 写实操

---

### 21. image-sitemap

| 指标 | 值 |
|------|-----|
| 来源 | `keywords-3/image-sitemap.html` |
| 总关键词 | 5 |
| 总搜索量 | 1,290 |
| 平均 KD | 31% |

**已有内容**: `68k-impressions-8-clicks-image-sitemap-blind-spot`

**建议文章**:
- [ ] Image Sitemap 完整指南：如何创建与提交
- [ ] 扩展已有文章的深度版

---

## 🟢 P2 — 补充内容

### 22. vs-code-extensions

| 总搜索量 | 4,150 | 平均 KD | 32% |
|---------|-------|---------|-----|

- [ ] Best VS Code Extensions for Web Developers (2026)
- [ ] "claude code extension vs code" (320, KD 40) 可与 AI 编程集群联动

### 23. cloudflare-pages / cloudflare-r2 / cloudflare-worker

| 主题 | 搜索量 | KD |
|------|--------|-----|
| cloudflare-pages | 2,740 | 30% |
| cloudflare-r2 | 2,260 | 32% |
| cloudflare-worker | 360 | 28% |

- [ ] Cloudflare 全栈实战：Pages + R2 + Workers
- [ ] 可扩展现有 "going-serverless" 系列

### 24. sitemap-xml

| 总搜索量 | 8,060 | 平均 KD | 26% |

- [ ] XML Sitemap 完整指南：生成、验证、提交
- [ ] 与 image-sitemap / technical-seo 互相内链

### 25. seo-for-developers

| 总搜索量 | 500 | 平均 KD | 31% |

- [ ] SEO for Web Developers: 你不需要成为 SEO 专家
- [ ] 与 technical-seo / seo-checklist 组合

### 26. freemium-vs-paid

| 总搜索量 | 390 | 平均 KD | 28% |

- [ ] Freemium vs Free Trial vs Paid Only: SaaS 定价策略
- [ ] 可并入 saas-pricing 文章

### 27. plausible-analytics

| 总搜索量 | 110 | 平均 KD | 23% |

- [ ] Plausible Analytics Review: 隐私优先的分析方案
- [ ] 可并入 google-analytics-alternatives 对比文

---

## ⚪ P3 — 暂时搁置

| 主题 | 原因 |
|------|------|
| **bootstrapping** | 759 个关键词几乎全是 Bootstrap CSS 框架噪音，商业"自举"含义的词极少 |
| **newsletter** | 搜索量 144 万但全是品牌词噪音（zim newsletter, zillow newsletter 等） |
| **google-search** | 数据几乎无可用关键词 |
| **lemon-squeezy** | 被 "easy peasy lemon squeezy" 占据，支付平台相关词极少 |
| **side-project** | 23 个词中 20 个是 "pizza""brewery""chicago" 噪音 |

---

## 已发布文章与关键词的对应关系

| 已发布文章 | 对应关键词报告 | 可延伸方向 |
|-----------|--------------|-----------|
| `google-search-console-api-nodejs` | seo-checklist, technical-seo | SEO 系列 |
| `68k-impressions-8-clicks-image-sitemap-blind-spot` | image-sitemap, sitemap-xml | Sitemap 系列 |
| `self-hosting-umami-part-1~4` | umami-analytics, google-analytics-alternatives, posthog | 分析工具系列 |
| `fixing-adsense-responsive-mobile-square` | google-adsense, adsense-alternatives | 变现系列 |
| `building-pixel-email-subscription` | email-api, resend-email-api | 邮件系列 |
| `going-serverless-part-1~3` | serverless-functions, cloudflare-* | 无服务器系列 |
| `nuxt-cloudflare-zero-cost` | nuxt, cloudflare-pages, edge-computing | Nuxt 部署系列 |
| `claude-deepseek-workflow` | claude-code, cursor-ai | AI 编程系列 |
| `does-indie-dev-have-to-be-jack-of-all-trades` | indie-developer | 独立开发者系列 |

---

## 待写状态追踪

| # | 主题 | 状态 | 文件名 | 发布日期 |
|---|------|------|--------|---------|
| 1 | technical-seo | ⬜ 待写 | — | — |
| 2 | seo-checklist | ⬜ 待写 | — | — |
| 3 | sqlite | ⬜ 待写 | — | — |
| 4 | rss-feed | ⬜ 待写 | — | — |
| 5 | google-analytics-alternatives | ⬜ 待写 | — | — |
| 6 | indie-developer | ⬜ 待写 | — | — |
| 7 | claude-code | ⬜ 待写 | — | — |
| 8 | technical-writing | ⬜ 待写 | — | — |
| 9 | cursor-ai | ⬜ 待写 | — | — |
| 10 | ci-cd / github-actions | ⬜ 待写 | — | — |
| 11 | edge-computing | ⬜ 待写 | — | — |
| 12 | og-images | ⬜ 待写 | — | — |
| 13 | serverless-functions | ⬜ 待写 | — | — |
| 14 | email-api / resend | ⬜ 待写 | — | — |
| 15 | nuxt-vs-next | ⬜ 待写 | — | — |
| 16 | google-adsense | ⬜ 待写 | — | — |
| 17 | saas-pricing | ⬜ 待写 | — | — |
| 18 | posthog | ⬜ 待写 | — | — |
| 19 | free-seo-tools | ⬜ 待写 | — | — |
| 20 | uptime-monitoring | ⬜ 待写 | — | — |
| 21 | image-sitemap | ⬜ 待写 | — | — |

状态标记: ⬜ 待写 → 🟡 起草中 → 🔵 审核中 → ✅ 已发布

---

## 推荐写作顺序（第一批 5 篇）

基于「搜索量 × (100-KD) × 契合度」综合排序：

1. **claude-code** — 43 万搜索量，AI 热潮，写 Claude Code 使用体验或 vs Cursor
2. **technical-seo** — 7.5 万搜索量，KD 仅 19%，开发者 SEO 完全指南
3. **sqlite** — 4.3 万搜索量，D1 实战经验可复用，长尾词丰富
4. **google-analytics-alternatives** — 3,470 搜索量，KD 21%，已有 Umami 系列可承接
5. **rss-feed** — 8.3 万搜索量，"what is rss feed" 单词 2,900，信息意图 KD 低

---

> 最后更新: 2026-07-27
> 数据来源: SEMrush Keyword Magic Tool (via `.claude/keywords-{1,2,3}/`)
