---
title: "From Zero to $2/Day: 6 Months of Running a Tool Site as an Indie Developer"
description: "A transparent six-month retrospective on building a tool site with Nuxt + Cloudflare: getting called out for AI garbage, fixing thin content after AdSense rejection, and making $2–$5/day in ad revenue."
date: 2026-07-03
category: "indie-mindset"
readTime: "12mins"
tags:
  - "#indiedeveloper"
  - "#seo"
  - "#sideproject"
  - "#nuxt"
  - "#cloudflare"
image: "/images/indie-mindset/from-zero-to-2-dollar-6-months-tool-site/from-zero-to-2-dollar-6-months-tool-site-cover.webp"
draft: false
relatedPosts:
  - "from-2-45-rpm-to-a-pivot"
series: null
seriesOrder: null
seo:
  title: "6 Months Running a Tool Site: From Zero to $2/Day | Indie Developer Retrospective"
  description: "A frank look at building a Nuxt + Cloudflare tool site: AI content backlash, AdSense rejection and fix, and small but real revenue milestones."
  keywords:
    - "indie developer tool site"
    - "6 months review"
    - "AdSense low value content fix"
    - "Nuxt Cloudflare stack"
    - "side project revenue"
---

## January 1, 2026: A Domain, an Idea, and Zero Expectations

On January 1, 2026, I registered a domain and launched a tool site as an SEO learning project. I didn't expect to make money. I wanted to run through the entire SEO lifecycle — domain, content, links, search console, ads — and actually *know* how each piece worked.

Six months later: 52 tools, 480+ pages, 6 languages, $2–$5/day AdSense revenue, $27 in BuyMeACoffee donations, a few RMB from WeChat, and one rejection from Google followed by approval 24 hours after resubmission. The only cost so far: the domain.

This isn't a success story. It's a record of what happens when you actually finish something and keep adjusting.

---

## Why I Built It

I didn't build this site to make money on day one. I built it to learn—to run through the entire SEO lifecycle from start to finish: domain registration, site setup, content creation, link building, search console integration, and eventually ad monetization. I wanted to *know* how each piece worked, not just read about it.

I picked iLoveIMG as my reference. It's one of the most established players in the tool space—clean UX, massive traffic, clear value prop. Copying a proven model wasn't about lacking creativity; it was about removing variables. If the market already validated the demand, my job was execution, not market validation.

**Tech choice: Nuxt static site + Cloudflare (Pages + R2). Zero infrastructure cost, only the domain.**

Why this stack over a VPS? Because I'm not full-time. Every minute I spend managing servers is a minute I'm not working on the product. Static sites don't need半夜运维, don't crash under traffic spikes, and don't require database backups. Cloudflare's free tier handles everything a small tool site needs.

The principle: **choose the stack that costs the least *non-product* time, not the one that's "best."**

---

## The Beginning — "AI Garbage"

I used AI to generate content. A lot of it. I was honest with myself—I was lazy and wanted to see if AI could carry the content side.

Then I got this email:

![Screenshot of the "AI Slop Factory" email](/images/indie-mindset/from-zero-to-2-dollar-6-months-tool-site/ai-garbage-email.webp)

*[Replace with your actual screenshot — alt text: "Email from a user calling the site AI-generated garbage"]*

The subject line wasn't polite. The content wasn't either. Someone took the time to write and tell me my site was AI-generated garbage.

My first reaction was defensive. Then I asked myself: *is he wrong?*

I went back and looked at my own pages: templated structure, repetitive phrasing, no screenshots, no real usage notes, no "I used this and here's what happened" details. AI can draft structure, but it can't add *specificity* —the stuff that comes from actually using the tool and noticing where users get stuck.

That email changed how I approached content. From then on, every page got:

- Real screenshots from actual usage
- A "things I ran into" section
- Specific use-case descriptions (not generic "this tool is useful")

AI is a drafting tool. Content value comes from what *you* add on top of it.

---

## SEO as the Real Work

By March, I had traffic. Not much—but enough to know Google was paying attention.

I don't have a magical SEO formula. What I learned was simple: **if you make pages that actually help someone complete a task, search engines eventually notice.** I focused on:

- Keyword research (what are people actually typing?)
- Internal linking structure
- Page-level content depth
- A few external backlinks (I reached out to relevant directories)

What clicked for me was reframing SEO: it's not about tricking Google. It's about making your content so useful that Google *wants* to show it.

---

## The Workflow Upgrade — Bulk Image Toolchain

