---
title: "From MVP to Minimum Viable Resource: What I Validate Before Writing Code"
description: "Shipping a working version used to prove something. It does not anymore. Three questions I now run before starting a project, why my own tool fails all three, and what a nine-month search position cost me in one update."
date: 2026-10-28
category: "dev-practice"
readTime: "7mins"
tags:
  - "#indie-dev"
  - "#ai"
  - "#product"
  - "#seo"
image: "/images/dev-practice/from-mvp-to-minimum-viable-resource/moat-or-stack.en.png"
draft: false
relatedPosts:
  - "self-hosted-analytics-d1-free-tier"
series: null
seriesOrder: null
seo:
  title: "Minimum Viable Resource: What to Validate Before You Write Code"
  description: "A minimum viable product no longer proves demand or that you can win. Three questions that separate a real moat from a stack of shallow demos, and what happened when a search update took my position back."
  keywords:
---

Shipping the first version of my batch image tool took three days. That speed was my advantage for a long time. It is not anymore.

Last October, a search update cut my daily clicks from 1,585 to 904. My average position barely moved: 7.9, then 8.4, then 7.8. The pages were still ranked. Fewer people saw them.

That gap — between what I believed I owned and what I was really renting — is what this post is about. It ends with the question I now ask before writing any code, and with the parts I still cannot answer.

## The minimum viable product bought time, not features

A minimum viable product was never valuable because it was minimal. It was valuable because it bought a window.

While someone else spent three months on research and implementation, I shipped in three days. I spent the rest of that window on things that compound: publishing pages, building links, answering questions where people actually ask them, watching rankings move. By the time the features were matched, my pages were already sitting in results. I still do all of that work, and none of it was passive.

That window has closed. Copying a feature set now takes a weekend instead of a quarter, and whoever copies it does not need to research the demand first. They can look it up.

So the useful question is no longer how to build faster. It is this: if features are not the moat, what exactly am I building every time I ship one?

## Adding modules is not the same as building a moat

The most common answer I see is "build an ecosystem".

In practice that usually means more modules and more surfaces. Image tools are not enough, so add PDF. PDF is not enough, so add video. Then add accounts, favorites, history.

Spreading one MVP across ten modules leaves ten shallow products, each facing the same competitors, and now you maintain all ten.

I did the shallow version myself. By the time my site passed a hundred landing pages, I was convinced I had built something durable. More pages meant more entry points, and anyone catching up would have to reproduce a hundred pages first.

![Ten modules side by side versus one asset that thickens over time](moat-or-stack.en.png)

## Three questions that separate a moat from a pile of demos

Here is the checklist I run now. It is deliberately short, because I need to use it on a weeknight, not in a strategy session.

1. Does user number 1,000 make the product better for user number 1?
2. When a user leaves, do they lose a feature, or something they accumulated here?
3. If someone copies my code and my prompts in full, can they take my users with them?

One yes means something is compounding. Three no answers mean I shipped another minimum viable product, no matter how many modules it has.

Question two does most of the work. It separates "a user is on my site" from "a user is using a feature". Leaving the first costs something. Leaving the second costs a new bookmark.

## My own tool fails all three

My image tool has no accounts.

Someone drops files in, processes them, downloads them, and leaves. Nothing in that flow ever asks who they are. If they come back next week, I cannot tell it is the same person.

So question three has a blunt answer: yes, they can take my users, and it would cost them almost nothing.

Question two is the same. A user leaving my tool loses a feature they can find somewhere else in one search.

Question one is the bluntest. User 1,000 got nothing that user 1 did not have. The two of them never meet.

What keeps it alive is time, and only time. Pages I published months ago still get found. Links I built still carry weight. Rankings accumulated instead of appearing overnight.

That is the weakest kind of moat, and it barely deserves the word asset. Position is more accurate.

## What a nine-month position costs when it is withdrawn

The October update is the part I would rather not write down. It is also the only part with a price tag attached.

Daily clicks went from 1,585 to 904, down 43%. Impressions fell 38%. Average position stayed at 7.9, 8.4, 7.8 across the same window. Nine months of accumulated position, and one update took a large piece of it back. There was nobody to appeal to.

