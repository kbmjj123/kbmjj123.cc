# 🧩 PixelBlog — kbmjj123.cc

> A pixel‑themed blog platform for indie developers — minimal, fast, and fully self‑contained.

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages%20%2F%20D1-F38020?logo=cloudflare)](https://cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**🌐 Live site → [kbmjj123.cc](https://kbmjj123.cc)**

---

## 📌 About

**PixelBlog** is my personal blog system — a full‑stack, pixel‑aesthetic platform built for indie developers who want complete ownership of their content.

This is a **solo project**. I built it for myself, and I'm sharing the source code publicly as a reference for others who want to build something similar.

---

## ✨ Features

- 🎨 **Pixel‑aesthetic design** — retro gaming vibe with a modern twist
- ✍️ **Markdown content** — write in Markdown, version with Git
- 🔍 **Full‑text search** — powered by SQLite FTS5 (Cloudflare D1)
- 💬 **Self‑hosted comments** — no third‑party comment systems
- 📧 **Newsletter** — Resend integration with double opt‑in
- 🌐 **Auto‑distribution** — push to Dev.to, Hashnode, Medium
- 🖼️ **Dynamic OG images** — auto‑generated social cards with pixel style
- 📱 **Mobile drafting** — Telegram Bot for quick note‑taking
- ⚡ **Full automation** — Git push → build → deploy → distribute
- 💰 **Low cost** — runs almost entirely on Cloudflare free tier

---

## 🛠️ Stack

| Layer      | Technology                                                      |
| ---------- | --------------------------------------------------------------- |
| Framework  | [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/)       |
| Content    | [Nuxt Content](https://content.nuxt.com/)                       |
| Database   | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) |
| Hosting    | [Cloudflare Pages](https://pages.cloudflare.com/)               |
| Search     | D1 FTS5                                                         |
| Email      | [Resend](https://resend.com/)                                   |
| Storage    | [Cloudflare R2](https://developers.cloudflare.com/r2/)          |
| Automation | Cloudflare Workers + Cron Triggers                              |
| Language   | TypeScript                                                      |

---

## 📁 Project Structure

```
kbmjj123.cc/
├── content/
│   ├── posts/          # Markdown articles
│   └── drafts/         # Drafts (unpublished)
├── server/
│   ├── api/
│   │   ├── posts/      # CRUD
│   │   ├── comments/   # Comment system
│   │   ├── subscribe/  # Newsletter
│   │   ├── og/         # OG image generation
│   │   ├── search/     # FTS5 search
│   │   └── sync-posts/ # Markdown → D1 sync
│   └── utils/
│       └── db.ts       # D1 utilities
├── pages/
│   ├── index.vue       # Home
│   ├── [slug].vue      # Post detail
│   ├── archive.vue     # Archive
│   ├── about.vue       # About
│   └── projects.vue    # Projects
├── components/         # Reusable Vue components
├── public/
│   └── og-preview.html # OG preview tool
├── migrations/
│   └── 001_init.sql    # D1 schema
├── nuxt.config.ts
├── wrangler.toml
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm / npm
- Cloudflare account (free tier works)
- Resend account (free tier works)

### Setup

```bash
git clone https://github.com/kbmjj123/kbmjj123.cc.git
cd kbmjj123.cc
pnpm install
cp .env.example .env
```

### Configure D1

```bash
npx wrangler d1 create pixel-blog
npx wrangler d1 execute pixel-blog --file=migrations/001_init.sql
```

### Run locally

```bash
pnpm dev
```

---

## 🔐 Environment Variables

| Variable                    | Purpose                 | Required |
| --------------------------- | ----------------------- | -------- |
| `RESEND_API_KEY`            | Resend API key          | ✅        |
| `DEV_TO_API_KEY`            | Dev.to token            | ❌        |
| `HASHNODE_TOKEN`            | Hashnode token          | ❌        |
| `HASHNODE_PUBLICATION_ID`   | Hashnode publication ID | ❌        |
| `MEDIUM_TOKEN`              | Medium integration      | ❌        |
| `TELEGRAM_BOT_TOKEN`        | Telegram bot token      | ✅        |
| `TELEGRAM_ALLOWED_CHAT_ID`  | Allowed chat ID         | ✅        |
| `NUXT_PUBLIC_SITE_URL`      | Your site URL           | ✅        |

---

## 🧰 My Other Projects

As an indie developer, I also build tools that help people work faster:

**🖼️ [BulkPicTools](https://bulkpictools.com)** — Bulk image processing in your browser. Compress, convert, crop, resize — all locally, no upload required, no privacy concerns. Supports tool chaining so you can run multiple operations in one pass.

**🔍 [aifindr.org](https://aifindr.org)** — Open-source AI tool directory. 500+ tools across 12 categories, curated for makers and developers. Submit your tool and get 3 free dofollow backlinks (GitHub DA 100 + aifindr.org + contributor page).

---

## 📄 License

MIT — you are free to use, modify, and distribute this code.

## ⚠️ Important Notice

This is a **personal project** built for my own use case. It may not suit everyone's needs.

- I do not accept contributions, pull requests, or feature requests.
- Issues are welcome, but I may not have time to respond.
- The code is shared "as is" for learning and reference.

---

## 📧 Contact

- **Blog:** [kbmjj123.cc](https://kbmjj123.cc)
- **GitHub:** [@kbmjj123](https://github.com/kbmjj123)
- **Image Tools:** [bulkpictools.com](https://bulkpictools.com)
- **AI Directory:** [aifindr.org](https://aifindr.org)

⭐ If you find this project useful, a star is appreciated.

---

## 📊 Content Intelligence System

本项目内置了一套**数据驱动的内容系统**，从选题 → 写作 → 发布 → 复盘形成闭环。

### 架构总览

```
┌─────────────────────────────────────────────────────────────────┐
│                    Content Intelligence Loop                     │
│                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │  GSC API  │──▶│  Content  │──▶│  Blog     │──▶│ Publish  │    │
│  │  Data Pull│   │  Strategist│  │ Producer │   │ & Track  │    │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│       ▲                                              │          │
│       └──────────────────────────────────────────────┘          │
│                    Performance Feedback                          │
└─────────────────────────────────────────────────────────────────┘
```

### 文件清单

| 文件 | 用途 |
|------|------|
| `scripts/gsc-pull.cjs` | 拉取 Google Search Console 数据（JWT 认证，无外部依赖） |
| `scripts/content-ideas.cjs` | 生成内容推荐（GSC + Google Autocomplete + Semrush CSV） |
| `.claude/skills/content-strategist/SKILL.md` | 内容策略师技能（数据驱动选题） |
| `.claude/skills/blog-post-producer/SKILL.md` | 博客生产技能（SEO + 可操作性写作） |
| `.claude/workflows/competitor-analyzer.md` | SERP 竞品分析工作流 |
| `.claude/workflows/outline-generator.md` | 关键词驱动大纲生成 |
| `.claude/workflows/performance-reviewer.md` | 月度内容复盘 |
| `.claude/workflows/pre-publish-check.md` | 发布前自检 |
| `content/.gsc-performance.json` | GSC 性能数据（自动生成） |
| `content/.content-ideas.json` | 内容推荐列表（自动生成） |
| `content/.blog-process.json` | 文章状态 + 性能数据（自动生成） |
| `.claude/credentials/gsc-service-account.json` | GSC 服务账号密钥（已 gitignore） |

### GSC API 配置

脚本使用 Google Search Console API 服务账号认证（JWT，无 `googleapis` 依赖）。

**第一步：创建服务账号**

1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目（或使用已有项目）
3. 启用 **Google Search Console API**
4. 创建服务账号（IAM → Service Accounts）
5. 生成 JSON 密钥，保存到 `.claude/credentials/gsc-service-account.json`

**第二步：授权 GSC 访问**

1. 打开 [Google Search Console](https://search.google.com/search-console)
2. 进入站点 → 设置 → 用户和权限
3. 添加服务账号邮箱为 **受限用户**

**第三步：验证连接**

```bash
node scripts/gsc-pull.cjs
```

> ⚠️ 域名属性使用 `sc-domain:kbmjj123.cc` 格式（脚本已配置）

### 日常使用命令

```bash
# 拉取 GSC 数据（建议每周一次）
node scripts/gsc-pull.cjs

# 生成内容推荐（基于 GSC + Autocomplete）
node scripts/content-ideas.cjs

# 导入 Semrush CSV 手动报告
node scripts/content-ideas.cjs --semrush path/to/report.csv

# 冷启动模式（无 GSC 数据时，用种子关键词）
node scripts/content-ideas.cjs --seed
```

### 内容策略师（Content Strategist）

在 Claude Code 中使用：

```
/content-strategist                # 通用内容策略咨询
/content-strategist pull-gsc       # 拉取 GSC 数据
/content-strategist recommend      # 推荐内容主题
/content-strategist review         # 月度内容复盘
```

**内容支柱（5 个领域）**：

| 支柱 | 关键词示例 |
|------|-----------|
| 🏗️ Building | cloudflare d1, nuxt, serverless, drizzle orm |
| 🔧 Tools | wrangler, github actions, supabase, resend |
| 📈 Growth | seo, core web vitals, web performance, indexing |
| 📖 Learning | typescript, ssr/ssg, ci/cd pipeline |
| 🧠 Mindset | solo developer, side project, shipping fast |

### 博客生产者（Blog Post Producer）

在 Claude Code 中使用：

```
/blog-post-producer    # 从选题到发布全流程
```

**流程**：

```
Phase 0: 数据准备 → Phase 1: SEO 研究 → Phase 2: 选题提案
→ Phase 3: 大纲生成 → Phase 4: 正文写作 → Phase 5: 自检清单
→ Phase 6: 发布与同步
```

**双轨关键词选择**：

| 轨道 | 条件 | 策略 |
|------|------|------|
| Track A | Semrush 有数据 | 按 Volume + KD 筛选 |
| Track B | 长尾词无数据 | 用 Autocomplete 扩展 + SO 有人问验证 |

### 数据流

```
GSC API ──┐
           ├──▶ .gsc-performance.json ──▶ .blog-process.json
Semrush ──┤                                    │
CSV       │                                    ▼
           └──▶ .content-ideas.json ──▶ Content Strategist
                                                │
Google ──────▶ Autocomplete 扩展                ▼
                                          Blog Post Producer
                                                │
                                                ▼
                                          content/posts/*.md
```

### 定期维护

| 频率 | 动作 | 命令 |
|------|------|------|
| 每周 | 拉取 GSC 数据 | `node scripts/gsc-pull.cjs` |
| 每月 | 内容复盘 | `/content-strategist review` |
| 阶段性 | 导入 Semrush 报告 | `--semrush report.csv` |
| 发布前 | 自检 | `/blog-post-producer` Phase 5 |
