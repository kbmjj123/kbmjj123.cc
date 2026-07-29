---
name: content-strategist
description: >
  Data-driven content strategy for kbmjj123.cc. Handles GSC data pulls,
  content idea generation, outline creation, and performance reviews.
  Works with real search data (GSC API + Google Autocomplete + optional Semrush CSV).
  Triggers on: "推荐选题", "what should I write", "content ideas", "拉取数据",
  "performance review", "月度报告", "generate outline", "给我大纲", "选题".
compatibility:
  tools_required:
    - Bash (for running scripts)
    - Read (for reading data files)
    - WebSearch (for competitor analysis)
    - WebFetch (for fetching competitor content)
  platforms:
    - Claude Code
---

# Content Strategist — kbmjj123.cc

## Overview

This skill generates data-driven content recommendations using real user search data. It pulls data from GSC, expands with Google Autocomplete, optionally incorporates Semrush reports, and produces actionable content strategies.

**Companion skill**: `blog-post-producer` handles writing articles. This skill handles deciding **what** to write.

**Learning integration**: This skill reads memory files from `content-evolver` to apply learned patterns:
- `memory/successful-content-patterns.md` — what article structures and strategies work
- `memory/competitor-intelligence.md` — SERP analysis and competitor gaps
- `memory/content-gaps.md` — prioritized keyword opportunities

Always load these files at the start of any recommendation workflow.

## Domain Boundary — Content Focus

All content recommendations MUST stay within the blog's core identity: **a developer building products and sharing real technical experience**.

### Core Pillars (核心支柱)

| Pillar | Description | Example Topics |
|--------|-------------|----------------|
| **Building** | Shipping real products, technical implementation | "How I built X with Y", deployment guides, architecture decisions |
| **Tools** | Developer tools, workflows, infrastructure | Cloudflare, Nuxt, Vercel, Supabase, CI/CD, cost optimization |
| **Growth** | SEO, monetization, user acquisition | GSC optimization, AdSense, tool site growth, content strategy |
| **Learning** | Debugging, problem-solving, lessons from real projects | "Why X broke", troubleshooting guides, migration stories |
| **Mindset** | Productivity, motivation, solo/team dynamics | Burnout, focus, decision-making, pivoting |

### In Scope

- Technical implementation tied to real projects (not textbook examples)
- Tool/infrastructure decisions with real cost/performance data
- SEO, growth, and monetization strategies with actual results
- Debugging and troubleshooting from real production issues
- Product decisions and lessons from shipping
- Developer workflows and productivity
- Framework/library usage in production (Nuxt, Vue, Cloudflare, etc.)

### Out of Scope

- Generic tutorials with no real-world context
- Framework internals deep dives (unless solving a specific product problem)
- Enterprise/team-specific topics (code review processes, team management)
- Job market, career advice, interview prep
- Academic CS topics (algorithms, data structures)
- News/announcements without actionable insight

### Filtering Rule

```
For each candidate topic, ask:
"Does this help a developer who is building and shipping products?"

- If it's generic knowledge → skip or add real-project context
- If it's directly actionable for builders → include
- If it needs an angle rewrite to be actionable → rewrite
```

**Example**:
- ❌ "How to set up Cloudflare Workers" — generic docs
- ✅ "How I run my SaaS for $0 on Cloudflare Workers" — real experience
- ❌ "Nuxt 4 migration guide" — official docs cover this
- ✅ "Nuxt 4 SSG: what broke when I migrated and how I fixed it" — real debugging
- ✅ "Cloudflare D1 vs Supabase for indie projects" — real cost comparison

## Data Sources

| Source | Type | Script |
|--------|------|--------|
| Google Search Console | Your site's actual search queries, impressions, positions | `node scripts/gsc-pull.cjs` |
| Google Autocomplete | Real-time user search suggestions (free, no auth) | Built into `content-ideas.cjs` |
| Semrush CSV | Keyword volume, KD, competition (manual export) | `--semrush` flag on `content-ideas.cjs` |

## Triggers and Workflows

### Trigger 1: "推荐选题" / "what should I write" / "content ideas"

User wants content recommendations.

**Steps**:

1. **Check GSC data freshness**
   - Read `content/.gsc-performance.json`
   - If `lastPulled` is null or older than 30 days → run `node scripts/gsc-pull.cjs` first
   - If credentials not found → inform user, use `--seed` cold-start mode instead

2. **Run content idea generator**

   If GSC data exists:
   ```bash
   node scripts/content-ideas.cjs --top 15
   ```

   If no GSC data (cold-start):
   ```bash
   node scripts/content-ideas.cjs --top 15 --seed
   ```
   This uses the blog's tech stack keywords as seeds and expands via Google Autocomplete.

   If user has a Semrush CSV:
   ```bash
   node scripts/content-ideas.cjs --top 15 --semrush path/to/report.csv
   ```

3. **Domain Filter** — Apply the content focus boundary:
   - For each candidate idea, ask: "Does this help a developer who is building and shipping products?"
   - Remove generic tutorials with no real-world context
   - Rewrite borderline topics with actionable angle (e.g., "cloudflare d1 tutorial" → "cloudflare d1 in production: what I learned")
   - Prioritize topics where the user has real project experience

