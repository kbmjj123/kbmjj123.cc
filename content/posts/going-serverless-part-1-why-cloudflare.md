---
title: "Why I Bet My Indie Project on Cloudflare Instead of a Server"
description: "An indie developer's honest case for choosing Cloudflare's D1, Workers, KV, and R2 over a traditional server — and what it's actually costing me so far."
date: 2026-06-23
category: "tools-workflow"
readTime: "6mins"
tags:
  - "#cloudflare"
  - "#bootstrapping"
  - "#mvp"
  - "#deployment"
image: "https://assets.kbmjj123.cc/images/going-serverless/part-1-why-cloudflare/going-serverless-part-1-stack-diagram.svg"
draft: false
series: "going-serverless"
seriesOrder: 1
seo:
  title: "Why I Chose Cloudflare Over a Server as an Indie Developer"
  description: "A solo developer's real reasoning for picking Cloudflare D1, Workers, KV, and R2 instead of running a server, including the trade-offs being accepted along the way."
  keywords:
    - "cloudflare indie developer"
    - "why choose cloudflare over server"
    - "cloudflare workers d1 r2 kv solo developer"
---

## TL;DR

No server. No on-call rotation. No "what if the disk fills up at 3am." I run every one of my indie projects on Cloudflare — D1, Workers, KV, and R2 — instead of renting and maintaining a server. This post is about why, and what I'm honestly giving up by doing it.

## I've Run Servers Before — That's Exactly Why I'm Walking Away From Them

This isn't a "I've never touched a server so I'm scared of one" post. I have run servers. Regular maintenance, patching, the occasional 2am restart because something silently died — I've done that work, on real projects, more than once.

That experience is the reason I'm avoiding it now, not the reason I'm avoiding it out of ignorance. Once you've actually been responsible for keeping a box alive — security patches, disk space, log rotation, the slow creep of "temporary" manual fixes that never get cleaned up — you start to see how much of that time has nothing to do with the product you're trying to build. It's upkeep on the thing that runs the product.

As a solo developer, every hour spent on server upkeep is an hour not spent on the actual thing I'm trying to ship. That trade-off used to be invisible to me. After running servers, it isn't anymore.

## Where I'm Coming From

I want to be clear this isn't a "couldn't figure out servers, so I gave up" story. I've built and maintained mid-to-large Vue 2 projects in production. I've also deliberately spent time learning Node.js and TypeScript properly, not just enough to copy-paste a tutorial.

I'm bringing that background up front because the choice to move away from traditional servers wasn't a skill gap — it was a decision made with the skills already in hand, after weighing what the server route actually costs a one-person team.

## My Principle: Ship the Simplest Thing That Works

If I had to summarize my approach to building software as an indie developer in one line, it's this: the simplest thing that satisfies the actual need wins, every time, over the more "complete" or "correct" architecture.

That's not laziness — it's a resource allocation decision. I don't have a platform team, an SRE, or even a co-founder to split infrastructure work with. Every layer of complexity I add to my stack is a layer only I will ever debug, at the time I'm least prepared for it — usually while also trying to ship a feature.

## Why Not a Traditional Server

Once I actually weighed it out, the case against a traditional server came down to a few concrete things, not vague discomfort:

- **Ongoing operational load.** Patching, monitoring, backups — work that exists whether or not I have a single user.
- **Fixed cost regardless of traffic.** A server bills the same on a day with zero visitors as it does on launch day.
- **Scaling is a decision I have to make manually.** If something unexpectedly gets traffic, I'm the one who has to notice and react.

None of these are dealbreakers in isolation. Together, for a solo developer, they add up to a constant low-level tax on attention — and attention is the scarcest resource I have.

## Why Cloudflare, Specifically

Cloudflare wasn't the only "serverless" option I could have picked, but two things made it the obvious one for me:

1. **The free tier is genuinely generous**, not a 30-day trial dressed up as a free tier. It's realistic to run an early-stage indie project on it for a long time without thinking about billing at all.
2. **The pieces are designed to work together.** D1, Workers, KV, and R2 aren't separate vendors I'm stitching together with glue code — they share a platform, a deployment story, and a local development workflow.

For where I am right now — pre-revenue, validating ideas, shipping fast — "doesn't cost me anything to start" and "doesn't require me to integrate five different vendors" mattered more than raw scalability ceiling.

## The Stack, Briefly

I'm not going to go deep into implementation here — that's what the rest of this series is for. At a glance, this is how the pieces map to what I actually need:

![Cloudflare stack overview: a client request hits Workers, which routes to D1 for relational data, KV for fast key-value lookups, and R2 for object storage](/images/going-serverless/part-1-why-cloudflare/going-serverless-part-1-stack-diagram.svg)

- **Workers** — the compute layer, where my application logic runs
- **D1** — relational data, for anything that needs real queries and structure
- **KV** — fast key-value lookups for things that don't need SQL
- **R2** — object storage for images and static assets, referenced directly from my blog and apps

Together, that's enough to cover what most of my early-stage products actually need, without provisioning a database server, a file server, and an app server separately.

## What I'm Trading Away

This is the part most "why I switched to X" posts skip, so I want to be specific instead of vague.

Right now, neither of my two live projects is under real production load. One is a fully client-side, zero-backend tool — it puts essentially no load on Cloudflare at all. The second is still in validation, with low traffic and a small number of pages. And even in that state, with no real users yet, I'm already sitting at roughly **10% of my Workers free-tier usage**.

That number doesn't worry me today. But I'm not going to pretend it's nothing, either. If that second project gets real traffic and more pages — which is the whole point of building it — I expect to cross into paid usage at some point, and probably sooner than I'd assume from the marketing copy around "generous free tiers." I'd rather say that plainly now than discover it the hard way later and write a more frustrated post about it.

## What's Next

This decision didn't come for free, even setting aside future billing. Getting to the point where I could actually use this stack day to day surfaced two very different, very real problems — one with GitHub OAuth failing silently during local development, and one that had nothing to do with code at all: a piece of decade-old hardware that flatly refused to run the tooling I needed. Both are getting their own posts in this series.

## Lessons Learned

- Choosing the "simple" path isn't free — it just moves the cost somewhere else, and it's worth knowing where before you commit.
- Having actually run servers before gave me a real number to compare against — not "servers are annoying" in the abstract, but specific recurring tasks (patching, backups, restarts) I could weigh against Cloudflare's free tier before switching.
- A generous free tier is still a tier — track your usage early, even before you have real traffic, so the eventual transition to paid isn't a surprise.
- Picking a stack where the pieces are designed together (Workers + D1 + KV + R2) removes a category of integration problems before they happen.
- Being honest about what you don't know yet (will this scale? will it stay free?) is more useful to future-you than confidence you haven't earned.

---
*Part of the "Going Serverless" series. Next: [Why GitHub OAuth Login Failed Locally (And How I Faked My Way Around It)](/going-serverless-part-2-github-oauth-local-callback)*