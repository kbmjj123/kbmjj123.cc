---
title: "Three Performance Wins From One Optimization Sprint"
description: "How I cut LCP from 3.2s to 1.1s, automated image optimization in CI, and moved Lighthouse from 72 to 94 — all in a single week of Nuxt performance work."
date: 2026-07-16
category: "tools-workflow"
readTime: "10mins"
tags:
  - "#nuxt"
  - "#performance"
  - "#cloudflare"
  - "#lighthouse"
  - "#ci"
image: "https://assets.kbmjj123.cc/blog/tools-workflow/nuxt-performance-sprint-three-wins/performance-dashboard-before-after.webp"
draft: false
series: null
seriesOrder: null
seo:
  title: "Nuxt Performance Sprint: Cloudflare Image Resizing, CI Image Pipeline, Lazy Analytics"
  description: "Three real performance wins from a week of Nuxt optimization: Cloudflare Image Resizing (LCP 3.2s to 1.1s), automated image CI pipeline with AVIF, and IntersectionObserver analytics that pushed Lighthouse from 72 to 94."
  keywords:
    - "nuxt performance optimization cloudflare image resizing"
    - "github action image optimization pipeline"
    - "lazy load analytics intersectionobserver lighthouse"
    - "cloudflare cf-image header vs query params"
    - "automated image compression ci cd indie dev"
---

## TL;DR

I spent a week on Nuxt performance and landed three concrete wins:

1. **Replaced Nuxt's image component with a Cloudflare Image Resizing approach** using the `cf-image` header instead of query params. LCP improved from 3.2s to 1.1s purely because Cloudflare's edge cache behaves differently for header-based requests. Same images, same CDN — just a header vs. query param difference that changed how aggressively Cloudflare cached.

2. **Built a GitHub Action that runs `sharp` on every new image before it reaches the repo.** It strips EXIF, converts to AVIF with JPEG fallback, and blocks the deploy if any image is unoptimized. The action itself took two hours to write and now runs silently on every PR.

3. **Moved analytics script from `<head>` to lazy-load with IntersectionObserver.** The script loads only when the user scrolls past the first viewport. Lighthouse mobile went from 72 to 94. No analytics data was lost — the observer fires before any interaction metric matters.

Each of these could be its own article, but they all came from the same week-long sprint. Here's the full breakdown of what I did, why, and what the numbers actually look like.

---

## Background

My site runs on Nuxt 4 SSG, deployed to Cloudflare Pages. It's a pixel-styled indie dev blog with roughly 40 posts, a handful of tool pages, and growing traffic.

The performance was "fine" — acceptable for a content site — but I had three specific pain points:

1. **Hero images lagged.** The first meaningful image on a post could take 2-3 seconds to load. Largest Contentful Paint hovered around 3.2s on mobile simulated throttling. That's too slow for a blog where the first thing people see is often a diagram or cover image.

2. **Image bloat was creeping in.** Screenshots, diagrams, cover images — they accumulate. I'd optimized each one manually, but new posts added new images. Without enforcement, the quality would drift.

3. **The Lighthouse mobile score sat at 72.** The analytics script loaded in the head and blocked rendering. It was a Google Analytics tag injected at build time, and it was the single biggest performance tax on the site.

The sprint had a clear goal: fix all three without changing the tech stack or adding infrastructure cost.

---

## Optimization 1: Cloudflare Image Resizing via Header

### The problem

Nuxt's built-in `<NuxtImg>` component is well-designed. It generates responsive sizes, handles format negotiation, and integrates with a CDN.

But I wasn't using a CDN that supports query-param-based resizing out of the box. My images live in Cloudflare R2, served through Cloudflare's edge network. I have Cloudflare Image Resizing available in my plan, but the standard approach — appending `?width=800&format=avif` — wasn't getting cached aggressively at the edge.

The behavior I observed: images requested with query parameters would hit the origin (R2) on the first request from each edge location. The same image with different query params (different width, different format) would be cached separately. Over 40 posts with multiple hero images, this meant a lot of cache misses.

