---
title: "My SEO Checklist for Every New Page (Before and After Launch)"
description: "A six-phase checklist for launching a new tool page, where every task is tied back to a specific mechanism in how Google discovers, tests, and converges a page's ranking — not a generic to-do list."
date: 2026-07-18
category: "tools-workflow"
readTime: "8mins"
tags:
  - "#growth"
  - "#productivity"
  - "#saas"
  - "#cloudflare"
image: "https://assets.kbmjj123.cc/blog/tools-workflow/seo-checklist-new-page-launch/seo-checklist-new-page-launch-timeline.png"
draft: false
series: "how-google-actually-tests-new-pages"
seriesOrder: 3
seo:
  title: "New Page SEO Checklist: From Launch to Ranking Convergence"
  description: "A six-phase, mechanism-backed checklist for launching a new page — keyword grouping, indexing, exploration-period prep, weekly review, and convergence diagnosis."
  keywords: []
relatedPosts:
  - "how-google-tests-new-pages-explained"
  - "68k-impressions-8-clicks-image-sitemap-blind-spot"
---

## TL;DR

This is the checklist I now run for every new tool page on bulkpictools.com. It's organized around the actual mechanism covered in the first two posts in this series, not generic SEO advice — every task exists because of a specific thing Google is doing at that phase, and I've noted the "why" next to each one so the list doesn't go stale the moment I forget the reasoning behind it.

## Background

After working through [the diagnosis case study](/posts/gsc-impressions-zero-clicks-diagnosis) and [the full discovery-to-convergence mechanism](/posts/how-google-tests-new-pages-explained), I turned the discussion into a checklist I could actually run against `split-image` and every tool page after it, instead of re-deriving the reasoning from scratch each time. This is that checklist, with the "why" kept attached so it stays useful months from now.

