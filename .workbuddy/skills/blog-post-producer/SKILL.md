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
  sub_skills:
    - content-strategist (Phase 0: content recommendations)
    - image-planner (Phase 4D: automatic image handling)
    - content-evolver (Phase 0: loads learned patterns and competitor intelligence)
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

### Phase 0: Content Strategy Check

Before writing anything, check if performance data and pattern memory exist. This phase shapes what to write and how to write it.

**If the user hasn't decided what to write yet**: trigger the `content-strategist` skill first to get data-driven content recommendations. Say: "要我先用 content-strategist 推荐选题吗？"

**Step 0A — Load Performance Data**

Check if `content/.gsc-performance.json` exists and has `lastPulled` set (not null).

- If exists and has data: load it. Identify top 3 performers (by clicks) and bottom 3 performers (by impressions with position > 30).
- If not exists or `lastPulled: null`: skip this step (first run, no data yet). Proceed directly to Phase 1.

**Step 0B — Load Pattern Memory**

Check if memory files exist in the project memory directory. Load all that exist:

- `memory/successful-content-patterns.md` — learned patterns from performance reviews. Apply when deciding article structure, keyword targeting, and content style.
- `memory/competitor-intelligence.md` — SERP analysis and competitor gaps. Use to identify sections competitors cover that you should include.
- `memory/content-gaps.md` — prioritized keyword opportunities. Reference when evaluating if the article topic has demand.

If any file doesn't exist: skip that file. It will be created by `content-evolver` after the first review cycle.

**Apply memory data during writing**:
- If competitor intelligence shows top results include a section your article doesn't → add it
- If content patterns show winners average [X] words → target similar length
- If content gaps list this keyword → mark it as covered after publishing

**Step 0C — Content Matrix Check**

Scan `content/posts/` and `content/.blog-process.json` to build a content matrix:

| Category | Published | Drafts | Top Performer | Coverage |
|----------|-----------|--------|---------------|----------|
| dev-practice | N | N | [slug] | [good/thin/empty] |
| product-business | N | N | [slug] | [good/thin/empty] |
| indie-mindset | N | N | [slug] | [good/thin/empty] |
| tools-workflow | N | N | [slug] | [good/thin/empty] |
| startup-diary | N | N | [slug] | [good/thin/empty] |
| tech-trends | N | N | [slug] | [good/thin/empty] |

Identify:
- **Over-covered categories**: >5 published articles with low average performance
- **Under-covered categories**: <2 published articles (content gap)
- **Missing topics**: topics competitors cover (from memory) that you don't

**Step 0D — Output Strategy Recommendation**

Present to the user before Phase 1:

```
## Content Strategy Recommendation

Based on [N months] of performance data:

**What's working** (replicate these patterns):
- [pattern 1 from winners]
- [pattern 2 from winners]

**What's not working** (avoid these patterns):
- [pattern 1 from underperformers]

**Content gaps to fill**:
- [category/topic with no coverage]

**Recommended focus for this article**:
- Target the [category] gap
- Follow the [pattern] structure that works for [top performer]
```

If no performance data exists, present:

```
## Content Strategy

No performance data yet — this will be the baseline article.
After publishing, run `node scripts/gsc-pull.cjs` monthly to build performance history.
```

---

### Phase 1: Receive, Analyze, and Research

#### 1A — Read and Index

1. Read the user's input (discussion, notes, chat log). If it references other conversations or files, ask for them.
2. Scan `content/posts/` to see what already exists — check for existing related posts, tags in use, slug conflicts.
3. **Identify historical articles to reference** — look for posts that cover:
   - **Same project/product** (e.g., BulkPicTools, the tool site) → can cite earlier data/decisions
   - **Same technology** (e.g., Cloudflare, Nuxt) → can link as background reading
   - **Same journey/thread** (e.g., revenue updates, deployment stories) → can build on previous posts
   - **Contradictory or evolving views** (e.g., "I said X 3 months ago, now I think Y") → powerful narrative device
4. Index the full input using context-mode (`ctx_index`) so you can search across it without holding it all in context.

**Historical reference is encouraged**: if a previous post has relevant experience, data, or context, reference it naturally in the new article. Don't just link — actually use the content ("When I set up Umami three months ago, I hit X. Here's what changed since then.").

**Reading historical posts**: Read the full body of 2-3 most relevant existing posts before writing. Extract:
- Specific numbers/data you can reference ("last time I reported $2/day")
- Decisions you can build on or revisit
- Problems that connect to the new article's topic
- Phrasing/voice to maintain consistency (but NOT structural uniformity)

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

#### 1C-2 — SERP Intent Matching (Mandatory)

**Before writing, search the target keyword and analyze the top 10 results.** Google ranks content types that match what searchers want — if your format doesn't match, you won't rank regardless of quality.

