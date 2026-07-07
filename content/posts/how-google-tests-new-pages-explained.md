---
title: "What Actually Happens When Google Tests a New Page"
description: "A mechanism-level walkthrough of the seven stages a new page goes through after launch — discovery, crawling, indexing, the per-query testing loop, signal collection, and convergence — using real GSC data from a page stuck between position 1 and 90."
date: 2026-07-10
category: "dev-practice"
tags:
  - "#growth"
  - "#productivity"
  - "#saas"
  - "#ai"
image: "https://assets.kbmjj123.cc/blog/dev-practice/how-google-tests-new-pages-explained/how-google-tests-new-pages-explained-pipeline-diagram.png"
draft: true
series: "how-google-actually-tests-new-pages"
seriesOrder: 2
seo:
  title: "How Google Tests New Pages: Discovery to Convergence Explained"
  description: "What actually happens between a page going live and its ranking stabilizing — per-query testing, NavBoost-style signals, true vs false convergence, explained with real GSC data."
  keywords:
    - "how google ranks new pages"
    - "google sandbox new page testing"
    - "navboost ranking signal explained"
    - "google search ranking convergence"
---

## TL;DR

A new page does not get "a ranking" once it's indexed — it gets tested, query by query, independently, using real users as the measurement instrument. Understanding that mechanism is what tells you whether to wait, or to fix something, when a page's position is bouncing between 90 and 1.

## Background

