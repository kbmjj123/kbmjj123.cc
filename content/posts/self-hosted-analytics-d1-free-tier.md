---
title: "I Built My Own Analytics for a Browser-Only Tool. Two Days Later I Hit the Free Tier Wall."
description: "A client-side image tool processes files in the browser, so I could not see how people used it. Building my own analytics on Cloudflare D1 fixed that — and exposed a ceiling I did not expect."
date: 2026-10-26
category: "dev-practice"
readTime: "8mins"
tags:
  - "#cloudflare"
  - "#d1"
  - "#indie-dev"
  - "#analytics"
image: "/images/dev-practice/self-hosted-analytics-d1-free-tier/writes-before-after.en.png"
draft: true
relatedPosts:
  - "nuxt-cloudflare-zero-cost"
  - "self-hosting-umami-part-1"
series: null
seriesOrder: null
seo:
  title: "Self-Hosted Analytics on Cloudflare D1: What the Free Tier Actually Costs"
  description: "What happened when I built my own analytics for a browser-only tool: the write volume spike, the narrowing that fixed it, and why 30% of a daily free-tier quota was still too much."
  keywords:
---

Short answer: self-hosting analytics for a browser-only tool is very doable, and the free tier is enough to build it. It is not enough to run it for long, and narrowing your payload is not the fix you think it is.

Here is what happened over two days.

## The problem: I could not see anything

The tool I run processes images entirely in the browser. Files never leave the user's machine, which is the whole point of it — that is the promise on the landing page.

That promise has a side effect I did not plan for. If nothing is uploaded, I learn nothing. I cannot tell which tool people open, whether the conversion finishes, or how many give up halfway. Every product decision I made was a guess dressed up as an intuition.

So I needed usage data. And that is where the privacy promise came back around.

## Why I did not just add a third-party script

The usual move is to drop in an analytics service. I have done it on other projects without thinking twice.

This time it did not sit right. The product claims files stay on your device. Shipping a third-party script into a page that makes that claim means asking users to trust a company I have not vetted, on the strength of a promise I made. If I could not explain what the script collects, I had no business adding it.

That is a position, not a technical preference. It did narrow the options: build it myself, or stay blind.

Worth separating this from [self-hosting Umami](/self-hosting-umami-part-1), which I did earlier. That was about page views — which pages get traffic. This is about product events — whether the job someone came to do actually finished.

## One row per job, and nothing else

The shape is as plain as it gets. The browser sends a small event when a job reaches a terminal state. A server route writes one row into a Cloudflare D1 table. Nothing else.

This is the first piece of backend this product has had. I wrote earlier about [running it as a zero-cost static stack](/nuxt-cloudflare-zero-cost) and why I had skipped Workers and D1 — the rule I was using was "add backend infrastructure when the product logic demands it." Wanting to know whether the tool works is product logic demanding it.

The first version was more ambitious than that. It logged several steps along the way — job started, processing, finished — which felt like the right level of detail for debugging.

Then I looked at the first day of write volume.

## Day one: the spike arrived before the week was out

Writes jumped immediately. Not gradually, not at the end of the month — within the first day it was obvious that this design would not hold.

The cause was not subtle. I was writing one row per step per job. A single user converting a batch of files could produce several rows before anything useful had happened. Multiply that by real traffic and the row count climbs much faster than the number of people using the thing.

![Cloudflare D1 dashboard: rows written over the first week. A sharp spike on day one, then a cliff once the event schema was narrowed to one row per job.](d1-rows-written-spike.en.png)
<!-- screenshot: d1-rows-written-spike.en.png — 待补，见 screenshots.md。发布前删本行 -->

## The fix that worked: fewer events, not smaller events

The second version logs exactly one thing: did the job succeed or fail.

That is it. No intermediate steps, no per-stage records. One job, one row.

Write volume dropped sharply — the spike was gone the same day.

This is the part worth taking with you, and it is the part I would have gotten wrong if I had reasoned about it instead of measuring it.