**Step 1**: Search the exact target keyword in Google (WebSearch).

**Step 2**: Classify each of the top 10 results:

| Content Type | Signal | Your Article Must Be |
|-------------|--------|---------------------|
| **Tutorial / How-To** | "How to...", "Step by step", numbered steps | A tutorial with actionable steps |
| **Listicle / Roundup** | "10 Best...", "Top 5...", numbered list | A list-based article |
| **Comparison** | "X vs Y", "X or Y", comparison tables | A comparison article |
| **Concept / Guide** | "What is...", "The complete guide", "Everything about" | A comprehensive explainer |
| **Tool / Product Page** | Official docs, SaaS landing pages | Hard to compete — consider different angle |

**Step 3**: Record the dominant format:

```
SERP Intent Analysis for "[target keyword]":

Top 10 format breakdown:
- Tutorials: 6/10 ← dominant format
- Listicles: 2/10
- Concept guides: 1/10
- Product pages: 1/10

Dominant intent: Tutorial (I) — searcher wants "how to do X"
Your article format: MUST be a tutorial
Differentiation opportunity: 8/10 have no real code. 9/10 have no screenshots of actual results.
```

**Step 4**: If SERP is dominated by official docs/mega-sites → re-evaluate whether this keyword is achievable. Consider a long-tail variant instead.

**Why this matters**: A brilliant comparison article targeting a tutorial keyword will NOT rank. Format match is a prerequisite, not an optimization.

#### 1C-3 — Keyword Layering (Mandatory)

Don't just pick one keyword. Build a **keyword pyramid** to maximize coverage:

```
         ┌─────────────────┐
         │   Target Word    │  1 primary keyword → Title, H1, first 100 words
         │  (1,000+ vol)   │
         ├─────────────────┤
         │  Variant Words   │  3-5 keyword variants → H2 headings, subheadings
         │  (200-1,000 vol) │
         ├─────────────────┤
         │   Long-Tail       │  5-8 long-tail questions/queries → Body paragraphs
         │   (< 200 vol)    │  (answer each as a mini-section)
         └─────────────────┘
```

**Process**:

1. **Target word** (already selected in 1C): the primary keyword in title + meta
2. **Variant words**: grammatical/semantic variants, synonyms, related terms
   - "technical seo checklist" → "seo audit checklist", "technical seo audit", "site audit checklist"
   - Map each variant to an H2 or H3
3. **Long-tail words**: question-based and specific-intent queries
   - "how to do technical seo audit", "technical seo checklist for new website", "free technical seo tools"
   - Answer each naturally in body paragraphs

**Output format** (include in Phase 2 proposal):

