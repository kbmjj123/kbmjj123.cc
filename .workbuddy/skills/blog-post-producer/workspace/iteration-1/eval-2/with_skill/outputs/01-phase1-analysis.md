# Phase 1 Analysis — Blog Post Producer

## 1A — Input Indexed and Existing Posts Scanned

### Input Indexed
Source: "User input discussion for blog post" — indexed via ctx_index.

### Existing Posts (19 total, 16 published, 3 drafts)
No existing posts specifically about:
- Nuxt performance optimization
- Cloudflare Image Resizing
- Image optimization pipeline / CI
- Lazy-loading analytics
- Lighthouse optimization

Closest related posts:
- `nuxt-cloudflare-zero-cost` — Nuxt + Cloudflare deployment strategy (tools-workflow, #nuxt #cloudflare #deployment #saas)
- `platform-agnostic-ad-component-nuxt4-ssg` — Nuxt 4 component implementation (dev-practice, #nuxt #vue #typescript #deployment)
- `building-pixel-email-subscription` — Build process on this blog (dev-practice, #nuxt #cloudflare #resend)
- `68k-impressions-8-clicks-image-sitemap-blind-spot` — Image sitemap SEO (tools-workflow, #seo #growth #cloudflare)

### Tags in Use (29 unique tags)
No `#performance` tag exists yet. Relevant existing tags: #nuxt, #cloudflare, #deployment, #frontend, #vue, #typescript, #github, #cicd, #productivity, #saas.

---

## 1B — Sub-Topics Identified

### Sub-topic 1: Cloudflare Image Resizing with cf-image Header
- **What it's about**: Replacing the default Nuxt `<NuxtImg>` component with a custom component that uses Cloudflare Image Resizing via the `cf-image` header instead of query parameters, cutting LCP from 3.2s to 1.1s.
- **Type**: Technical implementation / Troubleshooting
- **Detail provided**: Concrete before/after numbers (3.2s → 1.1s LCP), key technical trick mentioned (cf-image header vs query params caching behavior). Missing: actual component code, specific Cloudflare config, how cf-image header is set.

### Sub-topic 2: Automated Image Optimization in Deploy Pipeline
- **What it's about**: A GitHub Action that runs sharp on all new images before commit — strips EXIF data, converts to AVIF with fallback, blocks deploy if unoptimized images are detected.
- **Type**: Technical implementation / CI pipeline
- **Detail provided**: Concept clear. Missing: GitHub Action YAML, sharp command/config, how the "block deploy" check works, fallback mechanism details.

### Sub-topic 3: Lazy-Loading Analytics with IntersectionObserver
- **What it's about**: Moving analytics script from loading in `<head>` to a lazy-load pattern using IntersectionObserver, improving Lighthouse score from 72 to 94 on mobile.
- **Type**: Technical implementation
- **Detail provided**: Before/after Lighthouse score (72→94), technique named (IntersectionObserver). Missing: actual implementation code, which analytics service, where the observer trigger point is.

---

## 1C — SEO Research

### Topic 1: "Cloudflare Image Resizing Nuxt custom component"
- **Intent**: Informational + Troubleshooting
- **SERP landscape**: Dominated by official `@nuxt/image` docs and Cloudflare docs. Multiple GitHub issues about `@nuxt/image` not working on Cloudflare Pages (issues #1061, #1588). Few real-world implementation stories.
- **Long-tail gap**: "cf-image header vs query params caching behavior" — this specific nuance is not covered in official docs. Devs hitting Cloudflare Pages image issues are searching for workarounds.
- **Angle**: Real story of debugging the caching difference + building a custom component that works around `@nuxt/image` limitations on Cloudflare Pages.

### Topic 2: "Automate image optimization GitHub Action CI pipeline"
- **Intent**: Informational / How-to
- **SERP landscape**: Some generic articles about Image Actions and QuickShrink. Nothing Nuxt/Cloudflare Pages specific.
- **Long-tail gap**: "Block deploy unoptimized images CI" — the gate pattern specifically.
- **Angle**: Nuxt-specific pipeline with Cloudflare Pages deployment gate.

### Topic 3: "Lazy load analytics script IntersectionObserver Lighthouse"
- **Intent**: Informational / Troubleshooting
- **SERP landscape**: Most content covers lazy-loading images/iframes. Analytics script lazy-loading is less covered.
- **Long-tail gap**: "Analytics script blocking Lighthouse score mobile" — specific to deferring non-critical third-party JS.
- **Angle**: Real Lighthouse delta (72→94) with exact implementation steps.

---

## 1D — Split Decision

### Rules Applied
- **≥3 independent sub-topics** → lean toward split
- **Expected word count**: Each topic needs ~800-1200 words as standalone post (total 2400-3600). As single post covering 3 topics, structural transitions between unrelated techniques would hurt readability.
- **Different audience purposes**: While all are "technical implementation," the specific problems are distinct enough that a reader searching for "Cloudflare Image Resizing" may not also need "lazy-load analytics."

### Recommendation: Split into 3 articles as a mini-series

| # | Tentative Slug | Working Title |
|---|---------------|---------------|
| 1 | `nuxt-cloudflare-image-resizing-custom-component` | How I Cut LCP from 3.2s to 1.1s with a Custom Nuxt Image Component and Cloudflare's cf-image Header |
| 2 | `automatic-image-optimization-pipeline-github-actions` | Building a GitHub Action That Blocks Deploys with Unoptimized Images — AVIF, EXIF, and Sharp |
| 3 | `lazy-load-analytics-intersection-observer-lighthouse` | From 72 to 94: Lazy-Loading Analytics with IntersectionObserver to Fix Lighthouse on Mobile |

### Series Recommendation
These form a natural "performance optimization sprint" arc. Suggested series name: **"nuxt-performance-sprint"**

But each article should also work as a standalone read. Series navigation footer only if user confirms the series name.

### Category Assignments
1. **tools-workflow** — image optimization / deployment tooling
2. **tools-workflow** — CI pipeline / deployment tooling
3. **dev-practice** — frontend performance technique

---

## Resources Needed from User (Per Section 5.1)

| Item | Type | Status |
|------|------|--------|
| Custom Nuxt image component code | Code | Not provided — needed for Article 1 |
| cf-image header implementation details | Code/Config | Only mentioned, no config shown |
| Cloudflare Image Resizing config (wrangler.toml or dashboard) | Config | Not provided |
| GitHub Action YAML | Code | Not provided — needed for Article 2 |
| Sharp command/config | Code | Not provided |
| EXIF stripping approach | Detail | Not provided |
| AVIF fallback mechanism | Code/Detail | Not provided |
| Analytics script being lazy-loaded | Detail | Not mentioned — which analytics? GA4? Plausible? Self-hosted? |
| IntersectionObserver implementation code | Code | Not provided |
| Screenshot of Lighthouse report (before/after) | Image | Not provided (must NOT fake) |
| Screenshot of LCP improvement evidence | Image | Not provided (must NOT fake) |
