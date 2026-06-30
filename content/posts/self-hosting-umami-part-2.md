---
title: "Deploying Umami on Vercel + Supabase: The Connection String Traps"
description: "The official docs say set DATABASE_URL and deploy. What they don't tell you: two different connection strings, a silent port mismatch, and a prisma.config.ts that overrides everything."
date: 2026-07-01
category: "dev-practice"
readTime: "9mins"
tags:
  - "#deployment"
  - "#database"
  - "#vercel"
  - "#opensource"
image: "https://assets.kbmjj123.cc/blog/dev-practice/self-hosting-umami-part-2/part-2-prisma-config.png"
draft: false
series: "self-hosting-umami-on-vercel-supabase"
seriesOrder: 2
seo:
  title: "Umami Vercel Supabase Deployment: DATABASE_URL vs DIRECT_DATABASE_URL"
  description: "Fix the silent build hang when deploying Umami to Vercel with Supabase. Covers the two-URL requirement, port 6543 vs 5432, prisma.config.ts override, and IPv6 fallback errors."
  keywords:
    - "umami vercel supabase deployment"
    - "umami DATABASE_URL DIRECT_DATABASE_URL"
    - "prisma migrate deploy hanging vercel"
    - "supabase transaction pooler direct connection"
    - "prisma config ts datasource url"
---

## TL;DR

Deploying Umami to Vercel with a Supabase database requires two separate connection strings — not one. The official docs mention this, but they don't explain *why*, which meant I spent hours debugging a build that silently hung with no error output. The root cause was Prisma's migration command running against the connection pool port instead of the direct connection port, combined with a `prisma.config.ts` file that quietly overrode my environment variables.

---

## Background