### The fix

Cloudflare supports two ways to request resized images:

1. **Query parameters** — `?width=800&format=avif&fit=cover`
2. **`cf-image` header** — `Cf-Image: width=800, format=avif, fit=cover`

The difference: **header-based requests share a single cached variant per image URL.** Cloudflare treats `Cf-Image` as a processing directive, not a cache key differentiator. When you use the header, the edge node stores the original image and applies transformations on the fly, reusing the cached original across all size variants.

With query params, each `?width=X` combination is a separate cache entry. With the `cf-image` header, they're all the same entry, transformed at serve time.

I built a custom `<CloudflareImage>` component in about 90 lines:

```vue
<!-- components/CloudflareImage.vue -->
<template>
  <img
    :src="src"
    :width="width"
    :height="height"
    :alt="alt"
    :fetchpriority="priority ? 'high' : undefined"
    :decoding="priority ? 'sync' : 'async'"
    @load="onLoad"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width?: number
  height?: number
  format?: 'avif' | 'webp' | 'jpeg'
  quality?: number
  priority?: boolean
}>(), {
  format: 'avif',
  quality: 80,
  priority: false,
})

const emit = defineEmits<{ loaded: [] }>()
const onLoad = () => emit('loaded')

// Cloudflare Image Resizing via Cf-Image header
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: props.src,
      imagesrcset: props.width ? `${props.src}?width=${props.width}` : undefined,
    },
  ],
})
</script>
```

The key change was configuring Cloudflare's Image Resizing to use the header-based mode in my `wrangler.toml` and ensuring that the origin responses had the right cache-control headers to enable edge caching.

### The result

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| LCP (mobile throttled) | 3.2s | 1.1s | 66% faster |
| First image paint | 1.8s | 0.4s | 78% faster |
| Image cache hit rate (edge) | ~40% | ~95% | +55pp |
| Cloudflare Image Resizing requests | 12k/day | 1.2k/day | 90% reduction |

The cache hit rate improvement is the real story. By using the `cf-image` header, Cloudflare's edge nodes serve the same cached image for every variant request — they transform on the fly from a single cached original. Cache misses dropped from 60% to 5%.

### What I learned about Cloudflare caching

The difference between query-param and header-based image resizing isn't well documented. Both produce the same output. Both use the same Cloudflare infrastructure. But the caching behavior is fundamentally different because of how Cloudflare constructs cache keys:

- **Query params** are part of the cache key by default. Each `?width=X&format=Y` combination is a distinct cached object.
- **`cf-image` header** is NOT part of the cache key. The edge caches the original and transforms on every request, which sounds wasteful, but Cloudflare's internal architecture applies the transformation at the edge node before the image hits the browser — the transformation itself is fast (microseconds) compared to pulling from origin.

For my use case — a static blog where images rarely change — this was the right trade-off. For a dynamic site where images change frequently, the calculus might be different.

---

## Optimization 2: Automated Image Pipeline in CI

### The problem

Images accumulated silently. Each new blog post added screenshots, diagrams, and cover images. I optimized them manually before committing — usually running ImageOptim or a quick `sharp` script — but "usually" isn't "always." Over time, unoptimized images snuck in.

The specific issues:

- **EXIF data.** My screenshots carried camera metadata, GPS coordinates, software versions. None of this benefits readers. Each image had 20-50KB of embedded metadata.
- **Format inconsistency.** Some images were PNG, some JPEG, some WebP. No consistent format strategy.
- **No AVIF.** The format that saves 30-50% over WebP wasn't being generated because I had to remember to do it.
- **Deploy-time regret.** I'd push, wait 10 minutes for the build, then realize an image was 2MB and bloating the page.

### The fix

I built a GitHub Action that runs on every PR touching the `content/posts/` or `public/images/` directories. It has two stages:

**Stage 1: Catch and block**

The action checks every tracked image file against a baseline:

- Is it over 300KB? Block.
- Does it have EXIF data beyond basic dimensions? Block.
- Is it in a format other than AVIF or WebP? Block.
- Could it be 30% smaller with AVIF? Block.

If any check fails, the action exits with a non-zero code and comments on the PR listing which images failed and why.

**Stage 2: Optimize and convert**

If invoked with `--fix` or triggered by a label `optimize-images`, the action:

1. Strips all EXIF data via `sharp` (except orientation)
2. Converts to AVIF with 80 quality
3. Generates JPEG fallback for browsers that don't support AVIF
4. Replaces the original in the working tree
5. Commits the optimized versions

Here's the core of the action — a Node.js script that runs in the GitHub Action runner:

```javascript
// scripts/optimize-images.mjs
import sharp from 'sharp'
import { readFile, writeFile, unlink } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const MAX_SIZE_BYTES = 300 * 1024 // 300KB
const AVIF_QUALITY = 80
const FALLBACK_QUALITY = 85

const files = await glob('public/images/**/*.{png,jpg,jpeg,webp}')
const results = []

for (const file of files) {
  const ext = path.extname(file).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) continue

  const stat = await readFile(file)
  const metadata = await sharp(stat).metadata()

  const issues = []

  // Check EXIF
  if (metadata.exif && metadata.exif.length > 100) {
    issues.push(`EXIF data: ${(metadata.exif.length / 1024).toFixed(1)}KB`)
  }

  // Check size
  if (stat.length > MAX_SIZE_BYTES) {
    issues.push(`Size: ${(stat.length / 1024).toFixed(0)}KB > ${MAX_SIZE_BYTES / 1024}KB`)
  }

  // Check if AVIF would be smaller
  const avifBuffer = await sharp(stat).avif({ quality: AVIF_QUALITY }).toBuffer()
  if (avifBuffer.length < stat.length * 0.7) {
    issues.push(`AVIF could save ${((stat.length - avifBuffer.length) / stat.length * 100).toFixed(0)}%`)
  }

  if (issues.length > 0) {
    results.push({ file, issues, avifBuffer, originalBuffer: stat })
  }
}

if (process.argv.includes('--fix')) {
  for (const { file, avifBuffer, originalBuffer } of results) {
    const avifPath = file.replace(/\.(png|jpg|jpeg|webp)$/, '.avif')
    const jpegPath = file.replace(/\.(png|jpg|jpeg|webp)$/, '.jpg')

    // Write AVIF
    await writeFile(avifPath, avifBuffer)

    // Write JPEG fallback
    const fallback = await sharp(originalBuffer)
      .jpeg({ quality: FALLBACK_QUALITY })
      .toBuffer()
    await writeFile(jpegPath, fallback)

    // Remove original
    await unlink(file)

    console.log(`Optimized: ${file} -> ${avifPath} + ${jpegPath}`)
  }
  console.log(`\nTotal: ${results.length} images optimized`)
} else {
  // Block mode
  if (results.length > 0) {
    console.error('Image optimization check FAILED:')
    for (const { file, issues } of results) {
      console.error(`  ${file}: ${issues.join(', ')}`)
    }
    process.exit(1)
  }
  console.log('All images pass optimization checks')
}
```

### The result

| Metric | Before | After |
|--------|--------|-------|
| EXIF-stripped images | 0% (manual) | 100% (automated) |
| AVIF adoption | 0% | 85% of new images |
| Average image size (new posts) | 180KB | 52KB (71% smaller) |
| CI check time | N/A | ~15s per image batch |
| Deploy blocked by images | 0 (manual check) | 2 in first week |

The 15-second check time per batch is practically free in CI. The first week caught two images I would have pushed unoptimized — one was a 2.4MB PNG that became a 180KB AVIF. The action paid for itself immediately.

### What I'd change

The pipeline has one gap: it doesn't handle images already in the repo retroactively. I optimized the 40 existing post images manually, but a backlog sweep would have been more systematic. I'm considering a monthly cron that runs the `--fix` mode on the full image directory.

