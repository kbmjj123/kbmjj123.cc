---
title: "When Your Free Analytics Hit the Ceiling: Why I Left Umami Cloud"
description: "My Umami Cloud free plan hit 100k events and data collection stopped. Here's what I tried — Cloudflare Web Analytics, why it wasn't enough, and why I ended up self-hosting."
date: 2026-06-30
category: "startup-diary"
readTime: "8mins"
tags:
  - "#saas"
  - "#cloudflare"
  - "#vercel"
  - "#bootstrapping"
  - "#growth"
image: "https://assets.kbmjj123.cc/blog/startup-diary/self-hosting-umami-part-1/part-1-usage-exceeded.png"
draft: false
series: "self-hosting-umami-on-vercel-supabase"
seriesOrder: 1
seo:
  title: "Umami Cloud Free Plan Exceeded — What To Do Next"
  description: "Hit Umami Cloud's 100k event free tier limit? See how one indie dev compared Cloudflare Web Analytics vs self-hosting and what the data gap actually looked like."
  keywords:
    - "umami cloud free plan limit exceeded"
    - "umami cloud alternative self-hosting"
    - "cloudflare web analytics vs umami"
    - "self-host umami vercel supabase"
---

## TL;DR

My Umami Cloud free plan hit the 100k events/month ceiling and data collection silently stopped. I tried Cloudflare Web Analytics as a zero-cost drop-in — it showed 4x the traffic Umami did, which turned out to be mostly bots. That wasn't good enough. So I decided to self-host Umami on Vercel + Supabase. This post is about the decision; the actual deployment nightmare gets its own two posts.

---

## Background

