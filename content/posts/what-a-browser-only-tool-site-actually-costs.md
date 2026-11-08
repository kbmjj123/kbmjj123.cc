---
title: "What a Browser-Only Tool Site Actually Costs: Cash, Time, and a Bill I Cannot Split"
description: "A line-by-line cost breakdown of a browser-only image tool site: $8.88 domain, $0 hosting, a shared AI bill, and the unpaid time behind it."
date: 2026-11-08
category: "product-business"
readTime: "5mins"
tags:
  - "#bootstrapping"
  - "#cloudflare"
  - "#deployment"
  - "#pricing"
  - "#growth"
image: "/images/product-business/what-a-browser-only-tool-site-actually-costs/two-ledgers.en.png"
draft: false
relatedPosts:
  - "nuxt-cloudflare-zero-cost"
  - "from-zero-to-2-dollar-6-months-tool-site"
  - "from-mvp-to-minimum-viable-resource"
series: null
seriesOrder: null
seo:
  title: "Cost of Running a Browser-Only Tool Site: Domain, Hosting, and AI Coding"
  description: "A real cost breakdown for a browser-only image tool site: $8.88 domain, $0 Cloudflare Pages hosting, a shared AI bill, and the time ledger behind it."
  keywords: []
---

I run a browser-only image tool site alongside a full-time job. The domain cost $8.88 for the first year and renews at $12.80. Hosting on Cloudflare Pages has cost me nothing so far. Those three lines are the entire cash ledger, and the rest of this post is about why they are easy to misread.

The numbers apply to one kind of product: a tool that processes images inside the visitor's browser, with no account system and no server-side work. A product that stores user files or calls a paid API has a different bill. This is one bill for one product shape, not a general price list for building a website.

## The cash ledger, line by line

| Line | What I paid | Status |
| --- | --- | --- |
| Domain | $8.88 first year, $12.80/year renewal | Paid |
| Hosting | Cloudflare Pages free tier | $0 so far |
| Design | AI-generated images, no purchased theme or template | $0 |
| Icons | Open-source icon library | $0 |
| AI coding tools | Under 100 RMB/month previously; current tool effectively free | Shared across sites |
| Image processing backend | None; files stay in the browser | $0 |

I have never bought a theme, a template, or a stock asset for this site. The images came out of an AI image tool, and the icons are from an open-source set. That is the whole list of cash items I can point to.

## Why the hosting line stays at zero

The site is Vue and Nuxt on Cloudflare Pages. A visitor picks a file, the browser does the work, and the original image never reaches a server I pay for. That removes two line items at once: compute for processing and storage for uploads. I wrote about [the deployment setup behind that zero-cost stack](/nuxt-cloudflare-zero-cost) earlier, including the constraints it creates.

The constraint matters more than the saving. I cannot add features that need a server without reopening the bill. Batch jobs that survive a page reload, saved projects, anything with an account — each one brings back a cost I do not currently have. Choosing browser-only processing was a product decision that happened to remove a cost line.

## The AI bill I refuse to split

Earlier AI coding tools cost me under 100 RMB a month. I run several sites, and that bill covered all of them at once. I never kept a per-site breakdown, so I cannot tell you what share belongs to this tool site. The tool I use now is effectively free, which makes the line smaller without filling in the old records.

I could divide the old total by the number of sites and print a clean per-site figure. I would be inventing precision out of nothing, so the cost stays as a shared line. That is why I do not summarize this as "the site cost one domain." The AI tools did get paid for; I just cannot assign the amount to one project.

## The time ledger

Buying a domain takes a few minutes. Pages do not appear on their own. Layout decisions, feature changes, content, and promotion all came out of evenings after work, and none of them show up in a payment record. I already knew Vue, Nuxt, and Cloudflare before I started, so the learning cost was close to zero for me. Someone starting from scratch pays that part in months.

Earlier on this same site I shipped a batch of thin, AI-written pages and got an AdSense rejection for it. Rewriting those pages took time I had not budgeted. It has nothing to do with hosting, which is exactly why it belongs in a cost account.

I still do promotion every week. I change landing pages, build links, watch rankings, and answer questions where people ask them. A zero hosting bill does not mean the site runs itself. The revenue numbers below came from that ongoing work, not from the site sitting there.

## What the traffic numbers do and don't prove

In one earlier 28-day snapshot, Google Search Console showed about 35,600 clicks and Bing Webmaster Tools about 39,300. AdSense had accumulated a little over $860 at that point. Those are aggregate figures from that window, not a current daily rate. I have written about [the six months it took to reach $2 a day](/from-zero-to-2-dollar-6-months-tool-site) on the same project, and the shape was slow and uneven.

Since late October, Google's aggregate clicks have dropped sharply. I have been calling it a halving, and I do not have a verified explanation for it. [A previous search update also took positions from me](/from-mvp-to-minimum-viable-resource), so I am wary of drawing a straight line between one update and a number I have watched for only a few weeks. The snapshot above is old data, and I would not budget against it.

## What I am changing, and what I have not verified

I am adding a set of ID-photo specification tables and upload-limit parameters, so the site does more than display information. That work is in progress. I have no results from it yet, and I am not going to present a plan as an outcome. The hours it takes will land in the time ledger, which is the one I cannot price.

## Two ledgers, one budget

For a browser-only side project, I would keep two separate lists. The first records cash: domain, hosting, paid tools, APIs, and any subscription shared across projects. Shared costs stay on their own line, with no forced per-site split. The second records time: build, maintenance, content, promotion, and learning if the stack is new to you.

![Cash ledger and time ledger for a browser-only tool site](/images/product-business/what-a-browser-only-tool-site-actually-costs/two-ledgers.en.png)

If the product needs accounts, cloud storage, or server-side compute, the first list grows new lines. If you are learning the stack, the second list dominates. Neither list converts cleanly into the other, which is why adding them into one total never helped me decide anything.

The cash side of this site is small enough to fit on one line. I still do not have a number for the evenings the next round of content will take, and that is the figure I would actually want before starting another one.