```
## Keyword Pyramid

Target: "technical seo checklist" (3,600 vol, KD 34)
├─ Variants → H2 mapping:
│   ├─ "technical seo audit checklist" (2,400) → H2: "The Technical SEO Audit Checklist"
│   ├─ "seo checklist template" (1,300) → H2: "Free Checklist Template"
│   └─ "technical seo for beginners" (720) → H2: "Getting Started"
├─ Long-tails → body coverage:
│   ├─ "how to do technical seo audit" → Answered in Step 2 paragraph
│   ├─ "technical seo checklist for new website" → Covered in "For New Sites" callout
│   └─ "technical seo tools free" → Covered in "Free Tools" list
└─ Related topic cluster: links to image-sitemap, sitemap-xml, google-search-console articles
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
SERP Format: [dominant format in top 10 — e.g., "6/10 tutorials"]
Your Format: [must match — e.g., "Tutorial (Archetype B)"]
Competitive Gap: [2+ things top 10 DON'T do that you will]
Cost-Benefit: ~Xh writing → est. XX-XX clicks/mo (forever) → worth it / skip

### Article 2: ...

## Keyword Pyramid

### Article 1: [Working Title]
Target: "[keyword]" (vol, KD)
├─ Variants → H2 mapping:
│   ├─ "[variant 1]" (vol) → H2: "..."
│   └─ "[variant 2]" (vol) → H2: "..."
├─ Long-tails → body coverage:
│   ├─ "[long-tail 1]" → answered in [section]
│   └─ "[long-tail 2]" → covered in [section]
└─ Cluster links: [existing posts to link to]

## Tentative Structure

### Article 1: [Working Title]
Category: [one slug from the 6]
SEO Title: [keyword-first title for search engines]
SEO Description: [150-160 chars]
Key sections: [...]

### Article 2: ...

## Visual Assets

| # | Type | Description | Placement | Source |
|---|------|-------------|-----------|--------|
| 1 | Screenshot | [what the user sees] | [after which paragraph] | ⚠️ User captures |
| 2 | Architecture | [system design / data flow] | [before/after which section] | ✅ AI generates SVG |
| 3 | Flowchart | [decision tree / process] | [section name] | ✅ AI generates SVG |
| 4 | Code Output | [terminal result / JSON] | [after which code block] | ⚠️ User captures or AI simulates |

Priority: [Must-have screenshots marked with ⚠️, nice-to-have unmarked]
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

#### 4B — Body Structure & Style Variation

**⚠️ MANDATORY: Pick an archetype. Do NOT default to the same skeleton every time.**

Before writing, select ONE archetype that fits the content. Check the last 2-3 published posts' H2 sequences — if they share the same skeleton, **switch archetype**. Variation is a hard requirement, not a suggestion.

##### Archetype A — Troubleshooting (debugging, bug fixes, "it broke")

```markdown
## [Opening hook — see Opening Styles below]
## The Problem          ← what went wrong, with the exact error
## The Investigation    ← dead ends, wrong theories, real debugging
## The Fix              ← the actual solution
## Why It Happened      ← root cause, deeper explanation
## Preventing It Next Time  ← checklist / pattern / config guard
```

Opening: error message, stack trace, or "it worked yesterday."
Closing: **Preventing It Next Time** — a checklist or rule, NOT "Lessons Learned."

##### Archetype B — Tutorial / How-To (build something, step-by-step)

```markdown
## [Opening hook]
## What You'll Build     ← outcome + prerequisites
## Step 1: [Specific action]
## Step 2: [Specific action]
## Step 3: [Specific action]
## Gotchas               ← things that will bite you
## Where To Go Next      ← extensions, alternatives
```

Opening: what the reader will have when done, or why existing tutorials fall short.
Closing: **Where To Go Next** — extensions, not a summary.

##### Archetype C — Narrative / Diary (startup journey, personal story)

```markdown
## [Opening — a scene or moment, not TL;DR]
## [Story beats as H2s — chronological or thematic]
## The Numbers           ← real data, what happened
## What I Actually Think ← honest reflection, not platitudes
## What's Next
```

Opening: a specific moment in time (date, event, number). Never TL;DR.
Closing: **What's Next** or **What I Actually Think** — forward-looking or honest, not a checklist.

##### Archetype D — Opinion / Essay (philosophy, mindset, "should you X?")

```markdown
## [Opening — provocative claim or question]
## The Common View       ← what most people think
## Why That's Wrong      ← or "Why That's Incomplete"
## My Position           ← the argument, with evidence
## The Nuance            ← when the common view IS right
## So What?              ← actionable takeaway
```

Opening: a bold claim, contrarian take, or sharp question. Never TL;DR.
Closing: **So What?** — one clear actionable takeaway.

##### Archetype E — Comparison / Analysis (tools, approaches, options)

```markdown
## [Opening — the decision context]
## The Candidates        ← what's being compared
## Head-to-Head          ← dimensions that matter
## When to Use Which     ← decision framework
## What I Chose          ← and why
```

Opening: the decision that forced the comparison.
Closing: **When to Use Which** — a decision framework, not "it depends."

##### Opening Styles (pick one — rotate across posts)

| Style | Example | Best For |
|-------|---------|----------|
| **Scene/Moment** | "Last Tuesday, I was watching my kid at a playground..." | Narrative, Diary |
| **Error/Output** | "The build hung for 4 minutes after `prisma migrate deploy`..." | Troubleshooting |
| **Data Shock** | "68,000 impressions. 8 clicks. That ratio told me something was deeply wrong." | Analysis, Opinion |
| **Bold Claim** | "AI handles 85% of my workload. The other 15% is the only part that matters." | Opinion, Essay |
| **Question** | "Does an indie developer actually need to learn Figma, SEO, and copywriting?" | Opinion |
| **Direct Dive** | Skip the intro. Start with the code, the config, or the first step. | Tutorial |

**Forbidden openings**: "Recently, while working on X...", "In today's post, we'll...", "TL;DR:" as the first section (use a scene or claim instead — put the TL;DR-style summary at the END if needed).

##### Closing Styles (pick one — rotate across posts)

| Style | Example | Best For |
|-------|---------|----------|
| **Prevent Next Time** | Checklist of 3-5 rules to avoid the bug | Troubleshooting |
| **Where To Go Next** | "If you want to go further, try X..." | Tutorial |
| **What's Next** | "Next month I'm testing Y..." | Diary, Narrative |
| **So What?** | "The takeaway: stop optimizing what to learn, start optimizing what to eliminate." | Opinion |
| **Decision Framework** | "Use A when X, B when Y, C when Z." | Comparison |
| **Open Question** | "I'm still not sure if this scales past 100 users. What do you think?" | Opinion, Diary |

**Forbidden closings**: "In conclusion...", "In summary...", "Lessons Learned" as a formulaic section header (extract 1-2 concrete lessons inline in the narrative instead — a "Lessons Learned" H2 is acceptable ONLY in Troubleshooting archetype and only if it's a genuine checklist, not a paragraph of platitudes).

##### Style Variation Rules (Hard Constraints)

1. **Consecutive posts must NOT share the same H2 skeleton.** Check the last 2-3 published posts before writing.
2. **Rotate opening styles.** No two consecutive posts use the same opening type.
3. **Rotate closing styles.** No two consecutive posts end the same way.
4. **Vary section count.** Some posts are 5 H2s, some are 8+. Don't land on 7 every time.
5. **Vary H2 length.** Mix short punchy titles ("The Fix") with longer descriptive ones ("Why `*.vercel.app` Is Blocked but a Custom Domain Isn't").
6. **The archetype must match the content type** — don't force a Troubleshooting skeleton onto an opinion piece.

##### Internal Links — Natural Placement (Flexible Position)

Internal links can appear **anywhere in the body** where they naturally fit. There is no fixed position — no "Related Posts" section at the bottom, no "See also" block, no "As I wrote before" only in the intro.

**Where to link** — anywhere a sentence naturally references another post:

| Context | Example |
|---------|---------|
| **Background/callback** | "When I [set up Umami on Vercel](/self-hosting-umami-part-2) three months ago, the connection string was the first thing that broke." |
| **Data reference** | "Last month I reported [$2/day in ad revenue](/from-zero-to-2-dollar-6-months-tool-site). Here's what changed." |
| **Contradiction/evolution** | "I used to recommend [OAuth for GSC auth](/google-search-console-api-nodejs). I've changed my mind — here's why." |
| **Technical depth** | "For the full FTS5 trigger setup, see [my D1 search implementation](/nuxt4-cloudflare-three-deployment-modes)." |
| **Sidebar mention** | "This is the same [ad component problem](/platform-agnostic-ad-component-nuxt4-ssg) from a different angle." |
| **Inline aside** | "(I covered the [Cloudflare free tier limits](/nuxt-cloudflare-zero-cost) in detail if you want the numbers.)" |

**Rules**:
- **Semantic anchor text** — the link text should describe what it points to. Not "click here", not "this post", not the bare URL.
- **Don't force it** — if a sentence doesn't naturally reference another post, don't add a link. 1-3 body links per article is enough. 0 is OK if nothing genuinely connects.
- **Don't over-link** — don't link the same post twice in one article. Don't link every technical noun.
- **Link placement follows the sentence, not the structure** — a link can appear in the first paragraph, in the middle of a code explanation, or in the final reflection. Whatever reads naturally.
- **relatedPosts frontmatter is still needed** (1-3 slugs) for the sidebar widget — but body links are independent and more important for SEO and reader navigation.

Write every section with the reader's ability to replicate in mind. Two quick tests during writing:

- **Copy-Paste Test** (tutorials/troubleshooting): Can the reader copy any code block and run it? If not, add missing context.
- **Next Time Test**: Does the ending give the reader a reusable tool (checklist, framework, template)? If it's just "and then it worked", rewrite.

#### 4C — Image Embedding

Per Section 3.1: Every diagram/SVG I generate **must be embedded** in the markdown body at the correct paragraph position. Not just saved to disk — verify it appears in the `.md` file output.

#### 4C-2 — SVG Cover Generation (Mandatory)

After writing the article body, **automatically generate an SVG cover image** and write it to `public/images/{category}/{slug}/cover.svg`. No user input needed — the cover is pure SVG code.

**Output path**: `public/images/{category}/{slug}/cover.svg`
**Frontmatter**: set `image: "/images/{category}/{slug}/cover.svg"`

**Cover SVG Template** — follow the pixel design system exactly. Here is the base template:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0b12"/>
      <stop offset="100%" stop-color="#13131e"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Dot grid pattern -->
    <pattern id="dots" width="50" height="50" patternUnits="userSpaceOnUse">
      <circle cx="25" cy="25" r="1" fill="rgba(74,222,128,0.03)"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- Top decorative bar (dashed green) -->
  <rect x="0" y="0" width="1200" height="4" fill="#4ade80" stroke="none"
        stroke-dasharray="8 8" opacity="0.8"/>
  <line x1="0" y1="2" x2="1200" y2="2" stroke="#4ade80" stroke-width="4"
        stroke-dasharray="8 8" opacity="0.6"/>

  <!-- Border frame -->
  <rect x="16" y="16" width="1168" height="598" fill="none" stroke="#2a2a42" stroke-width="2"/>

  <!-- Site identifier -->
  <rect x="80" y="64" width="16" height="16" fill="#fbbf24" stroke="#fbbf24" stroke-width="2"/>
  <text x="108" y="78" font-family="'Press Start 2P', monospace" font-size="18"
        fill="#4ade80" letter-spacing="2">KB<tspan fill="#fbbf24">MJJ123</tspan><tspan fill="#4d5a7a" font-size="12">.cc</tspan></text>

  <!-- Separator line -->
  <rect x="80" y="108" width="60" height="2" fill="#4ade80" opacity="0.5"/>

  <!-- Title (adjust font-size based on length) -->
  <text x="80" y="180" font-family="'Press Start 2P', monospace" font-size="32"
        fill="#e8edf5" letter-spacing="-0.5">
    <!-- Title line 1 -->
  </text>
  <text x="80" y="228" font-family="'Press Start 2P', monospace" font-size="32"
        fill="#e8edf5" letter-spacing="-0.5">
    <!-- Title line 2 (if needed) -->
  </text>

  <!-- Description area -->
  <rect x="80" y="280" width="680" height="2" fill="#2a2a42"/>
  <text x="80" y="330" font-family="Inter, sans-serif" font-size="18" fill="#9aa8c9">
    <!-- Description line 1 -->
  </text>
  <text x="80" y="358" font-family="Inter, sans-serif" font-size="18" fill="#9aa8c9">
    <!-- Description line 2 -->
  </text>

  <!-- Category badge -->
  <rect x="80" y="420" width="180" height="32" rx="4" fill="rgba(74,222,128,0.08)"
        stroke="rgba(74,222,128,0.2)" stroke-width="1"/>
  <text x="100" y="441" font-family="'Press Start 2P', monospace" font-size="10" fill="#4ade80">
    <!-- category-slug -->
  </text>

  <!-- Decorative pixel blocks (right side) -->
  <rect x="900" y="160" width="24" height="24" fill="#4ade80" opacity="0.15"/>
  <rect x="940" y="160" width="24" height="24" fill="#4ade80" opacity="0.25"/>
  <rect x="980" y="160" width="24" height="24" fill="#4ade80" opacity="0.15"/>
  <rect x="920" y="200" width="24" height="24" fill="#fbbf24" opacity="0.2"/>
  <rect x="960" y="200" width="24" height="24" fill="#fbbf24" opacity="0.35"/>
  <rect x="940" y="240" width="24" height="24" fill="#fbbf24" opacity="0.15"/>

  <!-- Bottom tagline -->
  <text x="80" y="545" font-family="'Press Start 2P', monospace" font-size="9"
        fill="#4d5a7a" letter-spacing="1">✦ pixel · indie · craft ✦</text>

  <!-- Gold accent block bottom-right -->
  <rect x="1148" y="582" width="20" height="20" fill="#fbbf24" stroke="#fbbf24"
        stroke-width="2" opacity="0.6"/>
</svg>
```

