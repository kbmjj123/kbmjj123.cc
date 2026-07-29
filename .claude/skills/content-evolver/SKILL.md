---
name: content-evolver
description: >
  Closed-loop learning engine for blog content. Pulls performance data, analyzes competitors,
  extracts patterns, identifies gaps, and proposes rule updates. Semi-automatic: requires user
  confirmation before updating any rules.
  Trigger: "月度复盘" / "evolve content" / "learn from competitors" / "update rules" / "content review"
---

# Content Evolver — kbmjj123.cc

## Overview

This skill is the **learning engine** of the content system. It closes the feedback loop between published articles and writing rules by:

1. Collecting performance data (GSC)
2. Analyzing competitor content (SERP top 5)
3. Extracting patterns from winners
4. Identifying content gaps
5. Proposing rule updates (requires user confirmation)
6. Updating memory files

**Design principle**: Semi-automatic. The skill gathers data and proposes changes, but the user confirms every rule update. No silent mutations.

## Memory Files

| File | Purpose | Updated By |
|------|---------|------------|
| `memory/successful-content-patterns.md` | Patterns from high-performing articles | This skill |
| `memory/competitor-intelligence.md` | SERP analysis, competitor structure/content | This skill |
| `memory/content-gaps.md` | Uncovered search intents, keyword opportunities | This skill |
| `memory/skill-changelog.md` | History of rule changes and why | This skill |

## Workflow

### Phase 1: Data Collection

#### 1A — Pull Fresh GSC Data

```bash
node scripts/gsc-pull.cjs
```

If credentials not found → inform user, skip to Phase 2 with existing data.

#### 1B — Load Article Lifecycle

Read `content/.blog-process.json` to get:
- All published articles with dates
- Series relationships
- Tag/category distribution

#### 1C — Categorize Performance

For each published article (>7 days old), classify:

| Category | Criteria | Action |
|----------|----------|--------|
| 🟢 **Winner** | CTR > 3% OR position < 10 | Extract patterns |
| 🟡 **Opportunity** | impressions > 500, position 10-20 | Optimize title/content |
| 🔴 **Underperformer** | impressions > 200, position > 30 | Rewrite or merge |
| ⚪ **Too Early** | impressions < 50 OR published < 7 days | Monitor |

Output:
```
## Performance Summary

🟢 Winners (N):
- [slug]: [impressions] imp, [ctr]% CTR, pos [position]

🟡 Opportunities (N):
- [slug]: [impressions] imp, [ctr]% CTR, pos [position]

🔴 Underperformers (N):
- [slug]: [impressions] imp, [ctr]% CTR, pos [position]
```

---

### Phase 2: Competitor Learning

For each 🟡 Opportunity and 🔴 Underperformer, analyze the current SERP.

#### 2A — Identify Target Keyword

From the article's `seo.title` and `seo.keywords`, extract the primary target keyword.

#### 2B — Fetch SERP Top 5

For each target keyword:
1. WebSearch the keyword
2. Fetch the top 5 results (WebFetch)
3. Extract from each result:
   - **Title structure**: How is the title formatted? (listicle, how-to, question, etc.)
   - **H2/H3 structure**: What sections do they cover?
   - **Content depth**: Word count estimate, code examples, images
   - **Intent coverage**: What user questions does each result answer?
   - **Missing intent**: What questions do they NOT answer?

#### 2C — Build Competitor Profile

For each keyword, create a structured profile:

```
### [keyword]

**SERP Top 5:**
1. [title] — [domain] — [what they cover well]
2. [title] — [domain] — [what they cover well]
3. ...

**Common patterns** (what all top results include):
- [pattern 1]
- [pattern 2]

**Intent gaps** (what NO top result covers):
- [gap 1: specific question/scenario]
- [gap 2]

**Your article's position**: [X]
**Your article's gap**: [what you're missing vs top 5]
```

#### 2D — Cross-Article Intent Analysis

Group related articles and check for:
- **Intent overlap**: Are two articles targeting the same intent? → Consider merging
- **Intent holes**: Is there a related intent no article covers? → New article opportunity
- **Internal linking gaps**: Do related articles link to each other?

---

### Phase 3: Pattern Extraction

#### 3A — Winner Pattern Analysis

For all 🟢 Winners, extract:

| Dimension | What to Extract |
|-----------|----------------|
| **Title** | Format (listicle/how-to/comparison), length, keyword placement |
| **Structure** | Number of H2s, use of tables/code/images, TL;DR presence |
| **Content** | Word count, code block count, image count |
| **SEO** | Keyword density, internal link count, related posts count |
| **Category** | Which category performs best? |
| **Tags** | Which tags correlate with high performance? |
| **Timing** | Day of week published, time since publication |

#### 3B — Underperformer Anti-Patterns

For all 🔴 Underperformers, identify:

- What do they have in common?
- Are they missing something Winners have?
- Is the keyword too competitive?
- Is the content too thin?

#### 3C — Synthesize Patterns

Combine findings into actionable patterns:

```
## Learned Patterns

### What Works (replicate these)
- [pattern 1]: [evidence from winners]
- [pattern 2]: [evidence]

### What Doesn't Work (avoid these)
- [pattern 1]: [evidence from underperformers]
- [pattern 2]: [evidence]

### Emerging Trends
- [trend]: [evidence]
```

---

### Phase 4: Gap Analysis

#### 4A — Keyword Gaps

From competitor analysis + existing content, identify:

```
## Content Gaps

### High Priority (competitors cover, you don't)
1. [keyword] — Volume: [X], KD: [Y] — covered by: [competitor URLs]
2. ...

### Medium Priority (related intents, lower volume)
1. [keyword] — Volume: [X] — why: [reason]
2. ...

### Low Priority (niche, long-tail)
1. [keyword]
2. ...
```

#### 4B — Structural Gaps

Compare your article structures to competitors:

```
## Structural Gaps

Your [slug] is missing:
- [section/element that top 3 competitors all have]
- [section/element]

Recommended addition:
- [specific section to add]
```

---

### Phase 5: Rule Update Proposals

**This phase requires user confirmation. Do NOT auto-update.**

#### 5A — Generate Proposals

Based on Phases 3-4, generate specific rule update proposals:

```
## Proposed Rule Updates

### Update 1: [title of change]
**What**: [specific change to make]
**Why**: [evidence from data]
**Affects**: [which skill file, which section]
**Priority**: [high/medium/low]

### Update 2: ...
```

#### 5B — Present to User

Show all proposals and ask for confirmation on each:

```
以上是基于本月数据的规则更新建议。

请确认：
1. 哪些更新要执行？
2. 哪些跳过？
3. 有没有需要修改的？
```

#### 5C — Execute Approved Updates

For each approved update:
1. Edit the target skill file (`content-strategist/SKILL.md` or `blog-post-producer/SKILL.md`)
2. Record the change in `memory/skill-changelog.md`
3. Update `memory/successful-content-patterns.md` with new patterns

---

### Phase 6: Memory Update

#### 6A — Update Pattern Memory

Write to `memory/successful-content-patterns.md`:
- New patterns discovered
- Updated confidence levels for existing patterns
- Retired patterns that no longer hold

#### 6B — Update Competitor Intelligence

Write to `memory/competitor-intelligence.md`:
- New SERP analysis results
- Updated competitor profiles
- New intent gaps discovered

#### 6C — Update Content Gaps

Write to `memory/content-gaps.md`:
- New keyword opportunities
- Prioritized by volume × (100-KD) × relevance

#### 6D — Update Changelog

Write to `memory/skill-changelog.md`:
- What rules were changed
- Why (data evidence)
- When
- User's decision (approved/modified/rejected)

---

### Phase 7: Report

Present a summary to the user:

```
## 月度内容复盘报告

### 📊 数据概览
- 发布文章: N 篇
- 🟢 赢家: N 篇
- 🟡 机会: N 篇
- 🔴 低迷: N 篇

### 🔍 竞品发现
- [keyword]: 竞品覆盖了 [X]，你没有
- [keyword]: 竞品的标题用了 [格式]，你的是 [格式]

### 📈 模式发现
- [pattern]: 赢家文章平均 [X] 字，你的 [Y] 字
- [pattern]: 带 [标签] 的文章 CTR 高于平均

### 🎯 内容空白
- 高优先级: [keyword 1], [keyword 2]
- 中优先级: [keyword 3]

### 📝 规则更新
- 已执行: N 项
- 已跳过: N 项
- 待确认: N 项

### 🎬 下一步建议
1. 优化 [slug] 的标题（CTR 太低）
2. 重写 [slug]（排名 >30）
3. 写新文章覆盖 [keyword]
```

---

## Integration with Other Skills

### content-strategist

At the start of each recommendation, read:
- `memory/successful-content-patterns.md` → apply learned patterns
- `memory/content-gaps.md` → prioritize gap-filling topics
- `memory/competitor-intelligence.md` → use SERP insights

### blog-post-producer

During Phase 0 (Content Strategy Check), read:
- `memory/successful-content-patterns.md` → apply structure patterns
- `memory/competitor-intelligence.md` → include missing sections

During Phase 5 (Self-Check), verify:
- Article includes patterns from memory
- Article covers intents that competitors cover

---

## Trigger Schedule

| Trigger | When | Scope |
|---------|------|-------|
| **Monthly review** | User says "月度复盘" / "monthly review" | Full workflow (all phases) |
| **Post-publish** | After publishing 3+ articles | Light review (Phase 1 + 3) |
| **Pre-write** | Before writing a new article | Competitor learning only (Phase 2) |
| **On-demand** | User says "evolve content" / "learn from competitors" | Full workflow |

---

## Constraints

- **Never auto-update rules** — always present proposals and wait for user confirmation
- **Never delete memory entries** — only add or update confidence levels
- **Always cite evidence** — every pattern proposal must reference specific article data
- **Respect user's domain** — if user says "skip", don't push
- **One update at a time** — don't overwhelm with 20 proposals; prioritize top 5
