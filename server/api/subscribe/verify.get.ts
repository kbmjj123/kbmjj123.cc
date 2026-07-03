// GET /api/subscribe/verify?token=xxx — Verify subscription

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const token = query.token as string

    if (!token) {
      throw createError({ statusCode: 400, statusMessage: 'Missing verification token' })
    }

    // Get D1 binding
    const { cloudflare } = event.context as { cloudflare?: { env?: Record<string, any> } }
    const db = cloudflare?.env?.DB
    if (!db) {
      throw createError({ statusCode: 500, statusMessage: 'Database unavailable' })
    }

    // Find subscriber by token
    const subscriber = await db.prepare(
      'SELECT id, email, status FROM subscribers WHERE verification_token = ?'
    ).bind(token).first() as { id: number; email: string; status: string } | null

    if (!subscriber) {
      return sendResponse(event, 400, 'Invalid or expired verification link')
    }

    if (subscriber.status === 'active') {
      return sendResponse(event, 200, 'Already verified')
    }

    if (subscriber.status === 'unsubscribed') {
      return sendResponse(event, 400, 'This email has unsubscribed')
    }

    // Update to active
    await db.prepare(
      'UPDATE subscribers SET status = ?, verified_at = datetime(\'now\') WHERE id = ?'
    ).bind('active', subscriber.id).run()

    return sendResponse(event, 200, 'Subscribed! Thanks for joining 🎉')
  } catch (e: any) {
    if (e.statusCode) throw e
    console.error('Verify error:', e)
    throw createError({ statusCode: 500, statusMessage: 'Verification failed, try again later' })
  }
})

function sendResponse(event: any, status: number, message: string) {
  setResponseStatus(event, status)
  return {
    success: status < 400,
    message,
  }
}
