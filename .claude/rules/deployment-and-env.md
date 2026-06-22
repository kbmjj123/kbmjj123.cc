# Deployment & Environment

## Commands

```bash
pnpm dev          # local dev
pnpm build        # production build
pnpm generate     # static generation
pnpm preview      # preview production build
pnpm typecheck    # type check
```

## Cloudflare

- Platform: Cloudflare Pages + Workers (Nitro preset `cloudflare_module`)
- D1: SQLite-compatible, used for dynamic data (comments, subscribers, metadata)
- R2: Object storage for images and backups
- Auto-deploy on git push (configured in Cloudflare Dashboard)

## wrangler.toml

Pre-configured in project root. Uncomment D1/KV/R2 bindings as needed.
Use `wrangler secret put` for environment secrets.

## CI Pipeline

```
Git Push → Cloudflare Pages build
  ├── pnpm install
  ├── pnpm build
  │   ├── Read content/posts/ → generate pages
  │   ├── Sync script → update D1 posts + FTS5
  │   ├── Generate sitemap.xml
  │   ├── Generate RSS feed
  │   └── Generate OG images
  ├── Deploy to Pages edge
  └── Webhook → Worker
      ├── Distribute new posts (Dev.to/Hashnode/Medium)
      ├── Telegram notification
      └── Newsletter trigger (if auto-enabled)
```

## Cron Jobs (Workers)

| Schedule | Task |
|----------|------|
| Daily | Check broken links across all posts |
| Weekly | Backup D1 data to R2 (SQL/JSON) |

## Environment Variables

See `PRD §6` for full list. Key vars:

| Var | Required | Source |
|-----|----------|--------|
| `RESEND_API_KEY` | ✅ | Resend dashboard |
| `NUXT_PUBLIC_SITE_URL` | ✅ | Your domain |
| `ADMIN_SECRET` | ❌ | Custom pass |
| `TELEGRAM_BOT_TOKEN` | ❌ | @BotFather |

## Asset Pipeline

- OG images: `GET /api/og/[slug].png`, dynamic, cached 1 day
- Static assets in `public/`
- Images in R2 for user uploads (Telegram bot, admin)
