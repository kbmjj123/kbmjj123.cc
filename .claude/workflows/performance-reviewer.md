# Performance Reviewer Workflow

## Purpose

Monthly review of blog performance using GSC data. Categorizes articles, identifies patterns in winners/losers, generates actionable recommendations, and updates the memory system with learned patterns.

## Trigger

User says "run performance review" or "monthly blog review". Should be run once per month, ideally on the 1st.

## Prerequisites

- `content/.gsc-performance.json` must exist (run `node scripts/gsc-pull.cjs` first)
- `content/.blog-process.json` must exist

## Steps

### Step 1: Load Data

1. Read `content/.gsc-performance.json`
2. Read `content/.blog-process.json`
3. If `.gsc-performance.json` has `lastPulled: null`, tell user to run `node scripts/gsc-pull.cjs` first and stop

### Step 2: Categorize Articles

Classify each article with GSC data into one of four categories:

| Category | Criteria | Emoji |
|----------|----------|-------|
| **Winner** | CTR > 3% AND avg position < 10 | 🟢 |
| **Opportunity** | impressions > 500 AND avg position 10–20 | 🟡 |
| **Underperformer** | impressions > 200 AND avg position > 30 | 🔴 |
| **Too Early** | impressions < 50 | ⚪ |

Sort each category by impressions (descending).

### Step 3: Analyze Winners

For each winner article:

1. Read its frontmatter from `content/posts/{slug}.md`
2. Identify patterns:
   - What category is it in?
   - What tags does it have?
   - What keyword is it targeting?
   - What's the article structure (template used)?
   - What's the content length?
   - Does it have screenshots/code/checklists?
3. Look for common patterns across all winners

### Step 4: Analyze Underperformers

For each underperformer:

1. Read its frontmatter
2. Identify potential causes:
   - Wrong keyword targeting?
   - Content too thin?
   - No actionable content (diary-style)?
   - Title doesn't match search intent?
   - Missing images/screenshots?
3. Recommend specific action: rewrite / consolidate with another article / delete

### Step 5: Identify Opportunities

For each opportunity article:

1. Note the gap between current position and top 10
2. Check if the CTR is below expected for the position (title/description problem)
3. Recommend: trigger competitor analysis workflow / improve title / add content

### Step 6: Generate Report

```
## Monthly Performance Report — [date]

### Summary
- Total published articles: [N]
- Articles with GSC data: [N]
- Total impressions: [N]
- Total clicks: [N]
- Average CTR: [N]%

### 🟢 Winners ([N] articles)
For each:
- **[title]** — [clicks] clicks, position [X], CTR [Y]%
  → Pattern: [what makes this work]
  → Keep doing: [specific pattern to replicate]

### 🟡 Opportunities ([N] articles)
For each:
- **[title]** — [impressions] impressions, position [X], CTR [Y]%
  → Problem: [CTR too low / content gap / etc.]
  → Action: [specific recommendation]
  → Run: competitor analysis for "[keyword]"?

### 🔴 Underperformers ([N] articles)
For each:
- **[title]** — [impressions] impressions, position [X]
  → Cause: [likely reason]
  → Action: [rewrite / consolidate / delete]

### ⚪ Too Early ([N] articles)
- [list of articles] — need more data, check again next month

### Trending
- 📈 Improving: [list]
- 📉 Declining: [list]

### Content Strategy Recommendations
1. [Based on winners: write more articles about X type of topic]
2. [Based on gaps: cover Y category which has no articles]
3. [Based on underperformers: stop writing Z style of content]
```

### Step 7: Update Memory

After generating the report, update the memory file at:

```
/Users/kbmjj123/.claude/projects/-Users-kbmjj123-Desktop-fullstack-kbmjj123-cc/memory/successful-content-patterns.md
```

Include:
- Current date
- Patterns extracted from winners (what works)
- Patterns extracted from underperformers (what doesn't work)
- Content gaps identified
- Updated keyword strategy notes

### Step 8: Update .blog-process.json

Update each article's `performance.trend` field based on the comparison between current and previous period data.

## Output

Present the full report to the user. After discussion, ask if they want to:
1. Run competitor analysis on any opportunity articles
2. Trigger blog-post-producer to write new articles based on identified gaps
3. Schedule the next review