The turning point was building a complete image processing workflow: **local compression, conversion, cropping, and resizing—all in one place.** Instead of having a collection of disconnected tools, users could move through a logical flow: upload → process → download.

This changed the site from a random set of pages into a coherent *user path*. People weren't just visiting one tool page and leaving; they started moving between tools.

---

## AdSense Rejection — And How I Found the Root Cause

In May, I applied for AdSense. It came back as "low-value content."

![AdSense rejection email screenshot](/images/indie-mindset/from-zero-to-2-dollar-6-months-tool-site/adsense-rejection.webp)

*[Replace with your actual screenshot — alt text: "AdSense low-value content rejection email"]*

I didn't panic. I started investigating:

1. I read through forums for similar rejection reasons. Most advice said "add more words" — but that felt like cargo culting.
2. I manually compared different language versions of the same tool page. English pages had full descriptions, screenshots, usage notes. Spanish and French versions (added recently) had only the title and a one-line description—empty.

That was it. The problem wasn't "too little content." The problem was **inconsistent content quality across languages.** I'd added multi-language support without actually translating the *value*—just the titles and structure. The new language pages were thin, and AdSense flagged the entire site as low-value.

I spent two weeks filling in every language version with real content. No automation, just manual editing and translation for each tool page.

One month later, I resubmitted. 24 hours later: approved.

---

## Revenue — Small, but Real

After AdSense approval, the numbers started coming in:

- **BuyMeACoffee: $27** from an overseas user
- **WeChat: a few RMB** from domestic users
- **AdSense: from $2/day to $5/day** within the first two weeks (I later broke down what those RPM numbers actually mean [in a separate analysis](/from-2-45-rpm-to-a-pivot)).

These amounts mean nothing to a full-time founder. But for a side project built in spare hours, they mean something different: **validation.** Someone found this useful enough to pay. Someone clicked an ad. Advertisers value the traffic. All three signals point in the same direction—the site is solving a real need, even if it's small.

![earn from Buy me a coffee](/images/indie-mindset/from-zero-to-2-dollar-6-months-tool-site/buymeacoffee-earn.webp)

---

## The Morning of July 1

On June 27, Google Search Console reported 305 clicks. On June 30: 623 clicks. A 2x increase in three days.

![GSC clicks chart June 27–30, 2026](/images/indie-mindset/from-zero-to-2-dollar-6-months-tool-site/gsc-clicks-june-2026.webp)

*[Replace with your actual screenshot — alt text: "Google Search Console clicks: 305 on June 27, 623 on June 30"]*

I woke up on July 1—exactly six months after launch—to that number. It's not a million. But it's a sign that the work is compounding. That was the moment I felt like maybe, just maybe, I'd built something that wasn't going to fade away.

---

## What I Actually Learned

**On tech selection:** The best stack is the one that frees your brain. Nuxt + Cloudflare isn't the fastest or the most flexible — but it lets me *forget about infrastructure*. Static sites mean no servers to patch, no database to migrate, no "why is this down at 2 AM." It's boring. That's exactly what I need.

**On copying:** The first priority isn't innovation. It's *finishing a complete cycle*. Copying a proven market removes the hardest variable — demand validation — so you can focus on execution.

**On AI and content:** The "AI garbage" email was uncomfortable but necessary. AI writes the first draft; *you* make it useful. Getting called out early saved me from building a bigger problem later.

**On multi-language:** Thin translations drag your whole site down. If you add languages, actually fill them.

**The core principle:** *Make the user feel like they gained something.* On every page, ask: "What did the user get from this that they didn't have before?" If you can't answer, rewrite it until you can.

---

## Where the site stands six months in
Six months in, the site earns enough to cover the domain and not much more. That's fine — this was a learning project, and the learning has been worth more than the revenue.

The next six months: fill out the thin language versions, test whether the tool-chain upgrade moves the numbers, and write about what happens when a side project stops being a side project. I don't know if the revenue curve bends. I know the adjustment loop works.

---

## Frequently asked questions

**Can a site with AI-generated content get AdSense approval?**
Not as generated, in my experience. The first application was rejected as low-value content. Approval came after the pages were rewritten so each tool actually did something, rather than describing something.

**How long does it take a tool site to get traffic?**
Google started paying attention around the third month here. That is a rough number for one site, not a promise — the useful signal is that it was months, not weeks.

**Why was AdSense rejected the first time?**
Because a large share of the pages were AI-written filler around a thin tool. The fix was making the tool itself the content, not adding more words around it.

**Is $2/day after six months worth it?**
As income, barely. As tuition for learning the whole SEO lifecycle end to end on a real site, it was the point of the project.
