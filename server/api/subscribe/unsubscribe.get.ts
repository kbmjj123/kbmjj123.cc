// GET /api/subscribe/unsubscribe?token=xxx — Unsubscribe

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const token = query.token as string

    if (!token) {
      throw createError({ statusCode: 400, statusMessage: 'Missing token' })
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
      throw createError({ statusCode: 404, statusMessage: 'Subscription not found' })
    }

    if (subscriber.status === 'unsubscribed') {
      return { success: true, message: 'Unsubscribed' }
    }

    // Update to unsubscribed
    await db.prepare(
      'UPDATE subscribers SET status = ?, unsubscribed_at = datetime(\'now\') WHERE id = ?'
    ).bind('unsubscribed', subscriber.id).run()

    return { success: true, message: 'Unsubscribed' }
  } catch (e: any) {
    if (e.statusCode) throw e
    console.error('Unsubscribe error:', e)
    throw createError({ statusCode: 500, statusMessage: 'Unsubscribe failed, try again later' })
  }
})
