---
title: "Why My Nuxt 4 SSG Build Failed with 'ENOENT: /functions/[...].mjs' on Cloudflare Pages"
description: "A debugging walkthrough of a Nuxt 4 SSG build failure on Cloudflare Pages caused by a custom functions_directory in wrangler.toml overriding Nitro's build-time output."
date: 2026-07-16
category: "tools-workflow"
readTime: "6mins"
tags:
  - "#nuxt"
  - "#cloudflare"
  - "#deployment"
  - "#cicd"
draft: true
series: null
seriesOrder: null
seo:
  title: "Fix Nuxt 4 SSG Build Failure on Cloudflare Pages: ENOENT /functions/[...].mjs"
  description: "How I fixed a Nuxt 4 SSG build failing on Cloudflare Pages with ENOENT: no such file or directory for /functions/[...].mjs. Root cause: custom functions_directory in wrangler.toml overriding Nitro's generated output."
  keywords: []
relatedPosts:
  - "nuxt-cloudflare-zero-cost"
  - "going-serverless-part-1-why-cloudflare"
  - "platform-agnostic-ad-component-nuxt4-ssg"
---

## TL;DR

The Nuxt 4 SSG build on Cloudflare Pages was failing with `ENOENT: no such file or directory, open /functions/[...].mjs`. The root cause: `wrangler.toml` had a custom `functions_directory` pointing at a path that didn't exist at build time, overriding Nitro's build-generated functions directory. Local `wrangler pages dev` worked because it reads dev-generated functions, not build-generated ones. The fix was removing the custom `functions_directory` from `wrangler.toml` and letting Nitro manage it.

<!-- @user: needs real screenshot of the ENOENT error -->

## Background