**Design tokens (MUST use these exact values)**:
| Element | Value |
|---------|-------|
| Background | `#0b0b12` → `#13131e` gradient |
| Border | `#2a2a42`, 2px |
| Primary accent (green) | `#4ade80` |
| Secondary accent (gold) | `#fbbf24` |
| Title text | `#e8edf5` |
| Body text | `#9aa8c9` |
| Muted text | `#4d5a7a` |
| Pixel font | `'Press Start 2P', monospace` |
| UI font | `Inter, sans-serif` |
| Dot grid | `rgba(74,222,128,0.03)`, 50px spacing |

**Title sizing rules**:
| Title length | Font size | Lines |
|-------------|-----------|-------|
| < 30 chars | 36px | 1 |
| 30-55 chars | 32px | 2 |
| 55-80 chars | 28px | 2-3 |
| > 80 chars | 24px | 3 |

**Category badge colors** (pick one based on article category):
| Category | Badge color |
|----------|-------------|
| `dev-practice` | green `#4ade80` |
| `tools-workflow` | gold `#fbbf24` |
| `indie-mindset` | blue `#60a5fa` |
| `startup-diary` | orange `#f59e0b` |
| `product-business` | purple `#a78bfa` |
| `tech-trends` | cyan `#06b6d4` |

**Customization per article**:
1. Replace title text (split into lines based on length)
2. Replace description text (1-2 lines, key takeaway)
3. Set category badge text and color
4. Optionally adjust decorative pixel blocks (vary positions/opacity)
5. Keep the overall layout consistent — this is the brand identity

