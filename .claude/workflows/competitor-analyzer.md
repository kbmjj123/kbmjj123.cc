# Competitor Analyzer Workflow

## Purpose

Analyze the top-ranking competitors for a target keyword, identify content gaps, and generate actionable recommendations for writing or optimizing an article.

## Trigger

User says "analyze competitors for [keyword]" or "run competitor analysis on [keyword]". Can also be triggered from the performance-reviewer workflow for articles flagged as opportunities.

## Input

- `keyword` — the target keyword to analyze (required)
- `existingArticle` — slug of an existing article to compare against (optional)

## Steps

### Step 1: Search and Collect

1. WebSearch the target keyword
2. Collect the top 5 organic results (skip ads, skip Google's own properties like YouTube/Maps)
3. For each result, record: title, URL, domain

### Step 2: Fetch and Analyze Each Competitor

For each of the top 5 results:

1. WebFetch the URL
2. Extract:
   - **H2/H3 structure** — the outline of the article
   - **Approximate word count** — count of content sections
   - **Key angles** — what specific sub-topics or questions does this article address?
   - **Unique elements** — does it have code examples, screenshots, diagrams, comparison tables, checklists?
   - **Content type** — tutorial / guide / listicle / comparison / documentation

### Step 3: Compare Against Existing Article (if provided)

If an `existingArticle` slug was provided:

1. Read the existing article from `content/posts/{slug}.md`
2. Compare its structure against each competitor:
   - **Topics you cover that competitors don't** — your unique angles
   - **Topics competitors cover that you don't** — content gaps
   - **Structure differences** — do competitors use different H2 organization?
   - **Depth differences** — are competitors more detailed on specific sub-topics?

### Step 4: Generate Report

Output the analysis in this format:

```
## Competitor Analysis: "[keyword]"

### Top 5 Results

| # | Title | Domain | Type | Key Angles |
|---|-------|--------|------|------------|
| 1 | [title] | [domain] | [type] | [angles] |
| 2 | ... | ... | ... | ... |

### Content Gaps (competitors cover, you don't)

- [gap 1] — [which competitors cover it]
- [gap 2] — [which competitors cover it]

### Your Advantages (you cover, competitors don't)

- [advantage 1]

### Structural Observations

- [observation about how competitors organize content]
- [observation about content depth/format]

### Recommendations

1. [Specific action: add section about X]
2. [Specific action: expand Y with more detail]
3. [Specific action: add Z type of content (code/screenshot/checklist)]

### Keyword Opportunity Assessment

- Search intent: [Informational / Troubleshooting / Commercial]
- Competition strength: [Strong / Moderate / Weak]
- Your differentiation potential: [High / Medium / Low]
- Recommended action: [Write new / Rewrite existing / Skip]
```

## Output Destination

Present the report to the user in conversation. If the user wants to act on it, trigger the blog-post-producer skill with the analysis as input.