This blog, [kbmjj123.cc](https://kbmjj123.cc), runs on Nuxt 4 with static site generation (SSG) deployed to Cloudflare Pages. The Nuxt config uses Nitro's `cloudflare_module` preset:

```ts
// nuxt.config.ts
nitro: {
  preset: 'cloudflare_module',
  cloudflare: {
    nodeCompat: true,
  },
}
```

When Nitro builds with the `cloudflare_module` preset, it generates a `functions` directory containing the server-side runtime code — including the catch-all `[...].mjs` handler that processes dynamic routes. This output is placed in `.output/server/functions/` by default.

`wrangler.toml` controls how Cloudflare Pages deploys this output. It has settings for the main entry point, assets directory, D1 bindings, and optionally a custom `functions_directory` that overrides where Cloudflare looks for Pages Functions.

## The Problem

The build passed locally with `pnpm build && wrangler pages dev .output/public`. Everything worked — local preview was fine.

But pushing the same commit to the remote repository triggered a Cloudflare Pages CI build that failed with:

```
Error: ENOENT: no such file or directory, open /functions/[...].mjs
```

The error pointed at a missing `[...].mjs` file inside the functions directory. But locally, the same file existed and the preview served it correctly.

I spent about three hours on this before finding the real cause. What made it hard: the error message pointed at a file that was clearly present in my local build output. I could open `.output/server/functions/[...].mjs` and see it. So why couldn't CI find it?

<!-- @user: needs real CI log output showing the error -->

## Investigation

### Checking the Build Output: Everything Looked Fine Locally

First step: check the local build output. `ls .output/server/functions/` showed the expected `[...].mjs` file. Running `wrangler pages dev .output/public` served the site without errors. This ruled out a build script issue or a missing dependency — the file was there.

I wasted about an hour re-running clean builds, deleting `.output/`, and comparing checksums. The file was consistently present.

### The CI Logs Showed a Missing Functions Directory

The Cloudflare Pages build logs showed the build completed successfully but the deploy step failed. The exact error was `ENOENT: no such file or directory, open /functions/[...].mjs`. Not a permission issue or a syntax error — the functions directory itself wasn't where Cloudflare expected it.

I checked the CI's generated output directory structure. The `.output/server/functions/` directory existed and contained the right files. But Cloudflare wasn't looking there.

### The Key Clue: Local `pnpm dev` vs `pnpm build`

The breakthrough came when I realized the error referenced `/functions/[...].mjs` — not `.output/server/functions/[...].mjs`. The path was relative, and Cloudflare was resolving it relative to the `functions_directory` setting in `wrangler.toml`.

Here's what was in my `wrangler.toml` at the time:

```toml
# Broken config
functions_directory = "./functions"
```

Nitro's `cloudflare_module` preset generates its functions output at `.output/server/functions/`. When you set a custom `functions_directory` in `wrangler.toml`, Cloudflare looks for functions at that path instead of Nitro's generated location.

The trick: `pnpm dev` doesn't read `functions_directory` from `wrangler.toml` the same way the build does. The dev command uses its own internal path resolution, which happened to find the functions. The build command strictly follows `wrangler.toml`, pointed at a nonexistent path, and failed.

## Solution

### Removing the Custom `functions_directory` from wrangler.toml

The fix was straightforward: delete the `functions_directory` line from `wrangler.toml` and let Nitro manage the functions output entirely.

```toml
# Before
functions_directory = "./functions"

# After — removed
```

That's it. The next CI build passed.

### Why Leaving Nitro in Charge Fixed the Problem

Nitro's `cloudflare_module` preset is designed to produce output that Cloudflare Pages understands natively. It places the functions bundle at a path that the default Cloudflare Pages build process expects. By overriding `functions_directory`, I was telling Cloudflare "look for functions over here instead," which broke the built-in contract between Nitro and the Cloudflare preset.

The project's Nuxt config already set `nitro.preset: 'cloudflare_module'` — Nitro was already configured to emit Cloudflare-compatible output. The custom `functions_directory` was redundant at best and destructive at worst.

## My Take

This bug ate three hours not because the fix was hard, but because the symptom was misleading. The local preview worked perfectly. Every mental model I had told me "if it works locally, it should work in CI." That assumption was wrong for two reasons:

1. `wrangler pages dev` and the CI build process resolve the `functions_directory` setting at different stages and from different working directories. What works in one context can fail in the other.

2. A redundant config override that's invisible during development becomes a hard blocker during deployment. The dev path silently ignores or compensates for the misconfiguration; the build path enforces it strictly.

For a blog built on the same tech stack — Nuxt 4 SSG on Cloudflare Pages — this experience confirmed something I've written about before in [Running a Zero-Cost SaaS with Nuxt and Cloudflare](/posts/nuxt-cloudflare-zero-cost): the simplicity of this stack is its strength, but only when you don't fight the defaults. Nitro's Cloudflare preset has a specific contract about where and how it places output. Overriding it without understanding that contract invites exactly this kind of CI-only failure.

## Result

The fix is deployed. Builds pass on every push. The `wrangler.toml` is now minimal — it specifies the Nitro output entry point, D1 bindings, and routes. Nothing else.

```toml
name = "kbmjj123-blog"
main = ".output/server/index.mjs"
compatibility_date = "2026-05-07"

assets = { directory = ".output/public" }

[[d1_databases]]
binding = "DB"
database_name = "kbmjj123-cc"
database_id = "xxxxx-xxxx-xxxx"

[vars]
API_BASE = "https://kbmjj123.cc"
```

No `functions_directory`. Nitro handles it.

## Lessons Learned

### Local Preview Is Not a Reliable CI Test

The most expensive lesson: `wrangler pages dev` does not validate the `wrangler.toml` config the same way the CI build does. Never assume a passing local preview means a passing CI build. If your deployment config has any custom path overrides, test them directly — ideally with `pnpm build && wrangler pages deploy --dry-run` rather than `wrangler pages dev`.

### Nitro's Cloudflare Preset Owns the Functions Contract

When using `nitro.preset: 'cloudflare_module'` or `'cloudflare_pages'`, Nitro takes responsibility for generating the functions directory at a specific location. Adding a custom `functions_directory` in `wrangler.toml` creates a conflict: Nitro writes to one path, Cloudflare reads from another. If you must customize the functions path, configure it through Nitro — not through `wrangler.toml`.

### Check Build-Only Settings When Local Dev Works

If a deployment error occurs only in CI and local preview is fine, suspect a setting that is:
- Only read during the build step (not during dev)
- A path override (`functions_directory`, `assets.directory`)
- An environment-specific variable

The easiest way to isolate: compare the full `wrangler.toml` against the project's Nitro config. Any overlap (like `functions_directory` vs Nitro's function output) is a red flag.

### Related

I've covered other Cloudflare deployment nuances in this series:
- [Why I Bet My Indie Project on Cloudflare Instead of a Server](/posts/going-serverless-part-1-why-cloudflare) — The trade-offs of building on Cloudflare
- [A Platform-Agnostic Ad Component for Nuxt 4 SSG](/posts/platform-agnostic-ad-component-nuxt4-ssg) — More Nitro + Cloudflare configuration patterns