After deciding to self-host Umami (covered in [Part 1](#)), the deployment path looked straightforward: fork the official repo, import to Vercel, set `DATABASE_URL`, deploy. The official documentation at `docs.umami.is/docs/install` lists the environment variables and the expected connection string format. I had a Supabase project ready. Should have been 20 minutes.

It took considerably longer than that.

The problems weren't random — they were all symptoms of the same underlying tension between how Prisma handles database migrations and how Supabase exposes its PostgreSQL connection. Once I understood that tension, everything clicked into place. But getting there required working through several failure modes that each looked like a different problem.

---

## The Problem: Build Hangs After Database Check

The Vercel build log would reach a point and stop:

```bash
✓ DATABASE_URL is defined.
✓ Database connection successful.
✓ Database version check successful.
```

Three green checkmarks, then nothing. No error. No timeout message. Just silence, until Vercel eventually killed the build job.

This is the worst kind of failure — not a crash with a traceable error, but a hang that tells you nothing about where it got stuck. I added `DEBUG="prisma:*"` to get verbose Prisma output and confirmed the process was entering `applyMigration()` inside `check-db.js` and not coming back.

The script was calling `prisma migrate deploy` internally. That command was the one hanging.

---

## Investigation

### Why `prisma migrate deploy` Can't Use the Connection Pool

Supabase exposes your PostgreSQL database through two different endpoints:

**Transaction pooler — port 6543**
This is PgBouncer sitting in front of your database. It manages a pool of persistent connections and hands them out to clients on demand. It's optimized for short-lived queries from serverless functions, where opening a new raw TCP connection for every request would be catastrophically slow. This is what `DATABASE_URL` should point to at runtime.

**Direct connection — port 5432**
This bypasses PgBouncer entirely and connects straight to the PostgreSQL process. It's slower to establish but supports the full PostgreSQL wire protocol without restrictions.

The critical constraint: **Prisma's migration engine requires a direct connection.** `prisma migrate deploy` needs to hold a transaction open across multiple DDL statements (CREATE TABLE, ALTER TABLE, index creation), acquire advisory locks, and write migration state to the `_prisma_migrations` table atomically. PgBouncer in transaction pooling mode does not support advisory locks, and it can drop the connection mid-migration if a statement takes too long. The result is a migration that hangs waiting for a lock that will never be granted, or silently fails partway through.

So the problem was structural: the build was trying to run database migrations through the connection pool, which is architecturally wrong regardless of credentials or network conditions.


![Diagram showing two Supabase connection paths: runtime queries through PgBouncer on port 6543, and Prisma migrations requiring direct connection on port 5432](/images/startup-umami/self-hosting-umami/supabase_connection_paths_diagram.svg)

### The Two-URL Fix

The correct setup requires both:

```bash
# Runtime queries — goes through PgBouncer connection pool
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Schema migrations — bypasses PgBouncer, direct to PostgreSQL
DIRECT_DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

Both environment variables need to be set in Vercel under Settings → Environment Variables, not just `DATABASE_URL`.

Where to find these strings in Supabase: navigate to your project, click the **Connect** button (green, near the top), then look for the "Transaction pooler" and "Direct connection" sections. Each one has a copy button that gives you the complete string with your project reference already filled in — you only need to substitute your database password.

<!-- 📸 IMAGE NEEDED (真实截图)
  Position: 正文此处，在"Where to find these strings"段落之后
  Type: 真实截图
  Shows: Supabase Connect 页面，显示 Transaction pooler 和 Direct connection 两个连接字符串区块
  Alt text: "Supabase Connect page showing Transaction pooler connection string on port 6543 and Direct connection string on port 5432"
  Caption: "Supabase Connect page — the two strings you need are both here."
  文件命名: self-hosting-umami-part-2-supabase-connect-page.png
  R2路径: https://assets.kbmjj123.cc/blog/dev-practice/self-hosting-umami-part-2/self-hosting-umami-part-2-supabase-connect-page.png
-->

### The Hidden Override: `prisma.config.ts`

Setting both environment variables wasn't enough. The build still hung.

The reason: Umami's repository includes a `prisma.config.ts` file that Prisma reads before it looks at environment variables. In the version I forked, it looked like this:

```ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

Notice what's missing: there's no `directUrl` field. This means Prisma was reading `DATABASE_URL` (the pooler, port 6543) for *everything*, including migrations — overriding the `DIRECT_DATABASE_URL` environment variable that the schema's `datasource` block would otherwise use.

The fix is to add the `directUrl` mapping explicitly:

```ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_DATABASE_URL'),
  },
});
```

With this in place, Prisma uses `DATABASE_URL` for runtime queries and automatically switches to `DIRECT_DATABASE_URL` when running migrations. The config file takes precedence over the schema's `datasource` block, so this is the right place to set it.

### The IPv6 Detour

Even after fixing `prisma.config.ts`, running `prisma migrate deploy` locally hit another wall:

```bash
connect EHOSTUNREACH 2600:1f16:1ce4:1c00:525c:bf25:5b8d:fff3:5432
```

Supabase's pooler domain resolves to both IPv4 and IPv6 addresses. Node.js (and therefore Prisma) will prefer IPv6 when it's available in the DNS response. My local network doesn't support IPv6 routing to external hosts, so the connection attempt to the IPv6 address fails immediately with `EHOSTUNREACH` — host unreachable.

The fix is to append `?family=4` to `DIRECT_DATABASE_URL` to force IPv4 resolution:

```bash
DIRECT_DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?family=4
```

This is a local development fix only. On Vercel's build infrastructure, IPv6 routing works correctly, so this parameter isn't needed there — but it's harmless to include if you want a single `.env` file that works in both environments.

### Special Characters in Passwords

One more trap: if your Supabase database password contains special characters like `!`, `@`, or `#`, the URL parser will break on them. The error looks like this:

```bash
TypeError: Invalid URL
    at new URL (node:internal/url:819:25)
input: 'postgres://postgres:yourP@ss!word#123@...'
```

The characters `!` `@` `#` have reserved meaning in URIs. The safest fix is to reset your Supabase database password to one using only alphanumeric characters. The alternative — percent-encoding each character (`!` → `%21`, `@` → `%40`, `#` → `%23`) — works but makes the string brittle to edit later.

---

## Solution

The complete `prisma.config.ts` after all fixes:

```ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_DATABASE_URL'),
  },
});
```

The complete `.env` / Vercel environment variable set:

```bash
# Vercel runtime — connection pool, serverless-safe
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Prisma migrations — direct connection, bypasses PgBouncer
DIRECT_DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?family=4

# Required by Umami
APP_SECRET=any-random-string-you-choose
```

Substitute `[project-ref]`, `[region]`, and `[password]` with values from your Supabase Connect page. The `[project-ref]` looks like `abcdefghijklmnop` and is already embedded in the strings Supabase gives you — you don't need to find it separately.

---

## My Take

The official Umami documentation does mention both `DATABASE_URL` and `DIRECT_DATABASE_URL`. What it doesn't explain is the *reason* — that PgBouncer in transaction mode blocks the advisory locks Prisma's migration engine depends on. Without understanding why, the two-URL requirement looks like an arbitrary configuration detail you might skip. That's exactly what I did on the first attempt.

The `prisma.config.ts` override is the nastier trap because it's a file in the repository that silently wins over your environment variables. If you set `DIRECT_DATABASE_URL` correctly in Vercel but the config file doesn't map it to `directUrl`, Prisma ignores your variable entirely. The fix is two lines, but you have to know to look for the file.

Worth noting: this architecture — pooler for runtime, direct for migrations — is not Umami-specific. Any application using Prisma with Supabase will hit the same constraint. The pattern of needing two database URLs is becoming standard for serverless Prisma deployments, but the tooling doesn't yet make it obvious at setup time.

---

## Result

With both URLs set correctly and `prisma.config.ts` updated, the local development server started cleanly and the Umami login page loaded at `localhost:3000`.

<!-- 📸 IMAGE NEEDED (真实截图)
  Position: 正文此处
  Type: 真实截图
  Shows: 本地运行的 Umami 登录页面，浏览器地址栏显示 localhost:3000
  Alt text: "Umami login page running locally at localhost:3000 after successful database connection"
  Caption: "Local dev server up — after fixing the connection config, this took about 30 seconds to start."
  文件命名: self-hosting-umami-part-2-local-login.png
  R2路径: https://assets.kbmjj123.cc/blog/dev-practice/self-hosting-umami-part-2/self-hosting-umami-part-2-local-login.png
-->

The database connection was stable, migrations ran cleanly through `DIRECT_DATABASE_URL`, and runtime queries routed through the PgBouncer pool on port 6543 as intended.

Vercel deployment, however, still had one more blocker — not related to the database connection at all. That's the subject of Part 3.

---

## Lessons Learned

**PgBouncer in transaction mode blocks Prisma migrations.** This isn't a bug or a misconfiguration — it's an architectural incompatibility. Prisma's migration engine uses PostgreSQL advisory locks that PgBouncer doesn't forward in transaction pooling mode. Always use a direct connection (port 5432) for `prisma migrate deploy`, regardless of what your runtime `DATABASE_URL` points to.

**`prisma.config.ts` wins over environment variables.** If this file exists in your project and doesn't map `directUrl`, your `DIRECT_DATABASE_URL` variable is effectively ignored. Check this file first when Prisma migration behavior doesn't match what your env vars suggest.

**IPv6 preference is a local network issue, not a Supabase issue.** The `?family=4` parameter forces IPv4 and resolves the `EHOSTUNREACH` error without touching anything else. It's safe to include in your `DIRECT_DATABASE_URL` for both local and Vercel environments.

**Supabase passwords with special characters will break URL parsing.** Set a clean alphanumeric password before you start. Fixing it after you've already embedded the encoded version in multiple places is tedious.

---

*Part of the "Self-Hosting Umami on Vercel + Supabase" series. [← Part 1: Why I Left Umami Cloud](#) · [Part 3: GeoIP, Migration Bypass, and Git LFS →](#)*
