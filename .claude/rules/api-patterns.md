# API Patterns

All API routes under `server/api/`. Use Nitro server routes.

## Comment API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/comments/[slug]` | Get approved comments for post |
| POST | `/api/comments` | Submit comment (pending approval) |
| PUT | `/api/comments/[id]` | Admin approve comment |

## Subscription API

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/subscribe` | Subscribe email (sends verification) |
| GET | `/api/subscribe/verify?token=xxx` | Verify subscription |
| GET | `/api/subscribe/unsubscribe?email=xxx` | Unsubscribe |

## Newsletter

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/newsletter/send` | Admin send newsletter (rate limited 50/batch) |

## Distribution

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/distribute` | Trigger auto-distribution to Dev.to/Hashnode/Medium |

## OG Image

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/og/[slug].png` | Dynamic OG image (1200×630), cached 1 day |

## Search

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/search?q=&page=1&limit=20` | FTS5 full-text search |

## RSS & Sitemap

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/rss` | RSS 2.0 feed (last 20 posts) |

## Telegram Bot Webhook

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/telegram/webhook` | Telegram Bot incoming messages |

## Auth

- Admin routes use `ADMIN_SECRET` env var (HTTP Basic Auth or form login)
- Admin session stored in cookie/session storage
- `/admin` route guarded by auth middleware

## Error Handling

- All APIs return `{ success: boolean, data?: T, error?: string }`
- Rate limiting via Cloudflare (comment submission)
- Comments auto-flagged as spam if >3 links in content