[bulkpictools.com](https://bulkpictools.com) is a side project I've been running for a while — bulk image processing that runs entirely in the browser, no uploads, no server. Traffic had been growing steadily. I was using Umami Cloud on the Hobby free tier because it checked all the boxes: clean UI, privacy-respecting, no cookie banners, and the dashboard gives me exactly the signal I care about — real human visitors, where they came from, what tools they used.

One day in late May I opened the Umami dashboard and it was showing zero visitors for the past few days. Not a dip. Zero.

My first instinct was that the tracking script got blocked or the site had a problem. I opened DevTools, checked the network tab — the `/api/send` request was going out fine, returning 200. The script was loading. Everything looked normal on the client side.

Then I checked the Usage page at `cloud.umami.is/settings/usage`.

---

## The Problem

The Hobby free plan caps out at **100,000 events per month**. I had blown past it.

![Umami Cloud usage dashboard showing monthly event limit exceeded on the free Hobby plan](/images/startup-diary/self-hosting-umami/self-hosting-umami-part-1-usage-exceeded.webp)

What I hadn't realized was that Umami Cloud doesn't warn you when you're approaching the limit. There's no email, no dashboard alert, no degraded-mode banner. Data collection just quietly stops. If I hadn't noticed the zero-visitor streak, I could have gone weeks thinking my traffic had collapsed.

To be clear about the numbers: 100k events/month sounds like a lot, but it isn't just page views. Every custom event — tool usage, button clicks, anything you track — counts toward that ceiling. A site with real engagement burns through it faster than a simple blog.

---

## What I Tried First: Cloudflare Web Analytics

Since bulkpictools.com is already behind Cloudflare, enabling Web Analytics was a one-click affair. No new scripts, no DNS changes — Cloudflare injects the tracker automatically at the edge. I had it running within two minutes.

The numbers looked dramatically different immediately.

Umami had been showing around **1,000 real visitors per day**. Cloudflare was showing **4,000+**.

That 4x difference deserves an explanation, because it's not random noise — it's a fundamental difference in *what these two tools count*:

**Umami counts humans.** It relies on a JavaScript snippet that runs in the browser. If a visitor's ad blocker kills the script, that visit is invisible to Umami. If a bot doesn't execute JavaScript (most don't), it doesn't register. If someone closes the tab before the script loads, nothing is recorded. This means Umami systematically undercounts, but what it *does* count is almost entirely real human traffic.

**Cloudflare counts everything that touches your server.** It operates at the network layer, before JavaScript ever runs. Every request — crawlers, scrapers, health checks, RSS readers, monitoring services, and yes, real visitors — gets tallied. No filtering unless you configure it explicitly.

The 3,000-visit gap between the two was real, but it was mostly machines. That's actually fine — knowing your crawl rate matters for other reasons — but it's not the same signal. When I'm trying to understand whether a new tool page is getting real traction, I need the Umami number, not the Cloudflare one.

There was another issue: Cloudflare Web Analytics only retains data for **30 days**. Umami had been giving me month-over-month trend lines I could use to evaluate whether a content push was working. Losing that history wasn't acceptable.

So Cloudflare as a full replacement was off the table.

---

## The Decision: Self-Host vs Pay

The options, laid out honestly:

**Upgrade Umami Cloud to Pro** ($20/month, 1M events/month, 2-year retention). Cleanest path. Zero configuration, data migrates automatically. But $20/month is $240/year for analytics on a side project that hasn't hit meaningful revenue yet. That's hard to justify on principle alone.

**Switch to a different cloud tool** (Plausible, Fathom, etc.). Similar pricing tier, similar constraints. I'd just be picking a different ceiling.

**Self-host Umami on a VPS**. Full control, no limits, but adds operational overhead — a server to maintain, backups to set up, uptime to care about.

**Self-host on Vercel + Supabase**. Both have free tiers. Vercel handles deployments automatically. Supabase provides the PostgreSQL database. If the free tier holds, the ongoing cost is zero. The risk is operational complexity during setup and potentially hitting *another* free tier limit down the road.

I went with Vercel + Supabase. Not because it was the easiest path — it wasn't, as Parts 2 and 3 of this series will show — but because I wanted to understand the full deployment stack. If I'm going to run analytics infrastructure I depend on, I should understand exactly how it works. And if Supabase's free tier ever becomes a bottleneck, I'll have the knowledge to migrate the database layer without touching the Vercel deployment.

---

## My Take

The thing I keep coming back to is that the free tier ceiling was entirely predictable. 100k events/month isn't a lot for a site with 1,000 active daily users and multiple trackable events per session. I just hadn't done the math when I signed up.

That's a pattern worth naming: **free tiers on cloud analytics tools are sized for side projects that haven't taken off yet**. The moment your project gets real traction, you're in paying-customer territory. There's nothing wrong with that — Umami's pricing is actually reasonable by SaaS standards — but going in with clear expectations would have saved me the surprise.

The other thing worth saying: Cloudflare Web Analytics is genuinely excellent for what it does. If you need a quick pulse on traffic and you're already on Cloudflare, it's the right tool. The 30-day retention is the real constraint. If your workflow is purely "how many people visited this week," Cloudflare is all you need and it will never cost you anything.

For me, the missing piece was longitudinal data — watching a specific URL climb or fall in traffic over two to three months. That's where Umami's data model (which stores every event with full timestamp and metadata) wins.

---

## What's Next

The actual Vercel + Supabase deployment turned out to be considerably more complicated than the tutorials suggest. There are connection string traps, a Prisma migration that silently hangs due to the wrong port, and a 66MB GeoIP database that can silently kill your Vercel build if you don't handle it correctly.

Part 2 covers the connection string issues and why `prisma migrate deploy` kept hanging — specifically the `DATABASE_URL` vs `DIRECT_DATABASE_URL` distinction that the official docs mention but don't fully explain.

---

*Part of the "Self-Hosting Umami on Vercel + Supabase" series. · [Part 2: The Connection String Traps](/self-hosting-umami-part-2) · [Part 3: GeoIP, Migration Bypass, and Git LFS](/self-hosting-umami-part-3)*
