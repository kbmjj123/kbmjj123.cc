---
title: Building a Pixel Email Subscription System for Your Indie Blog
date: 2026-07-03
excerpt: How I built a lightweight, zero-cost email subscription system for kbmjj123.cc using Resend, Cloudflare D1, and React Email-style templates — with a pixel aesthetic to match.
category: dev-practice
tags: ["#nuxt", "#cloudflare", "#resend", "#email", "#indieweb"]
series: Building PixelBlog
series_order: 1
---

## The Why

Every indie blog needs a way to keep readers coming back. RSS is great, but email reaches people where they already live. I wanted a subscription system that was:

- **Zero-cost** — running entirely within free tiers
- **Lightweight** — no external marketing platforms, no bloated dependencies
- **Pixel-consistent** — every touchpoint, even emails, should feel like part of the blog
- **Self-contained** — data stays in my D1 database, not a third-party SaaS

This post walks through the design decisions, architecture, and implementation of the email subscription system on [kbmjj123.cc](https://kbmjj123.cc).

## Design Process

Before writing any code, I sketched out a full spec document. I actually started with a much more complex spec inspired by [aifindr.org](https://aifindr.org) — a directory platform with 20+ email scenarios across 6 categories (submission confirmations, review results, payment receipts, backlink monitoring, etc.).

That was overkill for a personal blog.

After stripping it down, the final scope was refreshingly small:

| Scenario | Type | Method |
|----------|------|--------|
| Verify email on subscribe | Transactional | Resend API |
| Newsletter (multi-post roundup) | Manual campaign | Resend Dashboard |

That's it. Two scenarios. No welcome emails, no comment notifications, no cron jobs, no Brevo integration.

## Architecture Decisions

### Single Channel: Resend Only

[Resend](https://resend.com) provides 3,000 emails/month free — more than enough for a personal blog. No Brevo, no Mailchimp, no SendGrid.

| Why not Brevo | Why Resend |
|---------------|------------|
| Free tier forces "Sent with Brevo" watermark | Clean branding |
| Marketing-focused, heavy | Developer-first, simple API |
| Wouldn't need it until >3k emails/month | 3k free covers years at current scale |

### Manual Newsletter Sending

New post notifications are sent manually via the Resend Dashboard, not automated. This means I can batch multiple posts into a single newsletter rather than spamming subscribers for every single publish. The API routes only handle subscription management (submit → verify → unsubscribe).

### No React Email Runtime

I initially planned to use `@react-email/components` with React DOM rendering at runtime. But in a Cloudflare Workers environment, bundling React + react-dom adds significant weight and potential compatibility issues. Instead, I wrote the email template as a pure function that returns an HTML string — same component-based architecture, zero runtime overhead.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Nuxt 4 (Nitro server routes) |
| Database | Cloudflare D1 (SQLite) |
| Email API | Resend (REST via `fetch`) |
| Templates | HTML string functions (React Email-style architecture) |
| Deployment | Cloudflare Pages (auto-build on push) |
| Local Dev | `nuxi dev` with `.dev.vars` for secrets |

## Implementation

### D1 Schema

Two tables. Minimal. No joins needed for the common paths.

```sql
CREATE TABLE subscribers (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  email             TEXT NOT NULL UNIQUE,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending', 'active', 'unsubscribed')),
  verification_token TEXT NOT NULL,
  source            TEXT DEFAULT 'sidebar',
  subscribed_at     TEXT DEFAULT (datetime('now')),
  verified_at       TEXT,
  unsubscribed_at   TEXT,
  created_at        TEXT DEFAULT (datetime('now'))
);

CREATE TABLE email_logs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriber_id INTEGER REFERENCES subscribers(id),
  email_type    TEXT NOT NULL CHECK(email_type IN ('verify', 'newsletter')),
  recipient     TEXT NOT NULL,
  subject       TEXT NOT NULL,
  status        TEXT DEFAULT 'sent' CHECK(status IN ('sent', 'failed', 'bounced')),
  resend_id     TEXT,
  error         TEXT,
  created_at    TEXT DEFAULT (datetime('now'))
);
```

### API Routes

Three endpoints, all under `/api/subscribe/`:

```
POST /api/subscribe           — Submit email, generate token, send verification
GET  /api/subscribe/verify    — Click link in email, activate subscription
GET  /api/subscribe/unsubscribe — One-click unsubscribe
```

The verification flow:

```
User fills form → POST /api/subscribe → INSERT pending record → Resend API sends email
→ User clicks link in email → GET /api/subscribe/verify → UPDATE to active → 302 redirect to homepage
```

### Email Template

The verification email follows the blog's pixel design system:

```
┌─────────────────────────────────────┐
│  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  │  ← green dashed bar
│                                     │
│        KB MJJ123 .cc                │  ← pixel font, gold
│        ✦ INDIE DEV LOG ✦           │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  [ Confirm Subscription ]   │    │  ← pixel heading
│  │                             │    │
│  │  Thanks for subscribing!    │    │
│  │  Click to verify:           │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │ ✓ Confirm Subscribe │    │    │  ← green CTA button
│  │  └─────────────────────┘    │    │
│  │                             │    │
│  │  ─── Recent Posts ───       │    │
│  │  Post title 1               │    │
│  │  Post title 2               │    │  ← shows subscription value
│  │  Post title 3               │    │
│  └─────────────────────────────┘    │
│                                     │
│  Footer: unsubscribe link           │
└─────────────────────────────────────┘
```

### Sidebar Widget

A Vue component with three states — idle, success, error — matching the pixel widget design:

```
┌─────────────────────┐
│ ▸ Subscribe          │  ← gold pixel font
│                      │
│ Get latest posts     │
│ ┌─────────────────┐  │
│ │ your@email.com  │  │  ← dark input, green focus
│ └─────────────────┘  │
│ [ Subscribe ]        │  ← green border button
│                      │
│ Low frequency ·      │
│ Unsubscribe anytime  │  ← muted footnote
└─────────────────────┘
```

### Email Sending

I chose to call the Resend API directly with `fetch` rather than using their Node.js SDK. This avoids any compatibility issues with Cloudflare Workers and keeps the bundle lean:

```typescript
const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ from, to, subject, html }),
})
```

## What I Deliberately Skipped

| Feature | Reason |
|---------|--------|
| Welcome email | Verification email already serves this purpose |
| Auto-notify on new post | Want to batch posts into curated newsletters |
| Comment notifications | Blog doesn't have comments yet |
| Cron jobs | No scheduled emails needed |
| Newsletter editor in admin | Resend Dashboard works fine for manual sends |
| Double opt-in for unsub | One-click is respectful enough |

## Things That Bit Me

### TypeScript + D1 + Cloudflare Workers

The `@cloudflare/workers-types` package doesn't support generic type arguments on D1's `.first()` method. This caused TS2347 errors across all three API routes. The fix was using `as` type assertions instead:

```typescript
// Before (doesn't compile):
const sub = await db.prepare(sql).bind(email).first<Subscriber>()

// After (works):
const sub = await db.prepare(sql).bind(email).first() as Subscriber | null
```

### Sidebar Widget Placement

I initially added the subscribe widget to `AppSidebar.vue`, only to discover the actual layout uses a completely different sidebar (`PostSidebar` on article pages, inline widgets on index pages). The design system had evolved past the component structure I assumed.

**Lesson**: Always check the layout and page templates before assuming which components are active. A `grep -rn 'Sidebar' layouts/` would have saved a commit.

## Running It

For anyone who wants to do something similar:

```bash
# 1. Install deps (resend SDK optional — you can use fetch directly)
pnpm add resend @react-email/components

# 2. Create D1 tables
npx wrangler d1 execute DB --remote --file=server/database/migrations/001_create_subscribers.sql

# 3. Set your Resend API key
#    Local: echo "RESEND_API_KEY=re_xxx" > .dev.vars
#    Production: Cloudflare Dashboard → Environment Variables

# 4. Deploy
git push
```

## What's Next

The subscription system is live, but I plan to iterate:

- **Subscribe confirmation page** — a pixel-themed landing page after verification, instead of a silent redirect
- **Newsletter archive** — past newsletters as accessible posts on the blog
- **Subscriber-only content** — occasional deep-dives gated behind email (feeds the subscriber loop)
- **React Email dev server** — proper preview workflow for email templates

But for now, the MVP is shipped. Three API routes, one sidebar component, one email template, two D1 tables. Zero monthly cost.

---

*Code and specs available at [github.com/kbmjj123/kbmjj123.cc](https://github.com/kbmjj123/kbmjj123.cc). The email system spec is in `.claude/specs/email-system.md`.*
