---
title: "Running a Zero-Cost SaaS with Nuxt and Cloudflare"
description: "How I serve 5k+ daily UV on a pure static stack with Nuxt SSG, Cloudflare Pages, and R2 — and why I still haven't added Workers, D1, or KV."
date: 2026-07-13
category: "tools-workflow"
readTime: "8mins"
tags:
  - "#nuxt"
  - "#cloudflare"
  - "#deployment"
  - "#saas"
image: "/images/tools-workflow/nuxt-cloudflare-zero-cost/nuxt-cloudflare-zero-cost-architecture.svg"
draft: false
relatedPosts:
  - "nuxt4-cloudflare-three-deployment-modes"
series: null
seriesOrder: null
seo:
  title: "Zero-Cost SaaS Frontend with Nuxt SSG + Cloudflare Pages (5k+ UV, No Workers)"
  description: "Real-world breakdown of a 700-page Nuxt SSG site on Cloudflare Pages and R2, handling 5k+ daily UV with zero runtime compute cost."
  keywords:
    - "nuxt ssg cloudflare pages"
    - "zero cost saas frontend"
    - "cloudflare r2 onnx models"
    - "static site 700 pages build time"
    - "no workers no d1 architecture"
---

## TL;DR

I run a 700+ page SaaS frontend on Nuxt SSG + Cloudflare Pages + R2. It handles 3.5k+ daily UV, costs nothing to host, and still doesn't need Workers, D1, or KV. The catch: builds take 10 minutes, ONNX models load in ~10 seconds, and I can't add any feature that needs a server. Here's the full breakdown.

## Background

The project is a pure browser-side image tool — GIF processing, AI-powered edits via ONNX inference, batch format conversion. No user accounts, no saved projects, no server-side logic. Everything runs in the browser.

When I started, I set one constraint: don't pay for hosting until the product demands it. Not "keep it cheap" — actually zero. That ruled out Node servers, VPS, even serverless functions. The only path that made sense was static generation plus edge storage.

At the time, the site had maybe 50 pages. I didn't know if SSG would hold up at 10x that. It did.

## Architecture & Deployment Flow

![Cloudflare stack architecture: Nuxt SSG output to Cloudflare Pages via Git, R2 for ONNX models and blog images, Edge network serving static assets globally with no Workers](/images/tools-workflow/nuxt-cloudflare-zero-cost/nuxt-cloudflare-zero-cost-architecture.svg)

The whole thing runs on three pieces:

**Nuxt SSG** generates every page at build time. Blog posts, tool pages, OG images — all pre-rendered HTML. `nuxi generate` crawls the routes and spits out a fully static `dist/`.

**Cloudflare Pages** watches the `main` branch on GitHub. Push triggers a build, and ~10 minutes later the new version is live on the edge network. I mapped my custom domain in the Pages dashboard and that was it — no DNS gymnastics, no reverse proxy.

**Cloudflare R2** stores two things: blog images and ONNX model files. Models range from 1 MB to 20 MB depending on the task. Keeping them out of the Git repo means the build stays fast and the repo stays cloneable.

There is no Workers layer. No D1 database. No KV namespace. The edge serves static files and the browser does the rest.

## Real Usage: What 5k+ Daily UV Looks Like

<!-- TODO: Replace with real Cloudflare Analytics screenshot -->
![Cloudflare Analytics dashboard showing 3.5k+ daily unique visitors over a 7-day period](/images/tools-workflow/nuxt-cloudflare-zero-cost/nuxt-cloudflare-zero-cost-analytics.webp)

The site currently gets over 5,000 unique visitors per day. GIF-related pages and AI image processing pages account for roughly 80% of that traffic. The remaining 20% is split across blog posts, format converters, and a handful of utility pages.

What surprised me: the traffic pattern barely registers as load. Since every request is a static file served from the edge, there's no backend to saturate. A spike from 500 to 5,000 UV doesn't change the infrastructure story at all — Cloudflare just serves more files from more edge nodes.

The constraint isn't cost. It's product scope. As long as the tool can do everything in the browser, the architecture holds.

## The Hidden Cost of "Zero-Cost"