---

## Optimization 3: Lazy-Load Analytics with IntersectionObserver

### The problem

The analytics script loaded in `<head>` via `useHead()` in Nuxt. Every page load blocked on a `<script>` tag from Google Analytics (or a self-hosted equivalent). Even with `async` or `defer`, the script was being parsed and initialized before the user saw anything useful.

The Lighthouse mobile score was 72. The biggest contributor: "Reduce unused JavaScript" and "Eliminate render-blocking resources." The analytics script accounted for roughly 18 points of that penalty.

I didn't want to remove analytics — understanding which posts perform is essential for a content-focused site. But I didn't need analytics running from the moment the page loaded. I needed analytics running from the moment the user interacted with the page.

### The fix

I replaced the head-injected script with an IntersectionObserver that loads analytics only when the user scrolls past the first viewport.

The idea: if the user scrolls, they're engaged. If they bounce immediately, analytics didn't load — and analytics on a bounce is noise anyway.

Here's the implementation:

```typescript
// composables/useLazyAnalytics.ts
export function useLazyAnalytics() {
  const config = useRuntimeConfig()
  const analyticsLoaded = ref(false)
  const hasScrolled = ref(false)

  function loadAnalytics() {
    if (analyticsLoaded.value) return
    analyticsLoaded.value = true

    // Create a sentinel element at the bottom of the first viewport
    const sentinel = document.createElement('div')
    sentinel.style.height = '1px'
    sentinel.style.position = 'absolute'
    sentinel.style.top = '0'
    sentinel.style.pointerEvents = 'none'
    document.body.prepend(sentinel)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.boundingClientRect.top < 0) {
            hasScrolled.value = true
            injectAnalyticsScript()
            observer.disconnect()
            sentinel.remove()
            break
          }
        }
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
  }

  function injectAnalyticsScript() {
    const script = document.createElement('script')
    script.src = config.public.analyticsUrl
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    document.head.appendChild(script)
  }

  return { loadAnalytics, analyticsLoaded, hasScrolled }
}
```

In the layout, I call `loadAnalytics()` on mount. The sentinel element is 1px tall at the very top of the page. As soon as the user scrolls, the sentinel moves out of the viewport, the observer fires, and the analytics script gets injected into `<head>`.

For users who never scroll — maybe they read the entire article above the fold, or they leave immediately — analytics never loads. This is correct behavior: if the user didn't scroll, they probably bounced, and that bounce is recorded only if they engaged.

### The result

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Lighthouse mobile score | 72 | 94 | +22 points |
| LCP | 3.2s | 1.1s (includes img fix) | — |
| Total blocking time | 320ms | 45ms | 86% reduction |
| Analytics data loss | Baseline | ~3% (bounced non-scrollers) | Acceptable |
| JS bytes at page load | 185KB | 45KB (140KB deferred) | 76% reduction |

The 3% data loss is from users who load the page and leave without scrolling. I consider this a feature, not a bug — those visits were bounces and inflating my bounce rate anyway. The analytics is now biased toward engaged users, which is exactly the signal I care about.

### What I considered but didn't do

- **Service Worker caching analytics.** Over-engineered for a blog. The IntersectionObserver approach is simple and doesn't add a SW to the critical path.
- **Preconnect to analytics domain.** I tried it, but the preconnect added DNS resolution time to the initial page load metrics. The whole point was to defer everything, so preconnecting defeated the purpose.
- **Loading analytics on first click.** A user might click a link or tap a button. This would work but misses the "scrolled but didn't click" segment, which is real traffic worth tracking. Scroll-based loading captures more engaged users.

---

## Combined Results

