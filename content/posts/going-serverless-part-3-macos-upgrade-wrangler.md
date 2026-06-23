---
title: "Two Days, One Broken Monitor, and a Forced macOS Upgrade Just to Run Wrangler"
description: "Wrangler required macOS 14+. My 2015 Mac had been abandoned by Apple. Here's the two-day detour I didn't plan for just to start developing on Cloudflare."
date: 2026-06-23
category: "startup-diary"
readTime: "4mins"
tags:
  - "#cloudflare"
  - "#bootstrapping"
  - "#productivity"
image: "https://assets.kbmjj123.cc/blog/startup-diary/going-serverless-part-3/cover.png"
draft: false
series: "going-serverless"
seriesOrder: 3
seo:
  title: "Forced macOS Upgrade on Old Mac Just to Run Wrangler"
  description: "What happened when an old, Apple-abandoned Mac couldn't meet Wrangler's macOS version requirement, and the two days it took to get back to development."
  keywords:
    - "wrangler macos version requirement"
    - "old mac unsupported macos upgrade"
    - "cloudflare wrangler system requirements"
---

## TL;DR

Wrangler requires macOS 14 or newer. My Mac is from 2015, and Apple stopped supporting it years ago. Getting from "can't run Wrangler" to "actually developing on Cloudflare" cost me a paid forced upgrade, a broken external monitor, and two full days I hadn't budgeted for.

## Background

This Mac has been with me a long time. As an indie developer, replacing working hardware just because it's old has never been an easy call to justify — it still did everything I needed, right up until it didn't.

## The Wall

I went to set up Wrangler to start developing against Cloudflare, and hit a hard requirement: macOS 14 or later. My machine was nowhere close, and worse, it was old enough that Apple no longer offered an official upgrade path for it at all. Not "you're a few versions behind" — genuinely abandoned by the manufacturer.

This wasn't a workaround-able version mismatch. Without a way to get to macOS 14+, Wrangler simply wasn't going to run, which meant the entire Cloudflare development and deployment workflow I'd just decided on in Part 1 of this series was blocked before it started.

## The Decision

Buying a new machine wasn't something I was willing to do just to satisfy a CLI tool's system requirement. Instead, I found a paid service that performs forced macOS upgrades on hardware Apple has officially dropped support for. It's not something I'd recommend lightly or without doing your own research into the specific service — but for my situation, it was the faster and cheaper path back to a working setup compared to buying new hardware.

## The Aftermath

The upgrade itself went through. What came after it didn't: my external monitor stopped working correctly. Not a Wrangler problem, not a Cloudflare problem — a side effect of forcing an unsupported OS jump onto older hardware, the kind of thing that doesn't show up until you're already past the point of easily reversing course.

So now I had a second, unrelated problem to solve before I could get back to actually building anything.

## The Cost

Between sorting out the forced upgrade and then troubleshooting the monitor issue it introduced, the whole detour took two full days. Two days where the actual goal — start developing with Wrangler — was on hold while I dealt with problems that had nothing to do with my product, my code, or even Cloudflare itself.

## My Take

This is the part of "switching to a simpler stack" that doesn't show up in any comparison table. The learning curve of D1, Workers, KV, and R2 was something I'd already accounted for going into this. A tooling requirement quietly deciding my hardware was too old, and the side effects of fixing that, was not.

I don't think this changes the decision from Part 1 — I'd still pick Cloudflare over running my own server. But I'd be giving a dishonest account of "going serverless" if I left out that the actual first cost of this transition wasn't a config file or a billing surprise, it was two days lost to a problem that had nothing to do with the architecture I was trying to adopt. Indie developers running older hardware should budget for this kind of friction explicitly, not assume the only costs are the ones in the docs.

## Lessons Learned

- Check a tool's system requirements against your actual hardware before committing to a stack, not after you're blocked.
- "Apple has dropped support for this machine" and "this machine can be upgraded anyway" are two different facts — confirm which one applies to you before assuming either.
- Forced/unofficial OS upgrades can introduce side effects (in my case, an external monitor failure) that cost as much time as the original blocker.
- Budget hardware friction as a real cost of any tooling decision, especially if you're running older machines as an indie developer.
- Sometimes the right call is still the same call — this didn't make me regret choosing Cloudflare, it just made the actual price tag clearer.

---
*Part of the "Going Serverless" series. Previous: [Why GitHub OAuth Login Failed Locally (And How I Faked My Way Around It)](/going-serverless-part-2-github-oauth-local-callback)*
