# 🧩 PixelBlog

> A pixel‑themed blog platform for indie developers — minimal, fast, and fully self‑contained.

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages%20%2B%20D1-F38020?logo=cloudflare)](https://cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

| Layer | Technology |
| :--- | :--- |
| Framework | [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/) |
| Content | [Nuxt Content](https://content.nuxt.com/) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) |
| Search | D1 FTS5 |
| Email | [Resend](https://resend.com/) |
| Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| Automation | Cloudflare Workers + Cron Triggers |
| Language | TypeScript |

---

## 📁 Project Structure
```text
pixel-blog/
├── content/
│ ├── posts/ # Markdown articles
│ └── drafts/ # Drafts (unpublished)
├── server/
│ ├── api/ # API endpoints
│ │ ├── posts/ # CRUD
│ │ ├── comments/ # Comment system
│ │ ├── subscribe/ # Newsletter
│ │ ├── og/ # OG image generation
│ │ ├── search/ # FTS5 search
│ │ └── sync-posts/ # Markdown → D1 sync
│ └── utils/
│ └── db.ts # D1 utilities
├── pages/
│ ├── index.vue # Home
│ ├── [slug].vue # Post detail
│ ├── archive.vue # Archive
│ ├── about.vue # About
│ └── projects.vue # Projects
├── components/ # Reusable Vue components
├── public/
│ └── og-preview.html # OG preview tool
├── migrations/
│ └── 001_init.sql # D1 schema
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
- Cloudflare account (free)
- Resend account (free)

### Setup

```bash
git clone https://github.com/your-username/pixel-blog.git
cd pixel-blog
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
### 🔐 Environment Variables
| Variable | Purpose | Required |
|---|---|---|
| RESEND_API_KEY | Resend API key | ✅ |
| DEV_TO_API_KEY | Dev.to token | ❌ |
| HASHNODE_TOKEN| Hashnode publication ID | ❌ |
| HASHNODE_PUBLICATION_ID | Hashnode token | ❌ |
| MEDIUM_TOKEN | Medium | ❌ |
| TELEGRAM_BOT_TOKEN | Telegram bot token | ✅ |
| TELEGRAM_ALLOWED_CHAT_ID | Allowed chat ID | ✅ |
| NUXT_PUBLIC_SITE_URL | Site URL | ✅ |
		
### 📄 License
MIT — you are free to use, modify, and distribute this code.

### ⚠️ Important Notice
This is a **personal project**. It is built for my own use case and may not suit everyone's needs.

- I do not accept contributions, pull requests, or feature requests.
- Issues are welcome, but I may not have time to respond.
- The code is shared "as is" for learning and reference.

### 📧 Contact
Blog: [kbmjj123.cc](kbmjj123.cc)
GitHub: @kbmjj123

⭐ If you find this project useful, a star is appreciated.

| `LICENSE` | 确保仓库根目录有 `LICENSE` 文件 |
| `.env.example` | 后续创建时参考环境变量表格 |

直接复制以上内容，覆盖你的 `README.md` 即可。
```