**Quality check**: The SVG must render correctly in browser. After writing, verify:
- viewBox is `0 0 1200 630`
- All fonts are specified (Press Start 2P for pixel, Inter for UI)
- No hardcoded text that doesn't match the article
- Color values match the design tokens exactly

#### 4D — Auto-Invoke image-planner (Mandatory)

After writing the article body, **automatically invoke the `image-planner` skill** to handle all image-related tasks. Do NOT manually create image directories or insert placeholders — delegate to image-planner.

**Trigger**: Every article written in Phase 4, regardless of type.

**What image-planner does**:
1. Creates `public/images/{category}/{slug}/` directory
2. Sets `image` field in frontmatter (cover image path)
3. Inserts `![alt](path)` placeholders at appropriate body locations
4. Generates architecture/flow SVGs where applicable
5. Outputs an image checklist to the user

**How to invoke**:
```
Skill: image-planner
Args: {slug} — the article slug just written
```

After image-planner returns:
- Verify all `![alt](path)` references are in the `.md` file
- Verify the `image` frontmatter field is set
- Include the image checklist in your Phase 6 output to the user

#### 4D — Visual Assets Plan

Every tutorial/how-to article should include visual assets to improve readability and user retention. During Phase 2, generate a **Visual Assets List** as part of the proposal.

