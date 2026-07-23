---
name: blog-post-producer
description: >
  Produce blog posts for kbmjj123.cc following the detailed production manual.
  MANDATORY trigger: whenever the user pastes a long discussion, technical notes, or records a conversation about something that could become a blog post — even if they don't explicitly say "write a post". 
  Also trigger when user says "turn this into a post", "write this up", "make an article from this", "publish this", or similar.
  Do NOT just start writing — you must first analyze, propose split plan, ask for missing resources, 
  and get user approval before writing any .md file.
compatibility:
  tools_required:
    - Bash (for reading existing posts, writing files)
    - Read (for reading discussion content, existing posts)
    - Write (for writing .md files)
    - Edit (for editing relatedPosts on existing posts)
    - WebSearch/WebFetch (for SEO keyword research per Section 2.1)
  platforms:
    - Claude Code
    - Claude.ai (some steps adapt)
---

# Blog Post Producer — kbmjj123.cc

## Overview

This skill converts a discussion/technical notes into one or more publishable `.md` blog posts under `content/posts/`, following the **博客文章产出执行手册** exactly.

**Source of truth**: The production manual covers all rules in full. This skill extracts and operationalizes them. If anything conflicts, the manual wins.

### When This Skill Fires

User pastes ≥200 characters of discussion content, technical notes, troubleshooting logs, or says "turn this into a post" / "write this up" / "make an article from this" / "publish this" / "make a blog post about this". Do NOT start writing .md files immediately — enter the workflow below.

---

## Workflow (Mandatory — Follow Step by Step)

### Phase 1: Receive, Analyze, and Research

#### 1A — Read and Index

1. Read the user's input (discussion, notes, chat log). If it references other conversations or files, ask for them.
2. Scan `content/posts/` to see what already exists — check for existing related posts, tags in use, slug conflicts.
3. Index the full input using context-mode (`ctx_index`) so you can search across it without holding it all in context.

#### 1B — Identify Sub-Topics

From the input, identify distinct sub-topics or sub-stories that could each be a standalone article. For each one determine:
- **What it's about** (one sentence)
- **Type**: troubleshooting / technical implementation / principle discussion / startup diary / product analysis
- **Whether the user has already provided enough detail per Section 5.1** (code, real data, screenshots, investigation steps)

#### 1C — Semrush Keyword Research (Mandatory)

For each sub-topic, perform structured keyword research using Semrush. **Goal**: find a target keyword that has real search volume and achievable difficulty, then shape the article around it.

**Step 1 — Seed Keywords**

Generate 3-5 seed keywords from the sub-topic. Think like a searcher, not a writer:

| Your Topic (writer视角) | Seed Keywords (searcher视角) |
|------------------------|------------------------------|
| "我遇到 D1 FTS5 的坑" | `cloudflare d1 full text search`, `d1 fts5 tutorial` |
| "Google 爬虫不抓我页面" | `nuxt ssg google indexing`, `cloudflare pages seo` |
| "用 Satori 生成 OG 图" | `satori og image tutorial`, `dynamic og image cloudflare` |

**Step 2 — Keyword Magic Tool**

Open Semrush → **Keyword Management → Keyword Magic Tool**. Enter each seed keyword, then filter:

| Filter | Setting | Why |
|--------|---------|-----|
| Volume | ≥ 100 | Chinese tech niche is small; 100+ is viable |
| Keyword Difficulty (KD) | ≤ 40 | New/low-authority site can realistically rank |
| Word Count | ≥ 4 words | Long-tail = less competition, higher intent match |
| Intent | Informational (I) | Tech blog's primary traffic source |

**Step 3 — Evaluate Candidates**

For each candidate keyword, check:

1. **SERP Analysis** (in Semrush, click the keyword → SERP Analysis):
   - Are the top 10 results all official docs or mega-sites? → Hard to compete, skip
   - Are there small blogs or forums ranking? → Opportunity exists
   - Is the content quality in top 10 thin/outdated? → You can beat it with better content

