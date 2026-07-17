---
title: "Why Your New Page Gets Impressions But Zero Clicks in Google Search Console"
description: "Two real GSC cases — thousands of impressions with zero clicks vs. a nearly invisible page — show why this is two different problems with opposite fixes."
date: 2026-07-18
category: "dev-practice"
readTime: "6mins"
tags:
  - "#growth"
  - "#productivity"
  - "#saas"
image: "https://assets.kbmjj123.cc/blog/dev-practice/gsc-impressions-zero-clicks-diagnosis/gsc-impressions-zero-clicks-diagnosis-quadrant-diagram.png"
draft: false
series: "how-google-actually-tests-new-pages"
seriesOrder: 1
seo:
  title: "Impressions But No Clicks in GSC? Here's How to Diagnose Why"
  description: "A step-by-step method to tell apart a CTR problem from a ranking problem in Google Search Console, with two real tool-page case studies."
  keywords: []
relatedPosts:
  - "68k-impressions-8-clicks-image-sitemap-blind-spot"
  - "how-google-tests-new-pages-explained"
---

## TL;DR

If a page in Google Search Console shows a lot of impressions and almost no clicks, you're looking at one of two completely different problems, and they need opposite fixes. Pull up the query-level breakdown and check the real position before touching anything — changing the wrong thing wastes an entire observation cycle.

## Background

I run [bulkpictools.com](https://bulkpictools.com), a local-only bulk image tool site (compress, convert, crop, with tool chaining), currently sitting at 44 tool pages. Checking GSC for each page is part of my normal maintenance routine — the same routine that surfaced [68,000 wasted image impressions I didn't know I had](/posts/68k-impressions-8-clicks-image-sitemap-blind-spot) — and two pages surfaced the same surface-level symptom within the same week: a healthy-looking impression count, and almost nobody clicking through.

My first instinct both times was the same — "the title must be bad, let me rewrite it." That instinct was right for one page and completely wrong for the other. Here's how I learned to tell which is which before changing anything.

## The Problem

**Case A — `compress-to-100kb`**: 5,954 impressions over 3 months, 2 clicks, average position 6.1. CTR effectively 0.03%.

**Case B — `split-image`**: 116 impressions over 3 months, 3 clicks, average position 51.37.

Both pages "have impressions and basically no clicks." If you stopped at the top-level GSC summary, they'd look like the same problem. They are not.

![Quadrant diagram comparing CTR problem versus ranking problem using average position and click count from Google Search Console](https://assets.kbmjj123.cc/blog/dev-practice/gsc-impressions-zero-clicks-diagnosis/gsc-impressions-zero-clicks-diagnosis-quadrant-diagram.svg)

The two axes that matter are average position and clicks. Position around 5–6 with zero clicks is a CTR problem: people are seeing your result and choosing not to click it. Position around 50+ with a handful of clicks is a ranking problem: most of your "impressions" never actually appeared in front of a human being who scrolls.

A normal CTR for position 4–5 is roughly 5–7%. 5,954 impressions at that rate should produce 150–250 clicks. Getting 2 is a 99%+ gap from the baseline — that gap is the actual signal, not the raw impression number.

## Investigation

The summary-level average position is the first thing to distrust. It's a blended average across every query variant the page happens to rank for, and that blending can hide the real story.

Step one is opening the page in GSC, switching from the Pages tab to the Queries tab, and looking at the breakdown for that specific URL — not the property-wide average. For `compress-to-100kb`, that breakdown confirmed the position-6 average was real and fairly consistent across its main query variants, not an artifact of one outlier query dragging the average down. That ruled out "false average" and pointed straight at a CTR/title problem.

For `split-image`, the query breakdown told a different story entirely:

| query | impressions | avg. position |
|---|---|---|
| split image online | 18 | 67.28 |
| pinetools split image | 8 | 74.x |
| split photo online | 7 | 78.29 |
| split image into 3 | 5 | 88.2 |

Every query is buried past position 60. There's no scenario where a normal user scrolls that far — these are what I'd call "technical impressions": Google counted the page as having appeared in the result set for that query, but no human ever saw it on a screen they'd realistically reach. A CTR calculation on these numbers is meaningless, because CTR assumes the result was visible to begin with.

This is the core diagnostic question to ask before doing anything else: **is the position number itself low enough that visibility was never realistic, or is the position genuinely good and the click-through rate is the actual gap?** Everything else follows from that answer.

There's a second layer worth checking once you've confirmed a real ranking problem: occasional spikes. In the `split-image` data, two specific days (5/26 and 6/2) showed the page briefly jumping to position 4 and position 1 respectively, each with a small number of impressions. Those spikes are not noise to ignore — they're the most information-dense data points you have, because they're the rare moments the page was actually visible. Filtering the query/date breakdown down to those specific days and cross-referencing which query triggered the spike tells you exactly which query Google is currently testing the page against — more on why that matters in the next article in this series.

## Solution

The fixes are opposite, which is why getting the diagnosis wrong costs you a full cycle:

**CTR problem (compress-to-100kb)**: the position is already earning the impressions; the title and meta description aren't earning the click. The fix is rewriting those — putting the specific number and use case (e.g. "100KB", or a concrete constraint like a government-form upload limit) earlier in the title, and adding trust signals like "Free" / "Instant" / "No Upload" that differentiate from generic-sounding competing results.

**Ranking problem (split-image)**: there is no title to fix yet, because the title isn't being seen. Rewriting it changes nothing measurable — you'd just be guessing in the dark and burning an observation window. The correct move here is competitive benchmarking (what do pages that already rank well for these queries actually offer) and patience, because a new page at position 50–90 is still in an early evaluation phase, not failing at conversion.

## My Take

The mistake I almost made was reaching for the same fix — "improve the title" — on both pages, because that's the generic SEO advice that applies to low-CTR symptoms in general. It would have done nothing for `split-image`, and worse, it would have burned 2–4 weeks of "did the change work" ambiguity on a page where the title was never the bottleneck.

What actually changed my approach was forcing myself to open the query-level breakdown before deciding on a fix, every time, rather than reacting to the headline impression/click numbers. The headline numbers are designed to be skimmed; the diagnosis requires the breakdown.

## Result

*Both pages are still being monitored. I'll update this section with the before/after title-change data for `compress-to-100kb` once enough of a new observation window has passed, and with `split-image`'s position trend once it has more query volume to evaluate.*

## Lessons Learned

1. "Impressions but no clicks" is not one problem — split it by average position first. Roughly: position under ~10 with near-zero clicks is a CTR problem; position over ~20-30 with near-zero clicks is usually a visibility/ranking problem.
2. Always check the query-level breakdown for the specific page, not the property-wide or page-level average — the average can blend a real ranking and a fake one together.
3. A CTR calculated on a buried position is meaningless. Don't optimize a title for a query nobody can actually see.
4. Occasional position spikes in an otherwise-buried page are your highest-value data points — they tell you which specific query is currently being tested, which is the thing worth preparing for next.
5. The two fixes (title rewrite vs. wait-and-benchmark) are mutually exclusive in the short term. Diagnosing wrong doesn't just fail to help — it costs you an entire observation cycle on the page that actually needed action.

---
*Part of the "How Google Actually Tests New Pages" series. Next: [What Actually Happens When Google Tests a New Page](/posts/how-google-tests-new-pages-explained)*
