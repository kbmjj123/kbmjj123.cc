# Content & Data Layer

## Content Management

- Write posts as Markdown in `content/posts/*.md`
- Frontmatter (YAML): title, date, excerpt, category, tags[], series, series_order, is_pinned, status (draft/published/scheduled), scheduled_at, cover, author
- Drafts (`status: draft`) excluded from production
- Scheduled posts: compare `scheduled_at` at build time

## Metadata Sync

- Triggered by `build:done` hook in `nuxt.config.ts`
- Scans `content/posts/` → parses frontmatter + content → upserts D1 `posts` table
- Markdown file is source of truth — always overwrites D1 on conflict
- FTS5 virtual table `posts_fts` auto-synced via D1 triggers (insert/update/delete)

## D1 Schema

Tables defined in PRD `§3`:
- `posts` — slug, title, content, excerpt, date, category, tags(JSON), series, series_order, is_pinned, status, scheduled_at, views, content_path
- `posts_fts` (FTS5) — slug, title, content, excerpt, tags
- `comments` — post_slug, parent_id, author_name, author_email, content, is_approved, is_spam, ip_address
- `subscribers` — email, name, status, verified, source, verification_token
- `email_logs` — subscriber_id, email_type, status, error
- `users` — reserved for admin multi-user
- `post_actions` — like/bookmark tracking

## Search

- FTS5 via D1 at `GET /api/search?q={query}&page=1&limit=20`
- Returns matched posts with title highlights, excerpt snippets, total count

## Related Posts

- Match on `tags` JSON array, same-tag posts sorted by date, max 5
- Implement in `server/api/posts/[slug]/related.get.ts`