This continues directly from [the previous post in this series](#), where `split-image` on bulkpictools.com turned out to have a ranking problem rather than a CTR problem — buried at an average position of 51.37, with most queries sitting past position 60. The obvious next question was: why is it bouncing around like that instead of just sitting at some stable (if low) number? Working through that question with an AI in a long back-and-forth, I kept arriving at wrong mental models first and had to get them corrected — which turned out to be more useful than getting it right on the first try, because the wrong models are the ones most people default to.

## The Problem

My first mental model was a "rollout" framing: a new page gets shown to a small batch of users first — say 100 — and if it performs well, Google opens it up to a bigger batch, 1,000, and so on, until eventually a good page "goes viral." That framing is wrong in a way that matters for what you should actually do while waiting.

The correct framing: Google isn't allocating *users* in batches. It's running an independent experiment **per query**, and within that, often per device and region. For the query "split image online," Google might place the page at position 67 this week, occasionally spike it to position 8 for a handful of impressions to see what happens, and adjust based on what it observes — completely independently of what's happening on "split image into 3" or any other query touching the same page. There's no global "phase" the whole page moves through together.

![Seven-stage pipeline diagram from page discovery through crawling, indexing, exploration testing, signal collection, convergence, and ongoing re-evaluation](https://assets.kbmjj123.cc/blog/dev-practice/how-google-tests-new-pages-explained/how-google-tests-new-pages-explained-pipeline-diagram.svg)

## Investigation

Walking through the seven stages in order, with the mechanism detail that's usually skipped:

**1. Discovery.** Google needs to learn the URL exists, via sitemap, internal links from already-indexed pages, external links, or a manual URL Inspection request in GSC. The manual request is the only lever that compresses this from "days to weeks" down to "hours to a couple of days" — everything else is Googlebot eventually wandering there on its own schedule.

**2. Crawling.** Googlebot fetches the HTML, executes JS, and reads the visible text, alt attributes, and structured data. For a tool page that's heavily JS-rendered with thin surrounding text, this step can come back with an incomplete picture of the page — which is the actual reason a tool page benefits from having explanatory text (a short how-it-works paragraph, an FAQ) rather than relying purely on the interactive widget to communicate what the page is for.

**3. Indexing.** The crawled content gets mapped onto Google's existing semantic model of language — not a literal keyword list, but a learned representation (the kind of thing modern embedding/language models produce) of which concepts, phrases, and queries are "close" to this page's content. This is also the moment a page becomes findable via a `site:` search — but `site:` confirms the page exists in the index, not that it ranks for anything. Those are two separate systems; `site:` bypasses ranking entirely.

**4. Exploration / testing.** This is where the rollout-batch intuition breaks down. For every query Google judges relevant enough to the page (more on what "relevant enough" means below), the page gets inserted into that query's results at a position — usually conservative, occasionally aggressive — and the outcome of real searches against that position becomes data.

**5. Signal collection.** Every time a real search happens and the page is in the visible range, an event gets recorded: impression, click or no-click, and — critically, and not visible in GSC — what happens after the click. Dwell time (how long before the user returns to the search results), pogo-sticking (an immediate return, a strong negative signal), and whether the user re-searches with a more specific query afterward (also negative — it means the page didn't answer the need).

**6. Convergence.** As enough of these events accumulate per query, the volatility in that query's assigned position narrows. This does not mean the position becomes *good* — it means it becomes *stable*, at whatever level the accumulated evidence supports.

**7. Ongoing re-evaluation.** Even a converged position isn't permanent. Competitor pages change, Google's models update, user behavior shifts. "Stable" is a current state, not a finished one.

![Closed-loop diagram showing how a single query's testing cycle works, annotated with real impression and click data from the split-image page on dates 5/26 and 5/29-30](https://assets.kbmjj123.cc/blog/dev-practice/how-google-tests-new-pages-explained/how-google-tests-new-pages-explained-loop-diagram.svg)

### The signal layer in more detail — what's usually called NavBoost

The public-knowledge picture of this (pieced together from Google's own public statements, published patents, and the set of internal system names exposed in the 2024 Google API documentation leak — not an official spec, and I want to be upfront that nobody outside Google can verify the exact mechanics) describes something like a click-and-engagement system, commonly referred to by the leaked internal name **NavBoost**, that sits alongside content-relevance scoring as a mostly-independent input into the final ranking decision.

A few specifics that matter more than the headline "clicks affect ranking":

- **Long clicks vs. short clicks.** A click followed by a return to the results page within a few seconds (pogo-sticking) is treated very differently from a click followed by an extended absence. The first is read as "this result didn't satisfy the query"; the second as "it probably did." Position alone never tells you which one happened — this is exactly the data GSC doesn't expose, which is why a tool like Google Analytics or Clarity is the only way to see it from your side.
- **Skipped-click signal.** If a user scrolls past several higher-ranked results and clicks something lower down, that's read as unusually strong positive evidence — because the user had better-ranked alternatives directly available and chose this one anyway. A click on the position-1 result, by contrast, carries less information, because position-1 gets clicked disproportionately regardless of quality (this is sometimes called position bias, and it's why raw click counts by position aren't directly comparable). In the `split-image` data, the two clicks on 5/29 and 5/30 at position ~22-23 are a better positive signal than a hypothetical click at position 1 would have been.
- **Independence from content relevance.** Content relevance (does the page's text actually match the query semantically) and engagement signal (do real users behave as if it satisfied them) are computed and weighted as separate inputs, then combined. A page can score well on one and poorly on the other — high relevance, poor engagement looks like "ranks reasonably but users bounce"; low relevance, good engagement on the rare query that does match looks like the opposite.

### True convergence vs. false convergence

This is the part most explanations skip, and it's the most actionable piece of this whole article.

It's tempting to look at a position chart and call it "converged" the moment it looks flat for a week or two. That's often a false read. With a small sample (10-20 impressions over weeks), a flat-looking week can simply mean the page wasn't aggressively tested during that window — not that the model has formed a stable judgment. The position can still jump 60 places the next time it gets probed.

The actual signal to look for is **whether the volatility itself is shrinking over time**, not whether the position is currently flat. If three months ago a query's position swung ±40 and now it swings ±20, that's real convergence in progress, even if the current number doesn't look impressive yet. If the swing has been the same size for three months with no narrowing trend, that's a sign the sample is accumulating too slowly to converge at all — which points back to needing a wider, intent-consistent set of related queries (covered in the project background's research step) so more independent loops are running in parallel.

And convergence, once it happens, doesn't guarantee a *good* final position — it just means the volatility stops. Where it settles is a separate function of content relevance and domain/page authority, which is the next piece.

### Old-page authority as a credit line for new pages

"Domain authority" isn't a single score Google publishes — it's a convenient shorthand for a bundle of accumulated signals: how many of the domain's pages are indexed and how they've performed historically, how much external linking the domain has earned, how long the domain has existed. It operates on two parallel tracks that don't fully merge:

- **Domain-level signal**: accumulated from every page on the site, persists as a kind of baseline trust that a brand-new page on that domain inherits automatically, the moment it's indexed, before it has any data of its own.
- **Page-level signal**: starts at zero for a new page and is built up entirely from its own accumulated engagement data via the loop above.

The practical effect: a high-authority domain's new page tends to get a more generous starting test position (instead of starting around position 80-100, it might start around 20-30) and more tolerance for an early bad result before being pushed back down — because the domain-level trust acts as a buffer. A low-authority domain's new page starts lower and gets judged more harshly on each individual test, because there's no buffer to absorb a noisy early data point.

This is the actual mechanism behind advice like "build up your existing pages before publishing a lot of new ones" — it's not a vague heuristic, it's that every well-performing existing page is incrementally raising the domain-level credit line that every future new page will start from.

## Solution

None of this is something you can shortcut by spending more money or moving faster — the sample has to accumulate in real time, against real searches, which has a floor determined by how often that exact query is searched at all. What you can control is the quality of every sample you do get:

- Make sure the page is fast and the core function is obvious within the first few seconds, specifically because the moments that matter most are the rare aggressive-probe windows where a real user actually sees the page — and a bad first impression in one of those windows produces a negative sample that takes a long time to outweigh.
- Treat the queries that show up in a probe spike (the 5/26 and 6/2 events in `split-image`'s data) as a short list of priorities, since they tell you specifically which query Google is currently testing the page against, which is more actionable than guessing from the full query list.
- Avoid frequent unrelated changes while a query is mid-convergence — if you change the title, the layout, and the content all in the same week, you lose the ability to attribute the next round of data to any one of those changes.

## My Take

The "100 users → 1,000 users" framing I started with wasn't a small error — it actively pointed toward the wrong expectation, specifically the idea that there's some threshold moment where a page "breaks out." For a utility tool page like this one, that breakout moment mostly doesn't exist; the realistic growth curve is dozens of long-tail queries each independently and slowly converging, adding up gradually, not one event.

The piece I find most useful going forward is the volatility-narrowing check for distinguishing real convergence from a quiet week. It's the only thing in this whole mechanism I can actually verify with data I already have in GSC (position history over time, split per query) without needing GA or any other tool — and it directly tells me whether "do nothing and wait" is currently the right call, or whether the sample just isn't accumulating fast enough and something upstream (query breadth, content depth) needs attention instead.

## A note on what's not verified

Worth being explicit about the limits here: the NavBoost name and the general shape of a click/engagement signal layer come from the 2024 leak and Google's own public statements about using user interaction data, but the precise weighting, thresholds, and what counts as a "long click" in seconds are not public. The convergence-volatility check (watching whether swings narrow over time) is a heuristic I'm using based on how the system is described to behave, not a documented threshold from Google — there's no published number for "how many impressions counts as converged," and it likely varies by query competitiveness. Treat this as the best available reconstruction from public information, not a specification.

## Result

*`split-image`'s query-level position history will be the test of this framework — I'll come back and update this section once enough time has passed to see whether the volatility on its main queries is actually narrowing.*

## Lessons Learned

1. New-page ranking volatility is normal and is not evidence of a content mistake — it's the visible symptom of per-query sampling still being in progress.
2. Testing runs independently per query (and per device/region), not per page — one query converging tells you nothing definite about another.
3. Don't judge convergence by whether the position looks flat this week; judge it by whether the swing range has been shrinking over a multi-month window.
4. A click at a buried position is stronger evidence than a click at position 1, because the user had to actively choose past better-ranked alternatives.
5. Domain authority sets the starting line and the tolerance for early noise — it doesn't determine where a page eventually settles. That's earned per-page, per-query.

---
*Part of the "How Google Actually Tests New Pages" series. Previous: [Why Your New Page Gets Impressions But Zero Clicks](#) · Next: [My SEO Checklist for Every New Page](#)*