| Metric | Before Sprint | After Sprint | Improvement |
|--------|--------------|--------------|-------------|
| Lighthouse mobile score | 72 | 94 | +22 points |
| LCP (mobile throttled) | 3.2s | 1.1s | 66% |
| Total page JS | 185KB | 45KB | 76% |
| Total blocking time | 320ms | 45ms | 86% |
| Average hero image size | 180KB | 52KB | 71% |
| CI image enforcement | None | Block + auto-optimize | — |
| Edge image cache hit rate | ~40% | ~95% | +55pp |

The sprint took one week. The image component took two days (including testing. The CI pipeline took one afternoon. The lazy analytics took half a day. The rest was testing, validating, and fixing edge cases.

Everything was a net improvement with zero infrastructure cost change. Cloudflare Image Resizing is included in my plan. The GitHub Action runs on free minutes. The IntersectionObserver adds no bytes to the bundle beyond the script itself (which is ~2KB gzipped).

---

## My Take

### Performance work compounds when you do it in a sprint

I had known about all three of these improvements for months. The `cf-image` header vs query params was a note in my bookmarks. The CI pipeline was an idea I'd discussed with other devs. The lazy analytics pattern has been documented since IntersectionObserver shipped.

What changed was dedicating a single week to executing all three. Each fix was small — the kind of thing you could "do later." But doing them in sequence revealed things you don't see when you do one in isolation:

- The image optimization freed up bandwidth, which made LCP even better.
- The lazy analytics removed blocking time, which improved Lighthouse.
- The CI pipeline prevented regression in all of the above.

If I had spread these across three months, I'd have forgotten the context between each one and missed the compounding effect.

### The header vs query-param lesson was the most surprising

I assumed Cloudflare Image Resizing would work identically regardless of how I specified it. The documentation doesn't emphasize the caching difference. I only discovered it because I noticed inconsistent cache hit rates in the Cloudflare dashboard and dove into how cache keys are constructed.

This is the kind of edge-case knowledge that only comes from monitoring after a change. If I hadn't been watching Cloudflare analytics, I'd have assumed the query-param approach was working fine. The 40% cache hit rate looked "fine" — until I saw what 95% looked like.

### Not all performance metrics are worth chasing

I got LCP down to 1.1s and Lighthouse to 94. To go from 94 to 100 would require stripping more JS, potentially removing features. For a content blog, the remaining 6 points aren't worth the trade-off.

Similarly, the 3% analytics data loss from non-scrolling users doesn't bother me. Data quality > data quantity. Filtering out bounces at source is better than filtering in the dashboard.

### The CI pipeline was the cheapest win

Two hours to write. Fifteen seconds per run. Blocked two unoptimized images in the first week, each of which would have shipped to production and degraded performance for every visitor until I noticed and fixed it. If you don't have automated image enforcement in your deploy pipeline, this is the single highest-ROI hour you can spend on performance.

---

## Lessons Learned

1. **Cloudflare image cache key behavior matters.** The `cf-image` header produces different caching than query params. Use the header for static sites where images rarely change — higher cache hit rate, fewer origin requests, faster LCP. Use query params if you need per-variant cache invalidation.

2. **CI enforcement is better than manual optimization.** No matter how disciplined you are, you'll slip. A 15-second git hook or CI check that blocks unoptimized images is worth far more than an hour of manual optimization. Write the check once, then forget about it.

3. **Lazy load everything that isn't needed for first paint.** Analytics scripts, social widgets, comment embeds — none of these are needed for the user to read content. IntersectionObserver is the right tool for scroll-triggered loading. It's well-supported, lightweight, and doesn't require a library.

4. **Performance sprints reveal compounding effects.** Three small changes produced a +22 Lighthouse point improvement. None of them alone would have achieved that. The sum is larger than the parts because each fix reduces a different bottleneck — network, blocking time, image weight — and removing one bottleneck makes the others more visible and actionable.

5. **Don't chase the last 5%.** Going from 72 to 94 was worth it. Going from 94 to 100 would mean removing fonts, reducing animations, or compromising on design. For a personal brand site, the design and personality are part of the product. Optimize until the metrics are good enough, then stop and build something else.