**Cloudflare D1 bills by row, not by size.** The docs are explicit about it: a 1 KB row and a 100 KB row each count as one row written. Trimming fields, shortening strings, compressing payloads — none of that reduces what you are charged for. Only writing fewer rows does.

![The Cloudflare D1 limits page: 100,000 rows written per day on the Workers Free plan.](d1-pricing-rows-written.en.png)
<!-- screenshot: d1-pricing-rows-written.en.png — 待补，见 screenshots.md。发布前删本行 -->

So if you are designing an event pipeline on D1, the lever is event *count*. Decide how many rows one user action is allowed to produce, and design backwards from there. I spent my first day optimizing the wrong dimension.

## What one batch of files costs in rows

The arithmetic is what made it obvious. Say someone converts 20 files in one go.

The first design wrote a row at every state change — started, processing, done — so that single batch produced 60 rows. Twenty files, three rows each. The version running now writes one row, when the batch finishes.

Same person, same action, same information about whether it worked. Sixty rows versus one.

That ratio is why the spike arrived on day one instead of at the end of the month. Row count was never tracking people. It was tracking steps, and steps multiply.

## The part that did not go away

After narrowing to a single success/failure event, writes settled at roughly 30% of the daily free-tier allowance.

![D1 rows written after narrowing, recent window only. Writes settle at roughly a third of the daily free-tier allowance.](d1-rows-written-steady.en.png)
<!-- screenshot: d1-rows-written-steady.en.png — 待补，见 screenshots.md。发布前删本行 -->

For context, the Workers Free plan includes 100,000 rows written per day on D1. So those two remaining states — success and failure — were costing something in the neighbourhood of 30,000 rows a day.

I have hit a free analytics ceiling before. That one was [Umami Cloud's event limit](/self-hosting-umami-part-1), and self-hosting was the fix. This ceiling is the awkward one: it is the self-hosted version that has the limit.

Thirty percent is survivable. It is not comfortable. It means one traffic spike, one new event type, or one second product on the same account, and the margin is gone. When you hit the daily cap, D1 starts returning errors, which is a bad way to find out your analytics is your load-bearing dependency.

The honest conclusion is not "the free tier is generous" and not "the free tier is useless." It is this: **the free tier is for building, and self-hosting is a real line item once you run it.** The "zero cost, runs forever" version of this story exists because most people writing it have not run the thing long enough to see the number.

## Questions I had to look up myself

**Does D1 charge by row size?**
No. Cloudflare D1 bills by rows written, and row size does not change the count. A 1 KB row and a 100 KB row each count as one row written.

**What happens when you hit the daily cap?**
D1 starts returning errors. It does not degrade quietly and it does not drop writes silently — the queries fail, which for an analytics pipeline means losing data rather than logging a warning.

**Can I batch the writes instead?**
No. Batching reduces the number of requests, not the number of rows. Every row in a batch still counts as one row written.

**Is the Workers Free tier enough to run this for real?**
It is enough to build and validate, not enough to depend on. At roughly a third of the daily allowance with a single event type, one traffic spike or one extra event type removes the margin entirely.

## What I would do differently

- **Decide the row budget before writing the schema.** One user action, one row. If a design needs more, it needs a reason.
- **Narrow first, expand later.** It is easy to add an event once you know it is affordable. It is harder to remove one after it has burned your quota.
- **Treat the free tier as a prototype budget.** If the data matters to your product, plan for the paid plan from the start, not as a rescue.
- **Remember what you are billed for.** Rows, not bytes. This one changes the design.

## Where this leaves the tool

I still cannot see everything. One row per job tells me whether the tool works, not which step confuses people. Getting finer detail back means paying for it, and I have not decided that it is worth the money yet.

That is a product decision, and it is the one I am still sitting on.

If you are running something similar on Cloudflare D1, the number worth checking is not your storage. It is how many rows one user action costs you. Mine is one row per completed job, at roughly 30,000 rows a day. I would be curious what other people are getting.
