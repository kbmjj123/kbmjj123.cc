# PixelBlog — kbmjj123.cc

Pixel-styled indie developer blog. Nuxt 4 + Cloudflare D1/R2/Pages + Resend + Nuxt Content.

## Quick Start

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm typecheck    # type check
pnpm generate     # static generation
```

## Stack

| Layer | Tech |
|-------|------|
| Framework | Nuxt 4 (SSG/ISR) |
| Styling | Tailwind v4 + CSS vars |
| Content | Nuxt Content v3 |
| Database | Cloudflare D1 (SQLite) |
| Search | D1 FTS5 |
| Email | Resend |
| OG Images | @resvg/resvg-js / Satori |
| Deployment | Cloudflare Pages (Nitro `cloudflare_module`) |

## Design Identity

- **Brand**: `kbmjj123.cc` — green/gold pixel aesthetic
- **Name**: PixelBlog (code), displayed as "KB MJJ123 .cc ✦ Indie Log"
- **Colors**: `#0b0b12` bg, `#4ade80` green, `#fbbf24` gold, `#2a2a42` border
- **Fonts**: Press Start 2P (pixel), Inter (UI)
- **Layout**: 2.2fr/1fr grid (content + sidebar), 1150px max-width container

## Dir Structure

```
├── pages/                   # File-based routes
├── components/
│   ├── layout/              # AppHeader, AppSidebar, AppFooter, ThemeToggle, MobileTabBar, NavItem
│   ├── ui/                  # BaseButton, BaseInput, BaseBadge, BaseTag, BaseToast, BaseSkeleton, BaseSelect
│   └── og/                  # AppOgImage
├── composables/             # useTheme, useAuth, usePageSeo, useApi, useToast, useMarkdown, useKeyboardShortcuts
├── server/api/              # Nitro API routes
├── content/posts/           # Markdown blog posts
├── assets/css/              # main.css (tokens), markdown.css
├── types/                   # TS type definitions
├── public/                  # Static assets
├── .claude/docs/            # PRD + HTML design references
├── .claude/rules/           # Detailed development rules
├── nuxt.config.ts
└── wrangler.toml
```

## Design Reference

**All UI must match `.claude/docs/*.html`** — those are the ground truth.
- @.claude/rules/design-system.md — tokens, layout, components, animations, responsive
- @.claude/rules/pages-and-routing.md — routes, error/empty/loading states, nav

## Components & Pages

- @.claude/rules/component-architecture.md — layout/ui components, patterns, naming

## Content & Data

Posts via Markdown in `content/posts/`. Metadata synced to D1 on build.
- @.claude/rules/content-and-data.md — frontmatter, D1 schema, sync, search, related posts

## API Routes

All under `server/api/`. Comments, subscribe, newsletter, OG images, RSS, search, Telegram.
- @.claude/rules/api-patterns.md — full API reference

## Build & Deploy

Git push → Cloudflare Pages auto-builds. D1/R2/Workers for dynamic features.
- @.claude/rules/deployment-and-env.md — commands, CI pipeline, env vars, cron

## Coding Rules

- TypeScript strict mode. NO `any` — use proper types
- Nuxt 4 conventions: auto-imports, file-based routing, server routes
- All colors from CSS variables in `main.css` — no hardcoded hex except in variable defs
- Pixel font (`--font-pixel`) for: titles, nav, meta, tags, buttons, counters
- UI font (`--font-ui`) for: body, excerpts, descriptions
- Animation consistency: hover 0.15s, fade 0.5s, looped 3-4s
- Components emit events, no direct store mutations
- Content Markdown is source of truth — D1 is derived cache
- Every page handles loading, empty, and error states
