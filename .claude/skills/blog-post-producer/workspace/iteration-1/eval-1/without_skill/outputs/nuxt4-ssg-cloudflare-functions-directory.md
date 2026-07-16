---
title: "Nuxt 4 SSG Build Fails on Cloudflare Pages: The Hidden functions_directory Trap"
description: "How a 'Error: ENOENT: no such file or directory, open /functions/[...].mjs' took me 3 hours to debug — and why local wrangler preview worked while CI failed."
date: 2026-07-16
category: "tools-workflow"
readTime: "5mins"
tags:
  - "#nuxt"
  - "#cloudflare"
  - "#deployment"
  - "#debugging"
image: null
draft: false
series: null
seriesOrder: null
seo:
  title: "Fix Nuxt 4 SSG 'ENOENT functions directory' Error on Cloudflare Pages"
  description: "How a missing functions_directory config in wrangler.toml causes Nuxt 4 SSG builds to fail on Cloudflare Pages — and why local preview hides the bug."
  keywords:
    - "nuxt 4 ssg build fails cloudflare pages"
    - "nitro cloudflare_module functions directory"
    - "ENOENT functions mjs cloudflare pages"
    - "wrangler pages dev vs build functions path"
    - "nuxt 4 cloudflare deployment debug"
---

## TL;DR

Nitro's `cloudflare_module` preset generates a `functions/` directory at build time. If your `wrangler.toml` has a custom `functions_directory` pointing at a non-existent path, the build fails with `ENOENT`. The trick is that `pnpm dev` works fine locally — it generates functions through a completely different path than `pnpm build` does. Remove the custom `functions_directory` and let Nitro manage it.

## Background

I was laying down the Cloudflare deployment pipeline for this very blog. Nuxt 4, SSG mode, Nitro's `cloudflare_module` preset. Nothing exotic. I'd read the docs, set up `wrangler.toml`, wired the GitHub Action. The local dev server was humming. Time to ship.

I pushed to `main`, Cloudflare Pages picked up the commit, started building — and then I saw the wall of red.

## The Error

```
Error: ENOENT: no such file or directory, open /functions/[...].mjs
```

No typo in my code. No broken import. No missing dependency. The error was coming from Nitro's build output step — it had generated a `functions/[...].mjs` file, tried to place it in the `functions` directory, and the path didn't exist.

Here's what the build log looked like:

```
✔ Generated public dist/
✗ Error: ENOENT: no such file or directory, open /functions/[...].mjs
    at Object.openSync (node:fs:...)
    at Object.writeFileSync (node:fs:...)
    at writeFunctions (nitro/dist/...)
```

The build completed the static asset generation phase, then fell over during the functions output step. Everything before that point succeeded — pages were generated, assets were compiled, the `dist/` folder looked healthy. But Nitro couldn't finish its job because the directory it was told to write into didn't exist.

## Investigation

My first instinct was to re-run the build locally. `pnpm build` — that worked fine. The functions directory was created and populated normally. I compared the local `.output` directory against what CI produced. Everything matched on my machine.

Then I tried `wrangler pages dev` to preview the built output locally. That also worked. The pages served, the routes resolved. No errors.

This is where the debugging time sink started.

If the build works locally and fails only in CI, you assume environment mismatch — different Node version, missing system dependencies, permission issues. I spent a good hour going down that rabbit hole: pinning Node versions, checking Cloudflare's build image, comparing npm lockfiles.

It wasn't any of those things.

## The Real Problem

The culprit was in `wrangler.toml`. I had this line:

```toml
functions_directory = "functions"
```

This was left over from an earlier experiment where I was manually managing Cloudflare Functions. In a standard Nuxt + Nitro setup, you don't need this at all — especially with the `cloudflare_module` preset. Nitro generates its own `functions/` directory during the build, complete with the worker entry points, route handlers, and the `_routes.json` file that tells Cloudflare which paths are static and which need the worker.

Here's what was happening under the hood:

| Command | Nitro Behavior | Result |
|---------|---------------|--------|
| `pnpm dev` | Nitro dev server creates a temporary functions directory relative to the project root | Works — dev mode generates functions in a default location |
| `pnpm build` | Nitro generates functions inside `.output/server/` (or `.cloudflare/` depending on preset) | Works — local build can write anywhere |
| CI build on Cloudflare | Nitro tries to write functions to the path specified by `functions_directory` in `wrangler.toml` | **Fails** — that path doesn't exist in the CI sandbox |

The key insight: `pnpm dev` and `pnpm build` don't use the same code path for generating the functions directory. The dev server creates its own working directory and doesn't consult `wrangler.toml` the same way the production build does. That's why local development was flawless while CI consistently failed.

My `wrangler.toml` was telling Nitro to put its output in a `functions/` directory at the project root. Locally, that directory either existed from previous dev sessions or was created implicitly. In Cloudflare's CI sandbox — a fresh checkout every time — the directory didn't exist, and Nitro's build pipeline didn't create it. It just tried to write and fell over.

## The Fix

```toml
# Before (broken in CI):
# functions_directory = "functions"

# After (let Nitro manage it):
# Remove the line entirely — don't override functions_directory
```

Remove `functions_directory` from `wrangler.toml`. Nitro's `cloudflare_module` preset knows where to put its output. It generates the correct directory structure during the build, and Cloudflare Pages picks it up automatically from the expected location (`dist/` or the Nitro-generated output). You don't need to help it.

For the `cloudflare_module` preset specifically, Nitro places the functions output at the path that Cloudflare Pages expects by default. Overriding it just adds a failure point with zero benefit — Nitro never writes to a custom path correctly in all environments because the preset is designed to manage the functions directory itself.

## My Take

This was a 3-hour lesson in how build tooling behaves differently across environments. Three things made it harder than it should have been:

**Local `wrangler pages dev` gave false confidence.** It worked, so I assumed the build output was correct. But local preview reads from a dev-generated state, not the build-generated one. These are different code paths, and they behave differently with custom config.

**CI logs didn't scream "config problem."** An `ENOENT` error looks like a filesystem or permission issue. Nothing in the error message pointed at `wrangler.toml`. The error was happening deep in Nitro's pipeline, not at config validation time. There was no "hey, your `functions_directory` is bogus" warning.

**I assumed parity between dev and prod.** After verifying the code was correct and the dependencies matched, I ruled out configuration as the cause — because the config was the same locally and in CI. But "same config" doesn't matter when one environment reads it and the other ignores it for certain operations.

The lesson that sticks: when deploying to Cloudflare Pages with Nitro, let the build tool manage its own output directories. `wrangler.toml` configuration around functions paths is designed for hand-written Cloudflare Functions, not for Nitro-generated ones. If you're using Nitro's `cloudflare_module` preset, the functions output is Nitro's responsibility — don't override it.

## Lessons Learned

- **`pnpm dev` and `pnpm build` use different code paths for functions generation.** Dev mode working does not mean the build will work. Always run a production build locally before pushing to CI.
- **Custom `functions_directory` in `wrangler.toml` conflicts with Nitro's `cloudflare_module` preset.** The preset manages its own output paths. Overriding them introduces a difference between local and CI environments.
- **`wrangler pages dev` reads dev-generated state, not build output.** A passing local preview doesn't validate your production config. It validates a different state entirely.
- **An `ENOENT` error during build output isn't always a file-system issue.** Check your Cloudflare Pages project settings and `wrangler.toml` for configuration that might point at non-existent paths in the CI sandbox.
- **When a build works locally but fails in CI, don't immediately assume environment mismatch.** Compare the configuration that each environment actually reads — they might not be reading the same thing.
- **Nitro's `cloudflare_module` preset is designed to be self-managing.** Don't override `functions_directory`, `routes`, or other output-related config. The preset handles them for you, and any override is likely to cause issues.
