---
title: "The Telegram Bot Webhook That Kept Returning 404 — and Why Vercel's 10-Second Timeout Was the Culprit"
description: "A debugging story about a Telegram bot webhook that returned 404 on Vercel's free tier, even though the API route was defined. The root cause wasn't a missing route — it was a timeout race condition."
date: 2026-07-16
category: "dev-practice"
readTime: "7mins"
tags:
  - "#telegram"
  - "#bot"
  - "#vercel"
  - "#serverless"
  - "#webhook"
  - "#debugging"
image: null
draft: false
series: null
seriesOrder: null
seo:
  title: "Fix Telegram Bot Webhook 404 on Vercel Free Tier — Timeout Race Condition"
  description: "Why your Telegram bot webhook returns 404 on Vercel's free tier even when the API route is correctly defined, and how to fix it with async response handling."
  keywords:
    - "telegram bot webhook 404 vercel"
    - "vercel serverless function timeout telegram"
    - "telegram webhook async response fix"
    - "serverless 10 second timeout bot"
    - "telegram bot webhook debugging"
---

## TL;DR

My Telegram bot webhook kept returning 404 on Vercel's free tier, even though the API route was correctly defined and worked fine locally. The issue wasn't a missing route — it was a race condition. Vercel serverless functions have a **10-second timeout** on the free tier, and my bot was trying to send its response message back to Telegram *before* sending the 200 OK acknowledgment to the webhook request. Telegram's servers waited, timed out, and logged it as a 404. The fix: return `200 OK` to Telegram immediately, then process the message and send the reply asynchronously.

## Background

I built a Telegram bot a while back — nothing fancy, just a little side project that responds to commands, forwards messages, and does some basic automation. I hosted it on Vercel's free tier because, well, it's free and the deployment workflow is frictionless. Push to GitHub, Vercel picks it up, done.

The bot used Telegram's **webhook mode** instead of long polling. Webhooks are the recommended approach for production bots — Telegram sends an HTTP POST to your endpoint whenever a user sends a message, your bot processes it, and you return a response. It's cleaner, more efficient, and doesn't require a running process.

The architecture looked straightforward:

```
User ──message──▶ Telegram ──POST webhook──▶ Vercel API Route
                                                  │
                                          ┌───────┴───────┐
                                          │  Process message│
                                          │  Send reply via │
                                          │  Telegram API   │
                                          └───────┬───────┘
                                                  │
                                          Respond 200 OK
```

Simple enough. Except it wasn't working.

## The Problem

After setting up the webhook with Telegram's `setWebhook` method, I sent a test message. The bot didn't respond. I checked Telegram's webhook debugging endpoint (`getWebhookInfo`) and it showed increasing error counts. The error description? **"404 Not Found"**.

But the route was there. I could curl it directly and get a response. I redeployed. I checked the route path three times. I added logging. I redeployed again. Still 404s from Telegram.

What made this particularly frustrating was that:

1. The API route was clearly defined and working — I could hit it from a browser and see the response
2. There were no deployment errors — Vercel reported the deployment as successful
3. The error was intermittent — occasionally a message would get through, but most would fail
4. I had no access to Telegram's internal error logs (they rotate and aren't user-retrievable)

## Investigation

I started by confirming the webhook URL was correct. A call to `getWebhookInfo` confirmed Telegram was hitting the right endpoint:

```json
{
  "ok": true,
  "result": {
    "url": "https://my-bot.vercel.app/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 12,
    "last_error_date": 1720000000,
    "last_error_message": "404 Not Found",
    "max_connections": 40
  }
}
```

The URL was correct. The route was deployed. But 12 pending updates and a trail of 404 errors told a clear story.

The webhook payload from Telegram looks something like this (simplified):

```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": {
      "id": 987654321,
      "is_bot": false,
      "first_name": "User"
    },
    "chat": {
      "id": 987654321,
      "type": "private"
    },
    "text": "/start",
    "date": 1720000000
  }
}
```

My handler looked roughly like this (pseudocode):

```js
export default async function handler(req, res) {
  const { message } = req.body;

  // Process the incoming message
  const reply = await processMessage(message.text);

  // Send response back to Telegram
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: message.chat.id,
      text: reply,
    }),
  });

  // Acknowledge webhook
  res.status(200).json({ ok: true });
}
```

Looks reasonable, right? Receive message, process it, send reply, acknowledge. The problem is hiding in plain sight.

## Root Cause: The 10-Second Serverless Timer

Vercel's free tier (Hobby plan) has a **10-second execution timeout** for serverless functions. The Pro plan bumps this to 60 seconds (configurable up to 900 seconds), but on free tier you get 10 seconds, and that's not configurable.

Here's what was actually happening chronologically:

1. Telegram sends the webhook POST to Vercel
2. Vercel starts executing the handler
3. The handler calls `processMessage()` — which itself might take a couple seconds if it calls external APIs
4. The handler then calls the Telegram `sendMessage` API — another network round trip
5. Telegram is waiting for a `200 OK` response to the webhook request
6. But the handler hasn't sent the response yet — it's still waiting for `sendMessage` to complete
7. If the combined time of steps 3 + 4 exceeds 10 seconds, **Vercel terminates the function**
8. Vercel returns a **504 Gateway Timeout** — but by this point, the connection is already torn down
9. Telegram interprets the failed connection as a **404** (or more accurately, Telegram's webhook client sees a connection error and reports it as a connection failure — the "404 Not Found" is Telegram's generic way of saying "the endpoint didn't respond correctly")

The 10-second window was tight but crushing. Any external API call in `processMessage` — a database query, an AI model inference, a rate-limited retry — could push past the limit. And because the `200 OK` was at the *end* of the handler instead of the *beginning*, Telegram never got its acknowledgment.

## The Fix: Respond First, Process Later

The fix was almost embarrassingly simple: **respond to the webhook immediately with `200 OK`, then process the message asynchronously**.

```js
export default async function handler(req, res) {
  // 1. Immediately acknowledge the webhook
  res.status(200).json({ ok: true });

  // 2. Extract update data
  const { message } = req.body;
  if (!message) return;

  // 3. Process asynchronously — Vercel may still let it run
  //    but we already sent the response, so Telegram is happy
  try {
    const reply = await processMessage(message.text);

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: message.chat.id,
        text: reply,
      }),
    });
  } catch (err) {
    // Log the error, but don't crash — we already responded
    console.error('Async processing failed:', err);
  }
}
```

By sending `200 OK` first, Telegram immediately knows the webhook was received successfully. It marks the update as delivered and won't retry it. Meanwhile, the rest of the handler runs asynchronously — Vercel typically lets the function finish even after sending the response, as long as it stays within the timeout.

If the async processing still exceeds 10 seconds, that's fine — the bot message just doesn't get sent, but the webhook is already acknowledged. No more 404s, no more pending updates piling up.

### A More Robust Approach

For production use, I'd recommend a pattern that completely decouples the webhook acknowledgment from the message processing:

```js
export default async function handler(req, res) {
  // Acknowledge immediately
  res.status(200).json({ ok: true });

  const update = req.body;

  // Queue the update for background processing
  await queueProcessing(update);
}

async function queueProcessing(update) {
  const { message } = update;
  if (!message?.text) return;

  // Use a queue, job system, or just fire-and-forget
  // On Vercel, you could use WaitUntil or a standalone async call
  processUpdate(update).catch(console.error);
}
```

If you're on a platform that supports it (like Cloudflare Workers with `waitUntil`), you can register background tasks that run after the response is sent. On Vercel, you can use their `waitUntil` experimental feature, or simply structure your code so the response goes out first.

## A Note on Debugging Serverless Webhooks

This debugging session taught me a few things that are worth writing down:

**You can't always trust the error message.** Telegram reported "404 Not Found," but the actual HTTP status from Vercel was likely a 504 Gateway Timeout. The error message you see is sometimes whatever the client library surfaces when a connection drops unexpectedly. Don't tunnel-vision on the status code — think about the entire request lifecycle.

**Serverless timeouts are silent killers.** When a function times out on Vercel, the logs might show the error, but by the time you check, they've rotated out. I never got a screenshot of the Vercel dashboard showing the timeout because by the time I thought to look, the logs were gone. Add logging early, and log *before* you do any processing.

**Check `getWebhookInfo` first.** Telegram's `getWebhookInfo` endpoint is your best debugging tool. It shows `pending_update_count`, `last_error_date`, and `last_error_message`. If you see pending updates accumulating, your webhook handler is either crashing or not responding in time.

**Simulate the timeout locally.** Before deploying a fix, reproduce the timing issue locally by adding an artificial delay:

```js
await new Promise(r => setTimeout(r, 11000)); // 11 seconds — exceeds Vercel free tier
```

If your handler breaks with an artificial 11-second delay, it will break in production too.

## Key Takeaways

1. **Respond to webhooks immediately.** This is a general best practice, not just a Vercel-specific fix. Webhook senders (Telegram, Stripe, GitHub — all of them) expect a timely `2xx` response. Do your processing after the acknowledgment.

2. **Know your platform's limits.** Vercel free tier: 10-second timeout. Cloudflare Workers free tier: 30 seconds (CPU), 100 seconds (wall clock). Know these numbers before you design your handler.

3. **Async doesn't mean free.** Sending `200 OK` first helps with the webhook protocol, but your function still needs to finish within the timeout for the processing to complete. For truly heavy work, use a queue (Vercel KV queues, Cloudflare Queues, or an external job system).

4. **Error messages are hints, not truths.** "404 Not Found" on a route that exists means something else is wrong upstream. Look at the system holistically rather than debugging the error string.

---

The fix took about 30 seconds to implement. The debugging took several evenings. But that's almost always how it goes with serverless footguns — the solution is simple once you understand the constraint you're running up against.

If you've hit a similar wall with a Telegram bot on serverless, try the respond-first pattern. It might save you a couple of evenings.
