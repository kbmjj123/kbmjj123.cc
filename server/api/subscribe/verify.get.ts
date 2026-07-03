// GET /api/subscribe/verify?token=xxx — Verify subscription
// Redirects to homepage on success/failure

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const token = query.token as string

    if (!token) {
      return sendRedirect(event, getSiteUrl(event) + '?verify=failed', 302)
    }

    // Get D1 binding
    const { cloudflare } = event.context as { cloudflare?: { env?: Record<string, any> } }
    const db = cloudflare?.env?.DB
    if (!db) {
      return sendRedirect(event, getSiteUrl(event) + '?verify=failed', 302)
    }

    // Find subscriber by token
    const subscriber = await db.prepare(
      'SELECT id, email, status FROM subscribers WHERE verification_token = ?'
    ).bind(token).first() as { id: number; email: string; status: string } | null

    if (!subscriber) {
      return sendRedirect(event, getSiteUrl(event) + '?verify=invalid', 302)
    }

    if (subscriber.status === 'active') {
      return sendRedirect(event, getSiteUrl(event) + '?verify=already', 302)
    }

    if (subscriber.status === 'unsubscribed') {
      return sendRedirect(event, getSiteUrl(event) + '?verify=unsubscribed', 302)
    }

    // Update to active
    await db.prepare(
      'UPDATE subscribers SET status = ?, verified_at = datetime(\'now\') WHERE id = ?'
    ).bind('active', subscriber.id).run()

    return sendRedirect(event, getSiteUrl(event) + '?verify=success', 302)
  } catch (e: any) {
    console.error('Verify error:', e)
    return sendRedirect(event, getSiteUrl(event) + '?verify=error', 302)
  }
})

function getSiteUrl(event: any): string {
  const { cloudflare } = event.context as { cloudflare?: { env?: Record<string, any> } }
  return cloudflare?.env?.API_BASE || process.env.API_BASE || 'https://kbmjj123.cc'
}