![Six-phase timeline overview of the new-page SEO checklist, showing content/keyword, technical/indexing, and signal/data tracks across each phase](https://assets.kbmjj123.cc/blog/tools-workflow/seo-checklist-new-page-launch/seo-checklist-new-page-launch-timeline.svg)

## The Checklist

### Phase 0 — Before launch: content and internal-link planning

- [ ] **Pick 1-2 core queries** — the terms users most commonly search for this function.
  *Why: this is the seed the rest of the related-query pool gets built around.*
- [ ] **Pull related terms with a keyword tool**, then group them by intent: synonyms (split/divide/slice/cut), scenario terms (into 3/grid/instagram 3x3), format/platform terms (only the ones the tool actually supports), brand-comparison terms.
  *Why: per the convergence mechanism, a wider intent-consistent pool means more independent query-loops running in parallel, which is what actually speeds up sample accumulation — not "more keywords" in the abstract.*
- [ ] **Find 2-3 ranking competitor pages**, break down their structure by "what question does this section answer," not just what words they use.
  *Why: this is the closest practical substitute for seeing Google's own semantic mapping of the topic.*
- [ ] **Compare against your own functionality** to find intent gaps competitors haven't covered.
  *Why: this is where a new, lower-authority page can actually win — a specific uncovered sub-intent doesn't require outranking an established competitor on the broad term.*
- [ ] **Plan H2/H3 structure** so each valuable intent group gets its own heading, not all blended into one paragraph.
  *Why: heading structure is a direct input into how Google segments the page into sub-topics — this is the single highest-leverage lever for widening the testable query pool.*
- [ ] **Design the first screen so the core function is obvious within 3-5 seconds.**
  *Why: this is the thing that determines whether a rare aggressive test-probe (see Phase 3) produces a positive or negative sample — and you don't get to choose when those probes happen.*
- [ ] **Plan 1-2 internal links** from high-traffic, frequently-crawled existing pages on the site.
  *Why: covered in Phase 1 below — internal links affect both discovery speed and re-crawl frequency.*

### Phase 1 — Launch day: accelerate discovery

- [ ] **Submit the URL via GSC's URL Inspection and request indexing.** Highest priority — compresses discovery from days/weeks down to hours/a couple of days.
  *Why: this is the only lever that actively pulls Googlebot toward the page instead of waiting for it to wander there.*
- [ ] **Place the internal links planned in Phase 0**, live, from already-indexed pages.
  *Why: this isn't just a discovery shortcut — it persistently affects how often the page gets re-crawled, which shortens the feedback loop every time content gets updated later.*
- [ ] **Confirm the page is in sitemap.xml** and the sitemap shows "Success" in GSC.
  *Why: background safety net in case the first two levers don't catch it.*

### Phase 2 — Post-crawl, 1-3 days: verify what Google actually saw

- [ ] **Run a `site:` search** to confirm indexing.
  *Why: `site:` confirms presence in the index, separate from ranking — it's a yes/no checkpoint, not a quality signal.*
- [ ] **Check what content actually got crawled**, especially for JS-rendered functional areas — is there enough surrounding text for Google to understand the page even if the interactive widget didn't render cleanly?
  *Why: a thin crawl result directly narrows the related-query pool from Phase 0, regardless of how good the planning was.*
- [ ] **Verify H1/H2/H3 structure matches the intent groups planned in Phase 0.**
  *Why: structure mismatches here are the most common reason a well-planned keyword pool doesn't translate into a wide tested-query pool.*

### Phase 3 — Exploration period: get ready to be probed

- [ ] **Walk through the core-intent user journey yourself**, on both desktop and mobile, start to finish, noting every friction point.
  *Why: the exploration period is specifically about whether rare probe-window visitors convert into positive engagement signal — friction here directly produces negative samples.*
- [ ] **Run PageSpeed Insights**, fix anything pushing LCP past 2.5s.
  *Why: a slow load during a rare probe window can produce an abandon before the user even sees the content — recorded the same as if the content itself failed.*
- [ ] **Install GA4 or Microsoft Clarity** if not already running.
  *Why: GSC doesn't expose dwell time or pogo-sticking — this is the only way to see the actual engagement signal Google is computing internally, even approximately.*
- [ ] **Build a quick preset/shortcut for any specific scenario terms** found in Phase 0 (e.g. a one-click "split into 3" preset).
  *Why: lowers the friction specifically for the sub-intent most likely to be probed next, per the scenario-grouping done earlier.*

### Phase 4 — Weekly or biweekly: data review

- [ ] **Export the query-level GSC breakdown** for the page every 1-2 weeks. Flag any query at position <15 with 0 clicks (negative-signal priority) and any query at position >20 with clicks (positive-signal priority).
  *Why: this directly mirrors the signal-collection mechanism — these are the queries currently accumulating the most informative samples.*
- [ ] **Cross-check clicked sessions against GA4/Clarity** to confirm whether the click led to actual task completion, not just a visit.
  *Why: a click without task completion is closer to a negative engagement signal than a positive one, even though GSC shows it as a plain "click."*
- [ ] **Log the date of any content/title change**, and avoid touching the same section again for 2-3 weeks.
  *Why: per the convergence mechanism, overlapping changes make it impossible to attribute the next data point to a specific cause.*

### Phase 5 — 1-3 months later: convergence diagnosis

- [ ] **Check whether position volatility on core queries is narrowing over time** (e.g. ±40 trending toward ±20), not whether the position number itself looks good this week.
  *Why: this is the true-vs-false convergence check from the previous article — the only reliable read on whether the page is actually stabilizing.*
- [ ] **If converged but settled at a mediocre position**, diagnose which input is the bottleneck: content relevance, domain/page authority, or engagement signal — and go back to the corresponding phase rather than re-doing everything.
- [ ] **If sample volume still hasn't grown meaningfully after 2+ months**, the keyword pool from Phase 0 is probably too narrow — widen it rather than continuing to wait.

## Old-page maintenance — monthly, for every already-indexed page

- [ ] **Export last 28 days of GSC data**, filter for "impressions >50, clicks = 0, position <15" (CTR problem, prioritize for title/description rewrite).
- [ ] **Filter for "impressions growing, position stagnant"** — often means a competitor updated their page; worth a re-benchmark.
- [ ] **Check for new long-tail queries** showing impressions that weren't part of the original keyword plan — Google has expanded the page's related-query pool on its own; consider adding a section that addresses it directly.
- [ ] **Check whether this page has accumulated enough of its own authority** to start linking out to newer pages, continuing the credit-line effect from page to page.

## My Take

The part of this checklist I'd flag as easiest to skip, and most worth not skipping: Phase 0's internal-link planning. It's tempting to treat it as a minor housekeeping item compared to the keyword research, but per the mechanism in the second article, it's doing two jobs at once — discovery speed on day one, and ongoing re-crawl frequency for every future edit. Skipping it doesn't just delay discovery once; it slows down every iteration cycle after that.

The other thing I'd flag: Phase 4's "don't touch the same section for 2-3 weeks" rule is the one I expect to be hardest to actually follow, because the instinct when a number looks bad is to do *something* immediately. The cost of breaking that rule isn't visible right away — it shows up later as not being able to tell which of several changes actually moved the needle.

## Result

*This checklist is currently running against `split-image` and will be the basis for the next new page I launch. I'll come back and update this section with how it performed in practice — which phases caught real problems and which turned out to be unnecessary overhead.*

## Lessons Learned

1. A checklist without the underlying "why" attached goes stale the first time the situation doesn't match the original example — keep the reasoning next to the task, not in a separate document.
2. Internal-link planning belongs in Phase 0, not as an afterthought — it affects both initial discovery and every future re-crawl.
3. The exploration-period prep (speed, first-screen clarity, presets) matters disproportionately, because it determines whether the rare moments a page is actually visible produce positive or negative signal.
4. Weekly review should flag negative-signal queries (good position, no clicks) and positive-signal queries (poor position, has clicks) separately — they call for opposite responses.
5. Convergence diagnosis isn't the end of the process — a converged-but-mediocre position is a new starting point for diagnosing which underlying input (content, authority, or engagement) needs work next.

---
*Part of the "How Google Actually Tests New Pages" series. Previous: [What Actually Happens When Google Tests a New Page](/posts/how-google-tests-new-pages-explained) · [Back to Part 1: Impressions But Zero Clicks](/posts/gsc-impressions-zero-clicks-diagnosis)*
