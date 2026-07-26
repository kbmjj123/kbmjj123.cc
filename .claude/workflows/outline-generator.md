# Article Outline Generator Workflow

## Purpose

Generate a keyword-driven article outline based on real search data and competitor analysis. Produces an outline that targets actual user search queries, not the writer's assumptions.

## Trigger

User says "generate outline for [keyword]" or "给我一个关于 X 的大纲" or "plan an article about X".

## Input

- `keyword` — the target keyword to write about (required)
- `existingArticle` — slug of an existing article to rewrite (optional)

## Steps

### Step 1: Gather Real Search Data

**1A — Google Autocomplete Expansion**

For the target keyword, fetch autocomplete suggestions:
- Base query: `[keyword]`
- Question variants: `how to [keyword]`, `[keyword] vs`, `[keyword] tutorial`, `[keyword] example`
- Record all unique suggestions — these are real user queries

**1B — GSC Data Check (if available)**

If `content/.gsc-performance.json` exists and has data:
- Check if the site already ranks for this keyword or related queries
- Note current position, impressions, clicks
- If an existing article already covers this keyword, consider rewriting instead of creating new

**1C — Semrush Data (if available)**

If the user has provided Semrush data (via `--semrush` flag or manual report):
- Get exact search volume and KD
- Identify related keywords with volume

### Step 2: Competitor Analysis

1. WebSearch the target keyword
2. Collect top 5 organic results (skip ads, skip YouTube/Maps)
3. For each result, WebFetch and extract:
   - H2/H3 structure (the article outline)
   - Key sub-topics covered
   - Content format (tutorial, listicle, comparison, guide)
   - Unique elements (code examples, screenshots, tables, checklists)

### Step 3: Identify Content Gaps and Angles

Compare competitor coverage against your unique position:
- **Topics all competitors cover** → must include (table stakes)
- **Topics no competitor covers** → your differentiation opportunity
- **Topics only some competitors cover** → optional, based on relevance
- **Your unique angle** → what can you add that competitors can't? (real project experience, specific tool stack, actual data)

### Step 4: Generate Outline

Produce an outline that:
1. Covers all table-stakes topics (so you're competitive)
2. Leads with your unique angle (so you're differentiated)
3. Maps each H2 to a real search query (so it ranks)
4. Includes actionable elements (so readers get value)

Output format:

```
## Article Outline: "[Working Title]"

**Target Keyword**: [keyword]
**Search Data**: [volume/mo, KD, or "estimated from Autocomplete"]
**Search Intent**: [Informational / Troubleshooting / Comparison]
**Differentiation**: [your unique angle]

### Structure:

## TL;DR
[One paragraph — problem + solution + result]

## [H2: maps to main keyword]
- [H3: maps to long-tail query 1]
- [H3: maps to long-tail query 2]

## [H2: maps to related query]
- [H3: ...]

...

## Lessons Learned
- [Checklist item 1]
- [Checklist item 2]

### Competitor Gaps Addressed:
- [gap 1] → covered in [H2 section]
- [gap 2] → covered in [H2 section]

### Real Search Queries Targeted:
| H2/H3 | Target Query | Source |
|-------|-------------|--------|
| ... | ... | GSC / Autocomplete / Semrush |

### Recommended Next Steps:
1. Run blog-post-producer with this outline
2. Or rewrite [existing article slug] using this structure
```

## Output

Present the outline to the user. If approved, it becomes input to the blog-post-producer skill.