**Asset Types & When to Use**:

| Type | When to Use | Can Generate? | Example |
|------|------------|---------------|---------|
| **Screenshot** | Real UI steps (console, dashboard, terminal output) | ❌ Must be real | GSC settings page, Cloud Console create service account |
| **Architecture Diagram** | System design, data flow, multi-component interaction | ✅ SVG/mermaid | JWT auth flow, data pipeline overview |
| **Flowchart** | Decision trees, conditional logic, troubleshooting paths | ✅ SVG/mermaid | "Which auth method to choose" decision tree |
| **Code Output** | Terminal results, JSON structure, API responses | ⚠️ Can use real output | `node scripts/gsc-pull.cjs` terminal output |
| **Comparison Table** | Before/after, tool comparison, feature matrix | ✅ HTML table in markdown | OAuth vs Service Account comparison |
| **Sequence Diagram** | Multi-step interactions between systems | ✅ mermaid | Client → Google OAuth → Token Exchange → API |

**Screenshot Naming Convention**:

```
public/images/{category}/{article-slug}/
├── {short-descriptive-name}.webp       # Primary (1200px wide)
└── {short-descriptive-name}-m.webp     # Mobile variant (600px wide)
```

Examples:
```
gsc-api-enable-api.webp           # Step: enabling the API
gsc-api-create-service-account.webp  # Step: creating service account
gsc-api-add-user.webp             # Step: adding user in GSC
gsc-api-terminal-output.webp      # Result: script running
gsc-api-json-output.webp          # Result: JSON data structure
```

**Markdown Embedding Format**:

```markdown
![Alt text describing what the screenshot shows](/images/{category}/{article-slug}/{filename}.webp)
```