2. **Intent Match**:
   - Informational (I) → Tutorial, guide, how-to ← **primary target**
   - Commercial Investigation (C) → Comparison, review ← secondary
   - Navigational (N) → Skip (people looking for a specific site)
   - Transactional (T) → Skip (not your blog's purpose)

3. **Topic-Content Fit**:
   - Can you write genuinely useful content for this keyword from your real experience?
   - If the keyword requires expertise you don't have → skip, don't fake it

**Step 4 — Select Target Keyword**

Pick ONE primary keyword per article. Apply the **two-track selection**:

**Track A — Data Available** (Semrush shows Volume):
- Volume ≥ 100 AND KD ≤ 40
- Intent is Informational
- You have real, specific experience to write about
- SERP has room for a new entrant

**Track B — Long-Tail No Data** (Semrush shows N/A):
- Head term has Volume ≥ 500 (validates the topic broadly)
- Long-tail passes ≥2 of 4 alternative demand signals (see "Fallback: Long-Tail Keywords Have No Data" below)
- You have real, specific experience to write about
- SERP top 10 is not dominated entirely by official docs

Record your findings in this format:

```
Target Keyword: "cloudflare d1 full text search"
Volume: 320/mo | KD: 15 | Intent: Informational
SERP Analysis: Top 3 are official docs (generic), positions 4-10 are thin — opportunity exists
Differentiation: Real Nuxt 4 + D1 implementation with FTS5 triggers, not just API docs
```

Or for long-tail with no Semrush data:

```
Target Keyword: "cloudflare d1 full text search"
Volume: <100 (estimated) | KD: ~15 (estimated) | Intent: Informational
Head Term: "cloudflare d1" — 2400/mo | KD: 45
Demand Signals: ✅ Google Autocomplete | ✅ StackOverflow (3 questions) | ❌ Reddit | ❌ PAA
SERP Analysis: Top 3 are generic docs, no dedicated tutorial exists — wide open
Differentiation: Real FTS5 trigger setup + Drizzle ORM integration, not in any existing result
```

**Step 5 — Title & SEO Crafting**

Based on the target keyword:
- **Post title** (`title`): Include the keyword naturally, make it compelling. Not clickbait.
- **SEO title** (`seo.title`): Keyword-first format for search engines. Can differ from post title.
- **SEO description** (`seo.description`): 150-160 chars, includes keyword + value proposition.

**Example**:
```
Target keyword: "cloudflare d1 full text search"

title: "我在 Nuxt 4 里用 Cloudflare D1 FTS5 做了个全文搜索，踩了一堆坑"
seo.title: "Cloudflare D1 FTS5 全文搜索实战教程：Nuxt 4 + Drizzle ORM 完整指南"
seo.description: "从 Schema 设计到 FTS5 Trigger，手把手在 Nuxt 4 项目中实现 Cloudflare D1 全文搜索。包含 Drizzle ORM 集成和踩坑记录。"
```

**Do not skip this step**. Writing seo.title/seo.description without Semrush research is forbidden. If user doesn't have Semrush access, use WebSearch + Google Trends as fallback — but document that keyword data is estimated, not verified.

**Fallback: No Semrush**

If Semrush is unavailable:
1. Use WebSearch to check if the topic has discussion on StackOverflow, Reddit, Dev.to
2. Use Google Trends to compare candidate keywords
3. Search the exact proposed title in Google — if zero results, the keyword likely has no demand
4. Mark keyword data as `<!-- estimated, not Semrush-verified -->` in your proposal

**Fallback: Long-Tail Keywords Have No Data**

This is **normal** for niche technical topics. Semrush's data comes from click-stream samples — queries with very low volume show as "no data" even if people do search them. **"No data" ≠ "Nobody searches this."**

When your long-tail keyword shows no Volume in Semrush, verify demand through alternative signals:

| Signal | How to Check | Pass Condition |
|--------|-------------|----------------|
| Google Autocomplete | Type the keyword in Google search — does it appear in the dropdown? | At least partial match appears |
| Google Related Searches | Search the keyword, scroll to bottom — are there related queries? | Related searches exist |
| StackOverflow / Reddit | Search `site:stackoverflow.com "your keyword"` | ≥2 real questions exist |
| People Also Ask | Search the keyword in Google — is there a PAA block? | PAA block appears with relevant questions |

**Scoring**: If ≥2 of 4 signals pass → keyword has real demand, proceed to write.

**When writing with unverified long-tail keywords, follow this pattern**:

1. **Use the head term's data** to justify the article (e.g., "cloudflare d1" has Volume: 2400/mo)
2. **Target the long-tail angle** in your title and content (e.g., "cloudflare d1 full text search")
3. **Naturally include both** — the head term brings broad visibility, the long-tail angle captures specific intent
4. **Mark data as estimated** in your proposal: `Volume: <100 (estimated via Google Autocomplete)`

**Cost-Benefit Estimation (for long-tail keywords with no exact volume)**

Since exact volume is unknowable for long-tail keywords, use this estimation framework to decide if the article is worth writing:

```
Article cost:  ~2-3 hours of writing

Traffic estimation:
├── Head term monthly searches: [from Semrush, e.g., 2400/mo]
├── % who search more specifically: 5-15% (industry rule of thumb)
├── Estimated long-tail searches: [head volume × 5-15%, e.g., 120-360/mo]
├── CTR if ranking top 3: 8-15% (long-tail = higher intent = higher CTR)
└── Estimated monthly clicks: [long-tail × CTR, e.g., 10-54/mo]
```

**Decision rule**: If estimated monthly clicks ≥ 5 → write. The reasoning:

- **Articles are assets** — write once, earn traffic forever (unlike social posts that decay)
- **Chinese technical content is scarce** — you may be the ONLY result, pushing CTR much higher than average
- **Compound effect** — 10 such articles = 50-540 clicks/mo, growing as domain authority builds
- **Low competition** — long-tail with no dedicated content = you rank top 3 almost guaranteed

**Present this to the user** in the proposal as a simple cost-benefit line:

```
Cost-Benefit: ~2h writing → est. 10-50 clicks/mo (forever) → worth it
```

**Example**:
```
Head term: "cloudflare d1" → Volume: 2400/mo | KD: 45 (too competitive alone)
Long-tail: "cloudflare d1 full text search" → Volume: N/A in Semrush
Google Autocomplete: ✅ "cloudflare d1 full text search" appears
StackOverflow: ✅ 3 relevant questions found
Decision: ✅ Write — target long-tail angle, leverage head term for topical authority

Target Keyword: "cloudflare d1 full text search"
Volume: <100 (estimated) | KD: ~15 (estimated) | Intent: Informational
Head Term Authority: "cloudflare d1" — 2400/mo
Differentiation: Real FTS5 implementation, not just API reference
```

#### 1D — Split Decision

Apply Section 4 rules:
- Expected English word count >3000 → evaluate split (not automatic — check if content is continuous enough)
- ≥3 independent sub-topics → lean toward split
- Different audience purposes (principle vs implementation) → split

Document your split recommendation:
- How many articles
- Tentative slugs
- Whether they form a series or are independent
- Series name (if any) — ask user to confirm, don't assume

---

### Phase 2: Propose to User

Present your analysis to the user **before writing any content**:

```
## Content Analysis

Identified N sub-topics: [list each with 1-sentence description]

## Split Recommendation

[Split into N articles or keep as one, with reasons based on Section 4 rules]
[Series name if applicable — ask for confirmation]

## Keyword Research Summary

### Article 1: [Working Title]
Target Keyword: "[keyword]"
Volume: XXX/mo | KD: XX | Intent: Informational
SERP Analysis: [1-2 sentences on competition landscape]
Differentiation: [why your article can rank — real experience angle]
Cost-Benefit: ~Xh writing → est. XX-XX clicks/mo (forever) → worth it / skip

### Article 2: ...

## Tentative Structure

### Article 1: [Working Title]
Category: [one slug from the 6]
SEO Title: [keyword-first title for search engines]
SEO Description: [150-160 chars]
Key sections: [...]

### Article 2: ...
```

Then list **what you need from the user** (per Section 5.1):

| Item | Type | Needed From You |
|------|------|-----------------|
| Screenshot of error X | Real image | Required — I won't fake it |
| Performance numbers | Real data | Actual before/after or estimate? |
| Code snippet for Y | Code | Can I use the version from input or do you have a cleaner one? |
| ... | | |

**Wait for user approval of the plan and confirmation on resources before proceeding.**

---

### Phase 3: Gather Resources

After user confirms the split plan and provides missing items:

- If user gives screenshots, note the file path / image to use
- If user approves a series name, lock it in
- If user provides additional code/data, incorporate into plan
- Confirm category and tags per Sections 2 and the closed tag list (the 50 tags in the manual)

**Do not proceed to writing until user has confirmed the plan AND supplied or confirmed all resources that need their real input.**

---

### Phase 4: Write Articles

For each article in the approved plan, write a `.md` file to `content/posts/`.

#### 4A — Frontmatter Generation

Generate YAML frontmatter using Section 2 rules:

```yaml
---
title: "SEO-optimized title matching target search intent"
description: "Short SEO-friendly 1-2 sentence summary. 150-160 chars max."
date: <today's date>
category: <one of the 6 slugs>
readTime: "<N>mins"    # Estimate: (word count / 200) rounded, append "mins"
tags:
  - "#tag1"            # 2-5 tags from closed set, no forced fill
  - "#tag2"
image: "<path>"        # See image rules below
draft: true            # Always start as draft — user sets to false
series: "<series-slug-or-null>"
seriesOrder: <N-or-null>
seo:
  title: "Different from post title — matches search intent per Section 2.1 rules"
  description: "Different from post description — 150-160 chars, same core keywords as seo.title"
  keywords: []          # Always empty array per Section 2
relatedPosts:
  - "<existing-post-slug-1>"
  - "<existing-post-slug-2>"  # 1-3 slugs, min 1 required
---
```

**Image path rules** (Section 3.3 + Section 10):
- If this post has a screenshot/real image: `image: "/images/{category}/{slug}/{filename}.webp"`
- If this post has a diagram I can generate as SVG: use the same path with `.svg`
- If no image at all: omit `image` field entirely (Section 10 — no generic cover)
- All images in body text use full Markdown `![alt](path)` syntax, alt in English
- Real screenshots: mark as `<!-- @user: needs real screenshot -->` in the markdown, do NOT fake it

**readTime calculation**: Count approximate English word count of the body (not frontmatter). Divide by 200, round to nearest minute. Format: `"12mins"`, `"5mins"`. Minimum 3mins.

#### 4B — Body Structure

For **troubleshooting / technical implementation** posts, use the Section 7 template:

```markdown
## TL;DR
## Background
## The Problem
## Investigation
## Solution
## My Take
## Result
## Lessons Learned
```

For **principle / concept** posts, adapt structure — don't force the template. The key requirement is that every Section 3.1 rule is met: each sentence is specific to this post, could not be swapped into another post unchanged.

For **startup-diary / product-business** posts, use narrative structure but still include My Take (with data) and Lessons Learned.

#### 4C — Image Embedding

Per Section 3.1: Every diagram/SVG I generate **must be embedded** in the markdown body at the correct paragraph position. Not just saved to disk — verify it appears in the `.md` file output.

#### 4D — Series Navigation (Section 9.1)

If this article is part of a series, append at the bottom:

```markdown
---
*Part of the "{series-name}" series. [上一篇 · 下一篇]*
```

Build the navigation links using the series slugs.

---

### Phase 5: Self-Check (Mandatory Before Output)

Run through this checklist on every article before presenting or saving:

#### Section 2.1 — Keyword Research Verification
- [ ] Is there a documented target keyword with search data or estimated demand signals?
- [ ] If Semrush Volume is N/A: are ≥2 of 4 alternative demand signals documented? (Google Autocomplete, Related Searches, SO/Reddit, PAA)
- [ ] Does the post title contain or closely relate to the target keyword?
- [ ] Do seo.title and seo.description include the target keyword naturally?
- [ ] Was SERP analysis done? Is there a documented reason why this article can compete?

#### Section 3.1 — Content Specificity
- [ ] Can any sentence be transplanted to another post in the same category and still read naturally? If yes, rewrite to be specific to this post's project/scenario.
- [ ] Is there at least one concrete number (time, cost, lines of code, performance delta) where a vague word could have been used?
- [ ] Does the article end with something the reader can directly use (decision framework, checklist, alternative options)? Or is it just "what happened to me" without actionable takeaway?

#### Section 5.1 — Real Content Check
- [ ] Did I mark any real screenshot / real image as needing user input? (Must — don't fake.)
- [ ] Did I ask for any performance data I couldn't derive from the discussion? (If user didn't provide, mark as `<!-- @user: needs real data -->`)
- [ ] For any solution/code — is the logic accurate to the user's real project? (Not generic placeholder.)

#### Section 7.1 — H3 Title Quality
- [ ] Every H3 under Investigation/Solution/Lessons Learned: does it name a specific object + specific conclusion? Or could it be any troubleshooting post ("Attempt 1", "Checking the config")?
- [ ] Under any H2, can two H3s be swapped without reader noticing? If yes, reconsider the sub-division logic.
- [ ] Is each H3 clearly about ONE sub-problem, not two?

#### Section 7.2 — AI味 (AI Flavor) Check
- [ ] Any "总结升华句" at end of paragraphs? Remove.
- [ ] Any significantly/robustly/seamlessly/it's worth noting/leverage? Remove.
- [ ] Any sentence that sounds like it's trying to "balance" both sides when the post clearly takes one side?
- [ ] Are sentence lengths too uniform? Manually vary a few.
- [ ] Does Investigation include at least one wrong turn or misdiagnosis? (Section 5.1 requires it — if user didn't provide one, ask.)
- [ ] Any "In conclusion" or summary paragraph before Lessons Learned? Remove.
- [ ] Does the opening avoid the fixed phrase "Recently, while working on X..."? Rewrite to something specific (direct quote of error message, a striking number, a wrong initial assumption).

#### Section 9 — Internal Links
- [ ] relatedPosts has 1-3 existing post slugs (not empty, not >3)
- [ ] At least 1 natural anchor-text link in body to another post (not "click here" — use semantic anchor text)
- [ ] If series: navigation footer present and links are correct
- [ ] If this post references existing posts: check if those posts need their relatedPosts updated to back-link (Section 9.1)

#### Section 10 — Cover Image
- [ ] image field: either omitted, or a real image that represents core article content. Not a generic unrelated cover.

---

### Phase 6: Save and Link

1. **Write** each `.md` file to `content/posts/{slug}.md` with `draft: true`
2. For each broken `relatedPosts` entry pointing to an existing post — **Edit** the target post's frontmatter to add a back-link in its `relatedPosts` (if not already at 3 cap; if at cap, replace weakest)
3. Present the output to user with:
   - List of files written
   - Summary of what's draft vs ready
   - What still needs user action (screenshots, data, draft→published flip)
4. **Ask user to review before setting `draft: false`**

---

## Reference Tables

### Category Slugs (Section 2 — closed set)

| Slug | Type |
|------|------|
| `dev-practice` | Technical implementation, debugging, code patterns |
| `product-business` | Product decisions, monetization, growth |
| `indie-mindset` | Mindset, motivation, solo developer experience |
| `tools-workflow` | Tools, deployment, dev environment |
| `startup-diary` | Startup journey, milestones, pivots |
| `tech-trends` | Technology analysis and trends |

### Tags (Section 2 — closed set, 50 tags)

`#javascript #typescript #react #vue #nuxt #nextjs #tailwind #api`
`#database #testing #deployment #productdesign #ux #growth #pricing`
`#marketing #saas #b2b #mvp #launch #motivation #burnout #productivity`
`#remotework #focus #impostersyndrome #habits #vscode #figma #postman`
`#docker #vercel #cloudflare #github #cicd #day1 #pivot #failure`
`#milestone #hiring #funding #bootstrapping #ai #machinelearning`
`#web3 #rust #wasm #openai #opensource #edge`

### Image URL Patterns

- **R2 asset URL**: `https://assets.kbmjj123.cc/blog/{category}/{slug}/{filename}`
- **Local (during dev/draft)**: `/images/{category}/{slug}/{filename}`
- Use local path during drafting. The blog system handles the published URL.
- If user already has images in R2, respect their existing path.

### Slug Convention

- Slug = lowercased, hyphenated English words from the post title
- Max ~80 chars
- Avoid numbers unless they're meaningful (like "part-1", "68k")
- Check `content/posts/` for slug conflicts before finalizing

### Draft Policy

- **All new posts start `draft: true`**
- Only the user sets `draft: false`
- Unless user explicitly says "publish this now"

### Existing Post Patterns (Observed)

Real posts in the project use these conventions — match them:
- `readTime`: `"9mins"`, `"5mins"` — no space before "mins"
- `series: null` and `seriesOrder: null` when not in a series
- `image` path: mix of `/images/{category}/{slug}/{file}` (local) and `https://assets.kbmjj123.cc/blog/...` (R2)
- Tags formatted `#xxx` with hash prefix
- Description in frontmatter is a complete sentence ending with period

### Semrush Quick Reference

**Tool locations**:
- Keyword Overview: Semrush → SEO → Keyword Overview (single keyword check)
- Keyword Magic Tool: Semrush → SEO → Keyword Magic Tool (bulk discovery)
- SERP Analysis: Click any keyword → view top 10 results + their metrics

**Filter defaults for this blog**:

| Metric | Threshold | Rationale |
|--------|-----------|-----------|
| Volume | ≥ 100/mo | Chinese tech niche; below 100 = negligible traffic |
| KD (Keyword Difficulty) | ≤ 40 | Site is low-authority; above 40 = unrealistic to rank |
| Word Count | ≥ 4 | Long-tail keywords have less competition |
| Intent | Informational (I) | Primary traffic type for tech blog |

**Quick decision matrix**:

*Track A — Semrush has data*:

| Volume | KD | Decision |
|--------|-----|----------|
| ≥ 500 | ≤ 30 | 🟢 **Write immediately** — high demand, low competition |
| ≥ 200 | ≤ 40 | 🟢 **Good target** — solid opportunity |
| ≥ 100 | ≤ 40 | 🟡 **Viable** — worth writing if you have strong angle |
| ≥ 100 | > 40 | 🟠 **Risky** — only if you have unique authority on topic |

*Track B — Long-tail shows no data in Semrush*:

| Head Term Volume | Demand Signals (≥2 of 4) | Decision |
|-----------------|-------------------------|----------|
| ≥ 1000 | ≥ 2 pass | 🟢 **Write** — topic has broad interest, your angle captures specific intent |
| ≥ 500 | ≥ 2 pass | 🟡 **Viable** — proceed if you have strong differentiation |
| < 500 | any | 🔴 **Skip** — neither broad topic nor specific angle has demand |

The 4 demand signals: Google Autocomplete, Related Searches, StackOverflow/Reddit, People Also Ask.

**Common seed keywords for this blog's tech stack**:
```
nuxt 4, nuxt content, cloudflare pages, cloudflare d1, cloudflare r2,
cloudflare workers, drizzle orm, satori og image, static site generation,
nuxt deployment, cloudflare pages nuxt, d1 full text search
```

---

## Process Document (`content/.blog-process.json`)

### Purpose

Track every article through its lifecycle and maintain internal link relationships across the blog. This file lives at `content/.blog-process.json` and is auto-generated from existing posts on first creation, then maintained by this skill during article production.

### Schema

```jsonc
{
  "lastUpdated": "2026-07-16",

  // Article index
  "articles": [
    {
      "slug": "going-serverless-part-1-why-cloudflare",
      "title": "Why I Bet My Indie Project on Cloudflare Instead of a Server",
      "status": "published",        // "published" | "draft" | "planned" | "writing"
      "category": "tools-workflow",
      "series": "going-serverless", // null if standalone
      "seriesOrder": 1,
      "createdAt": "2026-06-23",
      "tags": ["#cloudflare", "#bootstrapping"],
      "outgoingCount": 3,           // number of anchor-text links in body
      "incomingCount": 2,           // number of other articles linking to this
      "relatedPostsDeclared": ["slug-1", "slug-2"]  // from frontmatter
    }
  ],

  // Series index
  "series": [
    {
      "name": "going-serverless",
      "articles": ["slug-1", "slug-2", "slug-3"],
      "complete": true,   // all articles in series are published
      "createdAt": "2026-06-23"
    }
  ],

  // Link graph (read-only reference, updated on each article save)
  "linkGraph": {
    "totalLinks": 12,
    "articlesWithNoOutgoing": ["slug-a"],
    "articlesWithNoIncoming": ["slug-b"],
    "allLinks": [
      {"from": "slug-a", "to": "slug-b", "anchor": "natural link text"}
    ]
  }
}
```

### Maintenance Rules (Follow Every Time You Write an Article)

**Rule A — Add new article entry:**
When you write a new article file, add an entry to `articles[]` with `status: "draft"`.

**Rule B — Update status on publication:**
When user sets `draft: false` on an existing article or says "publish it", update status to `"published"`.

**Rule C — Register planned or in-progress articles:**
If user approves a split plan but hasn't provided all resources yet, add entries with `status: "planned"`. This helps track content pipeline.

**Rule D — Update series completeness:**
When the last draft article in a series becomes `"published"`, set the series `complete: true`.

**Rule E — Rebuild link graph after relatedPosts edits:**
Every time you save a new article or edit relatedPosts on any existing article, re-derive the outgoing/incoming link counts:
- Scan the article body for `[text](/posts/slug)` links
- Scan all other articles' relatedPosts for cross-references
- Update `outgoingCount`, `incomingCount`, and `linkGraph` for the affected articles

**Rule F — Flag articles with no links:**
If an article has `incomingCount: 0` and has been published for >7 days, flag to user during next interaction: "Article X has no incoming internal links yet — worth adding backlinks from related posts."

### Rebuild Command

To fully regenerate `.blog-process.json` from scratch (e.g., after bulk edits or initial setup):
```bash
node -e '
  // Full rebuild script stored at .claude/skills/blog-post-producer/scripts/rebuild-process.cjs
  // Run: node .claude/skills/blog-post-producer/scripts/rebuild-process.cjs
'
```
This script re-reads every `.md` file in `content/posts/`, re-parses frontmatter, rescans all body links, and writes a fresh `.blog-process.json`. Use it when the file gets out of sync or after manual bulk edits.

---

## Error States

| Situation | Response |
|-----------|----------|
| User pastes content too short / lacking substance for any article | Tell user honestly — this is a note, not enough for a publishable post. Suggest expanding specific areas. |
| User hasn't provided key Section 5.1 items (code/data/screenshots) | Ask specifically. Do not invent. Mark as `<!-- @user: needs ... -->` in the body. |
| Split recommendation rejected by user | Accept gracefully, adjust to their preference. Do not argue. |
| Series name conflict with existing post | Check `content/posts/` — if slug exists, suggest alternative. |
| No existing posts for relatedPosts | Omit relatedPosts field entirely (first post on blog). |
| ReadTime < 3 mins | This suggests the article is too thin. Flag to user for expansion. |

---

## Reminder: Why This Skill Exists

The production manual exists because every blog post is meant to be:

1. **Honest** — based on real experience, not fabricated
2. **Specific** — no sentence that works in another post unchanged
3. **Useful** — reader walks away with something actionable, not just a story
4. **Foundable** — SEO strategy matches real search intent, not wishful thinking

When in doubt, re-read the production manual before deciding. Never shortcut the self-check phase.