Zero hosting bill doesn't mean zero trade-offs. Here's what I actually pay in time and user experience:

### 10-Minute Builds, Every Push

700+ pages with pre-rendered OG images takes about 10 minutes to build on Cloudflare Pages. That's 10 minutes from `git push` to the new version being live. If I catch a typo right after pushing, I wait. If I'm iterating on a design tweak, I wait.

For a solo dev shipping a few times a week, this is fine. Annoying sometimes, but fine. If I were shipping multiple times a day or collaborating with someone else, I'd need to rethink the pipeline — maybe incremental builds or a preview environment outside of Pages.

### ONNX Models: 10 Seconds of Nothing

The smallest model is 1 MB. The largest is 20 MB. Both sit in R2. On first visit to an AI tool page, the browser downloads the model before anything happens. On a fast machine with a good connection, that's 3–5 seconds. On an average laptop on home Wi-Fi, it's closer to 10 seconds.

Users see a blank state during that window. I added a loading indicator, but it doesn't change the fact that the tool is unusable until the download finishes. There's no way around this without either shrinking the models (accuracy trade-off) or moving inference to a server (cost trade-off). Right now I'm living with the delay.

### No Dynamic Features, Period

Want personalized recommendations? Need a server. Want to save user preferences across devices? Need a database. Want A/B testing on tool layouts? Need something that runs logic at request time.

Every time I think about a feature that would genuinely improve the product, I have to ask: does this justify breaking the zero-cost architecture? So far the answer has been no. But the list of "would be nice" features is growing.

## Why I Didn't Add Workers, D1, or KV

I didn't skip Workers because I'm against serverless. I've used them in other projects and they work fine. I skipped them here because the product didn't need them.

When I started building, I went through the checklist:

- **Do I need server-side rendering?** No. Every page is the same for every user. SSG covers it.
- **Do I need to persist user data?** No. Everything happens in the browser session. No accounts, no saved state.
- **Do I need API routes?** No. ONNX inference runs client-side. GIF processing uses Canvas APIs.
- **Do I need scheduled jobs or webhooks?** No.

If any of those had been a yes, I would have added Workers immediately. But adding them just because "you'll probably need them later" would have introduced cold starts, a pricing tier to track, and an extra layer of abstraction for zero immediate value.

The rule I landed on: add backend infrastructure when the product logic demands it, not when the tech stack makes it easy. Cloudflare makes it very easy to bolt on Workers. That doesn't mean you should.

## My Take

"Zero-cost SaaS" gets thrown around as a badge of honor, but it only works when the product shape matches the architecture. My project is a pure browser tool — no auth, no persistence, no server-side logic — so the static stack fits naturally. If your project needs user accounts or dynamic data, this architecture will feel like a straitjacket, not a smart optimization.

The 10-minute builds and 10-second model loads are real trade-offs. I accept them because the alternative — adding paid infrastructure for a product that hasn't proven it needs it — feels premature. But I wouldn't recommend this stack to someone building a collaborative tool or anything with real-time features. The cost you save on hosting, you pay in product constraints.

Static isn't a philosophy. It's a phase. The architecture stays static until the product outgrows it, and the moment that happens, I'll add Workers and D1 without hesitation. The goal isn't to keep costs at zero forever. It's to delay the first infrastructure decision until the product genuinely earns it.

## Lessons Learned

- **Match the stack to the product, not the other way around.** A browser-only tool on a static stack makes sense. A collaborative tool on the same stack would be painful. Start with what the product actually does.
- **Build time scales with page count.** At 50 pages, SSG builds took under a minute. At 700+, it's 10 minutes. If you're planning a content-heavy site, test build performance early — it's harder to fix after you've added 500 markdown files.
- **Large client-side assets need a loading strategy.** ONNX models at 20 MB don't load instantly. A loading indicator is the bare minimum. If your users expect sub-second interactions, you either need smaller models or server-side inference.
- **Don't add Workers because you can.** If none of your features need server-side logic, Workers add complexity with no benefit. Wait until a specific feature forces the decision.
- **Static isn't the destination — it's the default.** Stay static as long as the product allows, but treat it as a temporary phase, not a permanent identity. The moment dynamic features create more value than they cost, switch.