I spent those days hunting for a cause. Maybe it was seasonal. Maybe there was an official announcement I had missed. Maybe my rankings had slipped.

Rankings had not slipped, and no announcement I found explained a 43% drop. Ad revenue fell by roughly half over the same period, which is harder to argue with.

The one useful thing I did was rework a few pages I had been afraid to touch. When traffic is healthy, editing a page that works feels like volunteering for a loss. When traffic has already dropped, the downside of editing it shrinks. I split pages that were trying to serve several intents into pages that serve one.

I cannot tell you that edit helped. Everything was moving at once, and I have no way to separate its effect from the update itself.

That is the real price of a moat built on time. It grows steadily, and it grows on someone else's land.

## Minimum Viable Resource, the question I ask before code

Shipping a working version no longer proves anything. It does not prove demand, because demand is one search away. It does not prove you can win, because you are not the only one who can ship it.

So the first question changed. In this niche, what can only be obtained with time, relationships, trust, or permission? And do I have a way in?

If I cannot answer, I do not enter, no matter how fast I could build it.

If I can answer, that thing is the product. The code is the shell around it.

I call it Minimum Viable Resource, or MVR. What it validates is not whether I can build the thing. It is whether there is something here that only I can get.

![The first question before starting a project, changed from MVP to MVR](mvr-decision.en.png)

## Dead projects fail the resource test, not the build test

The projects I abandoned all worked, technically.

One had a complete pipeline and got stuck on data I could not source, in a niche that was also being cloned heavily. Another was built on content I had copied from elsewhere, and content you can copy is content anyone can copy. A third needed feeding every week, and I already had one project that needed feeding every week.

Three different stories, one cause. Each one validated "can I build this". None of them validated "can I get something nobody else can".

## Assets travel between niches. Tactics do not.

Running several niches at once is riskier now, because each one needs its own slow variable, and slow variables do not accumulate in parallel.

The test is one line: can the new niche reuse what the existing product has accumulated?

If yes, it is leverage. One asset, monetized in another place. If no, it is a fresh MVP in a new neighborhood, built faster this time and chased faster too.

I hold a second belief that sounds like it contradicts this one. Methods that work on one site usually do not transfer to another field.

They do not actually conflict, but the layer matters. Assets travel — judgment, accumulated data, reusable infrastructure. Tactics do not — how a page is structured, which keywords get picked, what shape the content takes.

## What AI made cheap, and what it did not

Generating code keeps getting cheaper. Verifying it has not moved.

Something produced in under a minute still takes me as long as it ever did to confirm that it is correct. That asymmetry is most of the story. The scarce things now are the slow ones: trust, habit, exclusive data, a position in a field, relationships on the supply side.

A solo builder can reach very few of them. I can name two and a half that I actually have.

The first is knowing what people do with the tool. It is not in the code and it is not on the page. It sits in my analytics as months of accumulated queries, and copying my repository does not copy it. It also contradicted me: the capability I advertised for six months is not the capability the data says people come for.

The second is a set of base capabilities I built once and reuse everywhere. A new site starts weeks ahead because of it.

The half I cannot explain is knowing what I am bad at. It has kept me out of a few holes. I do not know how it was accumulated, and I would not defend it as an asset.

## FAQ

### Is a moat realistic for one person?

Not the kind investors mean. A solo project will not have user-to-user network effects in year one. What it can have is accumulated data, a position in a niche, and habits. Those are slower and thinner, and they are the only ones on the menu.

### How long before a position becomes real?

I do not have a number I trust. Mine took about nine months to matter and lost 43% of its daily clicks in a single update. Those two facts belong together, and I have not reconciled them.

### What if I cannot name anything only I can get?

Treat that as the answer. Building it faster will not change the fact that someone else can build it too, and they will.

## Where this leaves me

My tool still fails all three questions. It has no accounts, no memory, and users who arrive and leave.

I do not have a fourth question. I have been trying to write one for a while, and the honest version is that I do not know what it should be.

What I do know is narrower. I stopped treating shipping speed as the thing that compounds, and I stopped calling nine months of search position an asset.