4. **AI Processing** — Read the output (`content/.content-ideas.json`) and:
   - Filter out ideas that are too similar to existing articles
   - Group ideas by category (dev-practice, tools-workflow, etc.)
   - Rank by: search demand × content gap × your expertise fit
   - Cross-reference with `content/.blog-process.json` performance data
   - Apply patterns from `memory/successful-content-patterns.md` if exists

4. **Present recommendations**:
   ```
   ## 内容选题推荐（基于真实搜索数据）

   ### 最佳机会
   1. "[keyword]"
      搜索来源: [GSC/Autocomplete/Semrush]
      数据: [impressions, position, or volume]
      为什么值得写: [1 sentence]
      建议分类: [category]
      你有相关页面吗: [existing page if any]

   2. ...

   ### 内容空白（你的站目前没覆盖的话题）
   - [category]: 没有文章覆盖 [topic]
   - ...

   ### 需要优化的现有文章
   - [slug]: [reason why it needs optimization]

   要我对哪个选题生成大纲？
   ```

### Trigger 2: "拉取数据" / "update gsc" / "pull gsc data"

User wants to refresh GSC performance data.

**Steps**:

1. Run `node scripts/gsc-pull.cjs`
2. Report results: how many pages, what changed
3. If significant changes detected, flag them

### Trigger 3: "generate outline for [keyword]" / "给我关于 X 的大纲"

User wants an article outline for a specific keyword.

**Steps**:

0. **Domain check** — Verify the keyword fits the blog's content pillars (Building / Tools / Growth / Learning / Mindset). If it's too generic, rewrite with actionable angle. If completely out of scope, suggest an alternative.

1. **Gather search data**:
   - Run Google Autocomplete expansion for the keyword
   - Check GSC data for existing rankings on this keyword
   - If Semrush data available, check volume/KD

2. **Competitor analysis**:
   - WebSearch the keyword → collect top 5 results
   - WebFetch each → extract H2/H3 structure, key topics, content format
   - Identify gaps: what competitors cover, what they miss

3. **Check existing content**:
   - Scan `content/posts/` for articles covering similar topics
   - If exists: recommend rewriting instead of new article

4. **Generate outline** following the `outline-generator.md` workflow:
   - Each H2 maps to a real search query
   - Include table-stakes topics (what all competitors cover)
   - Include differentiation angle (what you uniquely offer)
   - Include actionable elements (checklist, code, framework)

5. **Present outline** and ask:
   ```
   要我用这个大纲开始写文章吗？（触发 blog-post-producer）
   ```

### Trigger 4: "月度报告" / "performance review"

User wants a performance review.

**Steps**:

1. **Pull fresh GSC data**:
   ```bash
   node scripts/gsc-pull.cjs
   ```

2. **Categorize articles** by performance (from `.gsc-performance.json`):
   - 🟢 Winners: CTR > 3%, position < 10
   - 🟡 Opportunities: impressions > 500, position 10-20
   - 🔴 Underperformers: impressions > 200, position > 30
   - ⚪ Too Early: impressions < 50

3. **Analyze patterns**:
   - What do winners have in common? (category, structure, keyword type)
   - What do underperformers lack?
   - Read existing articles to identify structural patterns

4. **Generate report** following the `performance-reviewer.md` workflow

5. **Update memory**: Write findings to `memory/successful-content-patterns.md`

6. **Recommend actions**:
   ```
   基于本月数据，建议：
   1. 写 [N] 篇新文章覆盖 [gaps]
   2. 重写 [slug] 因为 [reason]
   3. 优化 [slug] 的标题因为 CTR 太低
   要从哪个开始？
   ```

### Trigger 5: "check [slug]" / "检查这篇文章"

User wants a pre-publish check on a draft.

**Steps**:

1. Read the article at `content/posts/{slug}.md`
2. Run all Phase 5 self-check items from blog-post-producer
3. For each item: ✅ pass or ❌ fail with specific evidence
4. Generate report with action items
5. Offer to fix issues directly

## Script Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/gsc-pull.cjs` | Pull GSC performance data | `node scripts/gsc-pull.cjs [--days 30] [--site URL]` |
| `scripts/content-ideas.cjs` | Generate content ideas | `node scripts/content-ideas.cjs [--top N] [--semrush path.csv]` |
| `.claude/skills/blog-post-producer/scripts/rebuild-process.cjs` | Rebuild .blog-process.json | `node .claude/skills/blog-post-producer/scripts/rebuild-process.cjs` |

## Output Files

| File | Purpose |
|------|---------|
| `content/.gsc-performance.json` | Raw GSC data, updated by gsc-pull.cjs |
| `content/.content-ideas.json` | Latest content recommendations |
| `content/.blog-process.json` | Article lifecycle tracker with performance data |

## Integration with blog-post-producer

When this skill recommends writing a new article:
1. Pass the selected topic + outline to `blog-post-producer`
2. `blog-post-producer` Phase 0 loads performance data automatically
3. The writing process follows the standard skill workflow

When this skill recommends rewriting an existing article:
1. Read the existing article
2. Run competitor analysis for the target keyword
3. Generate improved outline
4. Pass to `blog-post-producer` for rewrite