Rules:
- Alt text must describe **what is shown**, not just "screenshot" or "image"
- Place image **immediately after** the paragraph that references it
- One image per major step (don't cluster 5 screenshots together)
- Mobile variant (`-m.webp`) is optional, used for responsive display

**Visual Assets List Template** (include in Phase 2 proposal):

```markdown
### Visual Assets

| # | Type | Description | Placement | Source |
|---|------|-------------|-----------|--------|
| 1 | Screenshot | Cloud Console: enable Search Console API | Step 1, after "enable it" | User captures |
| 2 | Screenshot | Cloud Console: create service account form | Step 1, after "fill in a name" | User captures |
| 3 | Architecture | JWT auth flow diagram | Step 3, before code | AI generates SVG |
| 4 | Screenshot | GSC: add user permissions page | Step 2, after "Add user" | User captures |
| 5 | Code Output | Terminal: script execution result | Step 5, after code block | User captures or AI simulates |
| 6 | Flowchart | Decision tree: which auth method | "Auth Method" section | AI generates SVG |
```

**Priority Rules** (if user can only provide limited screenshots):

1. **Must-have**: Any step where the UI is non-obvious or easy to get wrong
2. **Should-have**: Final result/output verification
3. **Nice-to-have**: Intermediate setup steps (text instructions are often sufficient)

For each "Must-have" screenshot, mark it in the proposal as `⚠️ Required — user must capture`.

#### 4E — Chinese Version (Mandatory)

Every article written in Phase 4 must also produce a **Chinese reference version**. This version is for the author and Chinese readers — it does NOT participate in deployment.

**Output location**: `content/translations/{slug}.zh.md`

This directory is NOT matched by the Nuxt Content collection (`source: 'posts/*.md'`), so it won't be built or deployed.

**Format**:

```markdown
---
title: "中文标题"
description: "中文描述"
slug: "{same-as-english-slug}"
originalDate: <same date as English version>
category: <same as English version>
tags: <same as English version>
note: "中文参考版本 — 不参与部署。英文原版: content/posts/{slug}.md"
---

[Full Chinese translation of the English article body]

[Same H2/H3 structure as the English version]
[Same code blocks — code stays in English, comments can be Chinese]
[Same images — same paths, alt text in Chinese]
```

**Translation rules**:
- **Full translation** — not a summary. Every section, every paragraph.
- **Code blocks**: keep code in English (variable names, function names). Comments and explanations around code in Chinese.
- **Technical terms**: keep English for tool/tech names (Cloudflare, Nuxt, Workers, D1, etc.). Translate concepts (e.g., "full-text search" → "全文搜索").
- **Tone**: match the English version's voice. If the English is casual/conversational, Chinese should be too — not stiff formal Chinese.
- **H2/H3 titles**: translate naturally, don't force literal translation. Keep the same structural rhythm.
- **Alt text for images**: in Chinese.

**When to write**: Immediately after the English article body is finalized (Phase 4B-4D complete). Write both versions before moving to Phase 5 Self-Check.

**Self-check addition**: The Chinese version should pass the same content-specificity check — no generic Chinese tech-blog filler.

#### 4F — Series Navigation (Section 9.1)

If this article is part of a series, append at the bottom:

```markdown
---
*Part of the "{series-name}" series. [上一篇 · 下一篇]*
```

Build the navigation links using the series slugs.

---

### Phase 5: Self-Check (Mandatory Before Output)

Run through this checklist on every article before presenting or saving:

#### Style Variation Check (NEW — run this FIRST)
- [ ] Does this article use a **different H2 skeleton** from the last 2-3 published posts? (If the last post was Troubleshooting, this one must NOT be.)
- [ ] Is the **opening style** different from the previous post? (No two consecutive "TL;DR:" or "Scene/Moment" openings.)
- [ ] Is the **closing style** different from the previous post?
- [ ] Did I pick a specific **archetype** (A-E) that matches the content type? (Not just defaulting to Troubleshooting.)
- [ ] Does the H2 sequence feel fresh — would a reader who's read the last 3 posts notice this is different at a glance?

#### SVG Cover Check
- [ ] `public/images/{category}/{slug}/cover.svg` exists
- [ ] viewBox is `0 0 1200 630`
- [ ] Uses pixel design tokens (exact colors: `#0b0b12`, `#4ade80`, `#fbbf24`, `#2a2a42`, `#e8edf5`, `#9aa8c9`, `#4d5a7a`)
- [ ] Title matches the article (not a placeholder)
- [ ] Font sizes follow the title-length sizing rules
- [ ] Category badge uses correct color for the article's category
- [ ] `image` field in frontmatter points to `/images/{category}/{slug}/cover.svg`
- [ ] SVG renders correctly (no broken text, no overflow)

#### Chinese Version Check
- [ ] Chinese version exists at `content/translations/{slug}.zh.md`
- [ ] Full translation — every section of the English version is present (not a summary)
- [ ] Same H2/H3 structure as English version
- [ ] Code blocks unchanged (code in English, explanations in Chinese)
- [ ] Tone matches the English version (not stiff formal Chinese if English is conversational)
- [ ] Frontmatter includes `note` field pointing to English original
- [ ] No Chinese tech-blog filler ("本文将介绍..." / "总结一下..." / "希望这篇文章对您有帮助")

#### SEO Quality & Intent Check
- [ ] **SERP format match**: Does this article's format (tutorial/listicle/comparison/guide) match the dominant format in the top 10 results?
- [ ] **Keyword pyramid**: Target word in title + first 100 words? Variant words mapped to H2s? Long-tails answered in body?
- [ ] **Search intent match**: Would someone searching the target keyword be satisfied with this content? (Not just "related to" — actually answers their query.)
- [ ] **Real data density**: At least 3 specific numbers (time/cost/performance/revenue/lines of code)? Not vague claims like "it's fast" or "it saved time."
- [ ] **Copy-paste artifact**: Does the article give the reader something to save/bookmark? (Checklist, template, decision tree, complete config, code repo.)
- [ ] **Competitive gap filled**: Does this article do at least 2 things the top 10 results DON'T do? (Real code, real screenshots, error paths, 2026 data, decision frameworks, specific niche like Nuxt+Cloudflare+D1.)
- [ ] **Topic cluster**: Does this article connect to existing posts? (2-3 body internal links + relatedPosts.)
- [ ] **E-E-A-T signals**: Real experience evident (specific error messages, actual project names, honest limitations)? No fabricated data?

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
- [ ] Every H3: does it name a specific object + specific conclusion? Or could it fit any article on the blog ("Attempt 1", "Checking the config", "Step 1")?
- [ ] Under any H2, can two H3s be swapped without reader noticing? If yes, reconsider the sub-division logic.
- [ ] Is each H3 clearly about ONE sub-problem, not two?

#### Section 7.2 — AI味 (AI Flavor) Check
- [ ] Any "总结升华句" at end of paragraphs? Remove.
- [ ] Any significantly/robustly/seamlessly/it's worth noting/leverage? Remove.
- [ ] Any sentence that sounds like it's trying to "balance" both sides when the post clearly takes one side?
- [ ] Are sentence lengths too uniform? Manually vary a few.
- [ ] Does Investigation include at least one wrong turn or misdiagnosis? (Section 5.1 requires it — if user didn't provide one, ask.)
- [ ] Any "In conclusion" / "In summary" / formulaic closing paragraph? Remove — end with the chosen closing style instead.
- [ ] Does the opening avoid the fixed phrase "Recently, while working on X..."? Rewrite to the chosen opening style (scene, error, data shock, bold claim, question, or direct dive).
- [ ] If a "Lessons Learned" section exists: is it a genuine checklist the reader can act on? Or is it generic platitudes that could appear in any post? If the latter, remove the section and weave specific lessons into the narrative.

#### Section 9 — Internal Links & Historical References
- [ ] **Historical references**: Did I read and use relevant existing posts? (Data callbacks, past decisions, evolving views — not just "see also")
- [ ] **Body links are natural**: Are internal links placed where the sentence naturally references another post? (Not clustered at top/bottom, not in a "Related Posts" section)
- [ ] **Semantic anchor text**: Does each link's text describe the target? (Not "click here" / "this post" / bare URL)
- [ ] **No forced links**: Is every body link genuinely relevant? (0 links is OK if nothing connects. Don't force.)
- [ ] **No duplicate links**: Same post not linked twice in one article
- [ ] relatedPosts has 1-3 existing post slugs (for sidebar widget)
- [ ] If series: navigation footer present and links are correct
- [ ] If this post references existing posts: check if those posts need their relatedPosts updated to back-link (Section 9.1)

#### Section 10 — Cover Image
- [ ] image field: either omitted, or a real image that represents core article content. Not a generic unrelated cover.

#### Actionability Check — "Can the Reader Copy-Paste and Learn?"
- [ ] **Copy-Paste Test** (tutorials/troubleshooting): Can the reader copy any code block and run it without modification? If not, is the missing context (imports, config, env setup) explicitly stated?
- [ ] **Environment Check**: Are versions/tools/specifics mentioned? (Node version, framework version, package manager, OS if relevant)
- [ ] **Expected Output**: Does each code/command block show what the reader should expect to see? (console output, file structure, browser behavior)
- [ ] **Wrong Turns** (troubleshooting): Does Investigation include at least one dead end the reader can learn from? (Not just the happy path)
- [ ] **Complete Configs**: Are config files shown in full, not as "add this to your config" fragments?
- [ ] **"Next Time" Test**: Does the ending give the reader something reusable — a checklist, decision framework, or template? (Match to the chosen closing style: "Prevent Next Time", "Where To Go Next", "So What?", etc.)
- [ ] **Prerequisites**: If the article assumes prior knowledge, is it stated upfront?
- [ ] **Visual Assets**: For tutorial/how-to articles — are there screenshots at every non-obvious UI step? Are architecture/flow diagrams included for multi-component systems?

---

### Phase 6: Save and Link

1. **Write** each `.md` file to `content/posts/{slug}.md` with `draft: true`
2. **Write** the Chinese version to `content/translations/{slug}.zh.md`
3. For each broken `relatedPosts` entry pointing to an existing post — **Edit** the target post's frontmatter to add a back-link in its `relatedPosts` (if not already at 3 cap; if at cap, replace weakest)
4. Present the output to user with:
   - List of files written (English + Chinese versions)
   - Summary of what's draft vs ready
   - **Visual Assets Checklist**: all required screenshots/diagrams with placement instructions
   - What still needs user action (screenshots, data, draft→published flip)
5. **Ask user to review before setting `draft: false`**
6. **Remind user of post-publish optimization cycle**:
   ```
   📅 发布后优化提醒:
   - 30 天后: 运行 `node scripts/gsc-pull.cjs` 查看收录和排名
   - CTR < 2%: 改标题和 meta description
   - 排名 10-20: 补充内容深度、加内链
   - 排名 30+: 考虑重写或合并到集群主文章
   - 6 个月后: 更新过时数据，补充新内容
   ```

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

**⚠️ Do NOT match the structural uniformity of existing posts.** Older posts all share the same H2 skeleton (TL;DR → Background → Problem → Investigation → Solution → My Take → Result → Lessons Learned). That's the problem this update fixes. Follow the Archetype system (4B) instead.

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
