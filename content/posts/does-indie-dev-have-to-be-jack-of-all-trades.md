---
title: "Does an Indie Developer Have to Be a Jack of All Trades?"
description: "AI now handles 85% of my indie dev workload. The real skill isn't mastering everything—it's knowing what to delegate and what to eliminate."
date: 2026-07-16
category: "indie-mindset"
readTime: "15mins"
tags:
  - "#ai"
  - "#cloudflare"
  - "#bootstrapping"
  - "#motivation"
image: "/images/indie-mindset/does-indie-dev-have-to-be-jack-of-all-trades/jack-of-all-trades-ai-workflow-diagram.webp"
draft: false
relatedPosts:
  - "claude-deepseek-workflow"
series: null
seriesOrder: null
seo:
  title: "AI Handles 85% of My Indie Dev Work—Here's What's Left for Me"
  description: "From Nest.js to Cloudflare Workers, from doing everything to reviewing everything: how AI rewired my entire workflow as a solo developer."
  keywords:
    - "indie developer AI workflow"
    - "solo developer AI assistant"
    - "Cloudflare Workers zero server cost"
    - "indie hacker tool stack 2026"
---

## TL;DR

Six months ago I shipped [BulkPicTools](https://bulkpictools.com) from zero to production. Today it makes $5/day through Google Ads—not life-changing, but it proved the model works. The real story isn't the money. It's how AI rewired my entire workflow so that I, a single developer with no design or marketing background, could ship a product that actually earns. I didn't become a jack of all trades. I became an editor.

## Background

I spent years working on company projects. The playbook was simple: get a ticket, write code, pass QA, deploy, move on. Someone else owned the design. Someone else worried about SEO. Someone else handled user feedback. My job stopped at the edge of the codebase.

When I decided to build something on my own, the wall hit immediately. The work didn't end when the code compiled. It barely started.

I looked at the checklist for shipping a real product and felt the weight of it: design the UI, write the copy, build the landing page, implement the core logic, test across browsers, set up analytics, learn SEO, write content, monitor performance, respond to user emails, iterate on feedback—and do all of it while keeping the thing running without a $50/month server bill eating into margins that didn't exist yet.

A few year earlier I would have looked at that list and concluded: I need to learn Figma, get decent at copywriting, study SEO fundamentals, understand AdSense optimization—become a designer, a marketer, and a DevOps engineer on top of being a developer.

That version of indie dev sounds exhausting. It also sounds necessary. Every "how to succeed as a solo founder" post tells you the same thing: you have to wear all the hats.

Here's the part they don't tell you: that advice was written before AI could do 85% of the wearing for you.

## What "Everything" Actually Looks Like

Let me get specific. Here's a partial list of what shipped with BulkPicTools:

- A Vue 3 + Nuxt 4 frontend with TailwindCSS styling
- A Cloudflare Worker handling the image processing pipeline
- A full landing page with SEO-optimized copy, structured data, and Open Graph tags
- A blog section for long-tail SEO content
- Google AdSense integration and ad placement optimization
- Analytics setup with event tracking for feature usage
- A contact/support flow that actually reaches me
- Ongoing content: blog posts, keyword research, performance monitoring

Not one of these items is "just coding." The code for the image processing took maybe 30% of total effort. The rest was design decisions, copy iterations, SEO debugging, ad placement testing, and the endless loop of deploying, checking analytics, adjusting, and redeploying.

In 2023, that workload would have meant learning design tools, spending nights on copywriting, and either burning out or shipping something half-baked. In 2026, AI eats most of it.

## Where AI Fits In: 85% Done, I Review

Here's the breakdown of what AI handles versus what I still do, domain by domain.

### UI and Visual Design

I don't use Figma. I describe the layout I want in plain language—"a two-column tool layout with the upload area on the left taking 60% width, a settings panel on the right, and a sticky action bar at the bottom that appears once files are selected." AI generates the Tailwind markup. I review it, tweak spacing and responsive breakpoints, and ship it.

The days spent pixel-pushing in design tools? Gone. I'm not a designer now. I'm someone who knows what good enough looks like and can describe it clearly.

### Copy and Content

Every landing page heading, every feature description, every blog post outline—AI writes the first draft. I don't publish it raw. I read it, strip out the filler words, inject specifics that only I know (like the actual error messages users reported or the real numbers from my analytics), and reshape the tone until it sounds like me, not a model.

This is the editing role I keep coming back to. AI generates 500 words. I keep 300, rewrite 100, and cut the rest. The output is mine because the judgment is mine.

### Code

This is where AI's impact is most obvious and most misunderstood. People say "AI writes my code now" like that's the end of the story. The reality is messier.

AI writes the first version fast (I use a split-model workflow for this — [Claude plans, DeepSeek executes](/claude-deepseek-workflow)). For BulkPicTools, it generated the Worker skeleton, the frontend component structure, and the Tailwind layout in a fraction of the time it would have taken me from scratch. But the code it produces is rarely production-ready on its own. It hallucinates API methods. It generates reasonable-looking patterns that hide subtle bugs. It optimizes for the happy path and ignores edge cases.

My job shifted from writing code to auditing it. I read every line. I trace the logic. When something feels off—an endpoint that should handle concurrency but doesn't, a state management pattern that'll break under rapid clicks—I catch it because I've debugged enough production issues to recognize the smell.

This is the bottleneck AI doesn't solve: knowing what you don't know. The model generates what's statistically probable. I veto what's practically dangerous. That's not a passive role. It's just a faster one.

### SEO and Marketing

I didn't know how to structure a sitemap for a Nuxt site six months ago. I didn't know what `ld+json` structured data was. AI taught me both—not through tutorials, but through doing. I'd paste my `nuxt.config.ts`, describe the problem, and get back a solution with enough context to understand why it worked.

Keyword research, meta description templates, content gap analysis—all AI-assisted. The difference is I'm not asking AI "write me an SEO guide." I'm asking "here's my site, here's what's ranking and what's not, suggest 5 keywords I'm missing based on my actual traffic patterns."

That specificity matters. Generic AI advice is generic. Context-specific AI advice—fed your own data and your own constraints—is closer to having a consultant who knows your business.

### The Skill System Underneath All of This

One thing that made the 85% number possible: I stopped prompting from scratch every time. Over months of working with Claude, I've built a collection of custom Skills—reusable instruction sets that encode my preferences, my tech stack choices, and my quality standards.

When I need a blog post outline, I don't describe my writing style from zero. I invoke a Skill that already knows my tone, my typical structure, and the formatting rules for my Nuxt Content setup. When I need to debug a Cloudflare Worker issue, another Skill has my `wrangler.toml` patterns and common pitfalls pre-loaded.

This is the meta-skill I didn't expect to need: the ability to codify my own judgment into reusable prompts. It's not a technical skill. It's a documentation skill. Every time I catch AI making a mistake I've seen before, I update the Skill so it doesn't happen again. Over six months, that compound effect is larger than any single tool I've adopted.

## The Tech Stack Pivot: I Almost Built a Backend I Didn't Need

When I started BulkPicTools, my instinct was to build it the way I'd build a company project: Nuxt frontend, Nest.js backend, MongoDB for persistence, maybe a Redis layer for caching. That's what I knew. That's what felt professional.

I spent two weeks reading Nest.js documentation and sketching API schemas before it hit me: I was about to manage a Node.js server, a MongoDB instance, and all their associated maintenance—updates, backups, security patches, scaling concerns—for an image processing tool that didn't need any of it.

That's the "found a mouse, now I need to build a whole computer" problem. You pick up one technology decision ("I should have a proper backend") and it cascades into infrastructure you never planned for.

I killed the Nest.js plan and moved everything to Cloudflare Workers.

### What Workers Actually Cost Me

Zero dollars for server hosting. The Workers free tier covers 100,000 requests per day. I'm nowhere near that.

The trade-off: Workers run on V8 isolates, not Node.js. Some npm packages don't work. File system access doesn't exist. State is ephemeral. I had to restructure my image processing to work within those constraints—streaming files through the Worker instead of saving them to disk, using R2 for storage instead of a local filesystem.

This sounds like a limitation. It was a gift. Every constraint forced me to ask: do I actually need this complexity, or was I just building it out of habit?

### What I Gave Up and What I Gained

I gave up: MongoDB, a REST API layer, server maintenance, deployment pipelines for backend services, database backup scripts, and the mental overhead of keeping all of it secure and updated.

I gained: a single `wrangler deploy` command that ships everything, zero monthly infrastructure costs, and—most importantly—the ability to not think about infrastructure at all while I focus on the product and the content that brings users to it.

This isn't about Workers being "better" than Nest.js. It's about Workers being invisible in a way Nest.js never would have been. For a solo developer, invisible infrastructure is worth more than perfect infrastructure. Every hour I don't spend on DevOps is an hour I spend on the thing that actually generates revenue: making the product useful and getting people to find it.

## Result: $5/Day, Six Months In

![Google AdSense dashboard showing approximately $5/day revenue over the past 30 days](/images/indie-mindset/does-indie-dev-have-to-be-jack-of-all-trades/jack-of-all-trades-adsense-dashboard.webp)

Six months from zero to $5/day. That's $150/month. Not quitting-my-job money. Not even close.

But here's what that number actually means:

- It's revenue generated entirely by a product I built alone, with no team, no funding, and no infrastructure costs
- It's recurring: users come back because the tool solves a real problem, and ads generate value from that traffic
- It's proof that the model works. The question isn't "can this scale" anymore. The question is "what's the next product that follows the same pattern"

$5/day is a validation milestone, not a destination. The real output of these six months isn't the revenue—it's the repeatable system: AI-assisted development + zero-cost infrastructure + SEO-driven organic traffic. That system works for any lightweight web tool, not just image processing.

## My Take

### The Question "Must Indie Devs Be Jacks of All Trades?" Is Asking the Wrong Thing

The premise assumes indie dev is about acquiring skills. It's not. It's about managing output.

Before AI, managing output meant developing the skills to produce each type of output yourself—design skills, writing skills, marketing skills. That's where the "jack of all trades" pressure came from. You literally couldn't ship a product without some competence in a dozen domains.

AI changes the equation. You don't need competence in design to ship a decent UI. You need the judgment to recognize when AI's output is decent versus broken. You don't need copywriting skills to produce readable landing page text. You need the editorial instinct to spot filler and demand specificity.

The skill tree for indie dev in 2026 is narrower and deeper than it was in 2023. You need deep expertise in one thing—your technical domain—and a sharp enough eye to audit AI output across everything else. That's not being a generalist. That's being a specialist with a very fast assistant.

### Why I Killed Nest.js (And Why That Decision Matters More Than the Tech)

Walking away from a familiar stack isn't easy. Nest.js is well-documented, widely used, and fits the mental model I built over years of backend work. Cloudflare Workers felt foreign—constrained APIs, no Node.js compatibility, a deployment model that doesn't look like anything I used before.

But the real cost of Nest.js wasn't the learning curve. It was the maintenance. Every database connection pool is a thing that can leak. Every server is a thing that needs updating. Every deployment pipeline is a thing that breaks when a dependency changes. For a team of five, those costs are distributed. For a team of one, they're concentrated into the same brain that's trying to write content, analyze traffic, and respond to users.

The decision to go with Workers wasn't a technical decision. It was a cost-of-attention decision. I asked myself: six months from now, which choice leaves me with more mental bandwidth for the things that actually grow the product? Workers won that question decisively.

### The Editing Model: Faster, Not Easier

I want to be precise about the 85% number because it's easy to misinterpret. AI handling 85% of the work doesn't mean I work 85% less. It means my work changed shape.

Before AI: spend 4 hours writing code, 2 hours debugging, 1 hour writing copy. Total: 7 hours, mostly execution.

With AI: spend 30 minutes prompting and reviewing AI-generated code, 2 hours auditing and fixing edge cases, 45 minutes editing AI-generated copy into something that sounds like me. Total: ~3.5 hours. But the 3.5 hours are cognitively denser. I'm making more decisions per minute. I'm holding more of the system in my head simultaneously because I'm reviewing everything at once instead of building it sequentially.

It's faster. It's not easier. The skill is stamina—the ability to maintain judgment quality across a 3-hour review session without letting mistakes slip through because you got tired.

### What Still Requires Me

AI can't do these things, and I don't expect it to anytime soon:

- **Deciding what to build next.** AI can suggest features based on user behavior data, but it can't weigh those suggestions against my personal interest, my available time, and my long-term goals. Prioritization is still entirely mine.
- **Recognizing when something feels fragile.** AI generates code that works for the test case. It doesn't generate code that communicates "this will break under load" or "this pattern will be impossible to debug six months from now." That intuition comes from shipping and breaking things repeatedly.
- **Writing authentically.** AI can mimic my tone. It can't have my experiences. Every piece of content I publish goes through an editorial pass where I inject the specific details—the actual error messages, the real numbers, the wrong turns I took—that make it trustworthy. Without those details, AI-generated content is grammatically correct and substantively hollow.

## Lessons Learned

**The "jack of all trades" pressure is obsolete when AI handles execution.** The remaining skill isn't breadth of competence—it's the judgment to distinguish AI output that's ready to ship from output that needs another pass. That's a narrower skill, but it's not a shallow one.

**Every infrastructure choice is a future attention cost.** When you're solo, server maintenance isn't "free after setup." It's a recurring tax on your focus. Cloudflare Workers cost me some initial discomfort. A traditional backend stack would have cost me ongoing context-switching. For indie projects, the cheaper option isn't always the one with the lower monthly bill—it's the one you stop thinking about after you deploy.

**AI-assisted development is a speed multiplier, not a skill replacement.** The bottleneck moves from "how fast can I produce output" to "how fast can I accurately evaluate output." If you can't audit AI-generated code for correctness, you're not going faster—you're just generating bugs faster. The foundation still matters. AI makes a competent developer much faster. It doesn't make an incompetent developer competent.

**The meta-skill that compounds is building reusable AI instructions.** Every time you catch AI making a mistake, encode that check into a Skill. Every time you refine your writing tone, update the Skill. Over months, these accumulate into an AI assistant that knows your stack, your preferences, and your quality bar—not because it learned from somewhere, but because you taught it from repeated corrections. That's the difference between using AI and collaborating with it.
