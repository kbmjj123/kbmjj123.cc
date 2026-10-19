# Phase 1 and 2: Content Analysis and Proposed Plan

## 1A - Read and Index

**User Input**: Debugging story about Nuxt 4 SSG build failing on Cloudflare Pages with ENOENT for `/functions/[...].mjs`.

**Existing Posts**: 19 posts in content/posts/. 16 published, 3 drafts across 4 series. No existing post covers this specific `functions_directory` issue.

**Slug Available**: `nuxt4-ssg-build-cloudflare-functions-directory`

**Project Config Checked**:
- `nuxt.config.ts` uses `nitro.preset: 'cloudflare_module'`
- Current `wrangler.toml` has no `functions_directory` (user removed it)
- The blog's stack: Nuxt 4 SSG, Nitro cloudflare_module, Cloudflare Pages

## 1B - Sub-Topics: 1 identified

Single continuous debugging narrative. No independent secondary stories.

## 1C - SEO Research

**Intent**: Troubleshooting / Technical Implementation. Target query: "Nuxt 4 SSG build fails Cloudflare Pages ENOENT functions directory"

**SERP Analysis**:
- Fragmented across GitHub issues, Answer Overflow, Cloudflare Community
- No dedicated blog post covers this exact `functions_directory` misconfiguration
- Three long-tail gaps with zero dedicated results:
  1. "custom functions_directory wrangler.toml Nuxt 4 Nitro cloudflare_module"
  2. "local pnpm dev vs pnpm build functions directory code path Cloudflare"
  3. "ENOENT /functions/[...].mjs Cloudflare Pages Nuxt SSG"

**SEO Angle**: Target the specific error message combined with local-vs-CI code path insight.

## 1D - Split Decision

**Keep as one article**. Est. word count ~1200 (<3000 threshold). Single continuous story.

## Proposed Structure

| Field | Value |
|-------|-------|
| Title | Why My Nuxt 4 SSG Build Failed with "ENOENT: /functions/[...].mjs" on Cloudflare Pages |
| Category | tools-workflow |
| Template | Section 7 troubleshooting |
| Tags | #nuxt #cloudflare #deployment #cicd |
| Related Posts | nuxt-cloudflare-zero-cost, going-serverless-part-1-why-cloudflare, platform-agnostic-ad-component-nuxt4-ssg |

## Resources Needed (per Section 5.1)

- Screenshot of error: not provided
- CI log output: not provided, reconstructed
- Broken wrangler.toml: not provided, described from context
