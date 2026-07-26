# Pre-Publish Checker Workflow

## Purpose

Run the Phase 5 Self-Check on a draft article before publishing. Produces a pass/fail report with specific fix instructions for each failing item.

## Trigger

User says "check this article" or "pre-publish check on [slug]" or "这篇文章能发了吗".

## Input

- `slug` — the article slug to check (required)

## Steps

### Step 1: Load the Article

Read `content/posts/{slug}.md`. If not found, report error and stop.

Parse frontmatter and body. Extract:
- title, seo.title, seo.description, tags, category, relatedPosts, draft status
- All H2/H3 headings from body
- All code blocks from body
- All image references from body

### Step 2: Run Self-Check

Go through each check item below. For each, mark ✅ (pass) or ❌ (fail) with specific evidence.

#### Section 2.1 — Keyword Research Verification
- [ ] Is there a documented target keyword with search data or estimated demand signals?
  - Check: does the article mention a target keyword? Does it have Semrush data or Autocomplete verification?
- [ ] If Semrush Volume is N/A: are ≥2 of 4 alternative demand signals documented?
  - Check: Google Autocomplete, Related Searches, SO/Reddit, PAA
- [ ] Does the post title contain or closely relate to the target keyword?
  - Check: compare title against target keyword
- [ ] Do seo.title and seo.description include the target keyword naturally?
  - Check: compare seo fields against target keyword
- [ ] Was SERP analysis done? Is there a documented reason why this article can compete?
  - Check: does the article reference competitor analysis?

#### Section 3.1 — Content Specificity
- [ ] Can any sentence be transplanted to another post in the same category and still read naturally?
  - Check: scan for generic sentences that could apply to any article
- [ ] Is there at least one concrete number where a vague word could have been used?
  - Check: look for specific numbers, dates, measurements
- [ ] Does the article end with something the reader can directly use?
  - Check: does Lessons Learned contain a checklist or framework, not just a summary?

#### Section 5.1 — Real Content Check
- [ ] Did I mark any real screenshot as needing user input?
  - Check: look for `<!-- @user: needs ... -->` markers
- [ ] For any solution/code — is the logic accurate to the user's real project?
  - Check: is the code specific to the project, not generic placeholder?

#### Section 7.1 — H3 Title Quality
- [ ] Every H3: does it name a specific object + specific conclusion?
  - Check: scan H3 titles for generic names like "Attempt 1", "The Problem"
- [ ] Under any H2, can two H3s be swapped without reader noticing?
  - Check: are H3s clearly distinct from each other?

#### Section 7.2 — AI味 Check
- [ ] Any "总结升华句" at end of paragraphs?
  - Check: scan for conclusion-like sentences that add no information
- [ ] Any significantly/robustly/seamlessly/it's worth noting/leverage?
  - Check: scan for AI-flavored phrases
- [ ] Does Investigation include at least one wrong turn or misdiagnosis?
  - Check: does the investigation section show a dead end?
- [ ] Does the opening avoid "Recently, while working on X..."?
  - Check: first paragraph

#### Section 9 — Internal Links
- [ ] relatedPosts has 1-3 existing post slugs (not empty, not >3)
  - Check: count relatedPosts entries
- [ ] At least 1 natural anchor-text link in body to another post
  - Check: scan body for `[text](/posts/slug)` links
- [ ] If series: navigation footer present and links are correct
  - Check: if series field is set, check for series navigation

#### Section 10 — Cover Image
- [ ] image field: either omitted, or a real image representing core content
  - Check: if image is set, is it relevant?

#### Actionability Check
- [ ] Copy-Paste Test: can the reader copy any code block and run it?
  - Check: do code blocks include environment context?
- [ ] Environment Check: are versions/tools mentioned?
  - Check: look for version numbers, tool names
- [ ] Expected Output: does each code block show expected result?
  - Check: look for output examples
- [ ] Wrong Turns: does Investigation include at least one dead end?
  - Check: (same as AI味 check)
- [ ] Complete Configs: are config files shown in full?
  - Check: look for "add this to your config" fragments
- [ ] "Next Time" Test: does ending provide reusable tool?
  - Check: Lessons Learned section
- [ ] Prerequisites: if assumes prior knowledge, is it stated?
  - Check: look for setup/prerequisite section

### Step 3: Generate Report

```
## Pre-Publish Check: "{title}"

File: content/posts/{slug}.md
Draft: {true/false}

### Summary
✅ Passed: {N} / {Total}
❌ Failed: {N}

### Results

#### Keyword Research (Section 2.1)
✅ [item] — [evidence]
❌ [item] — [evidence] → Fix: [specific instruction]

#### Content Specificity (Section 3.1)
...

#### ...

### Action Items (must fix before publishing)
1. [Specific fix instruction]
2. [Specific fix instruction]

### Ready to Publish?
[Yes / No — list blocking items]
```

### Step 4: Offer to Fix

After presenting the report, ask the user:
- "Want me to fix these issues now?"
- If yes, apply fixes directly to the .md file and re-run the check
