// GET /api/subscribe/unsubscribe?token=xxx — Unsubscribe

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const token = query.token as string

    if (!token) {
      throw createError({ statusCode: 400, statusMessage: '缺少参数' })
    }

    // Get D1 binding
    const { cloudflare } = event.context as { cloudflare?: { env?: Record<string, any> } }
    const db = cloudflare?.env?.DB
    if (!db) {
      throw createError({ statusCode: 500, statusMessage: '数据库不可用' })
    }

    // Find subscriber by token
    const subscriber = await db.prepare(
      'SELECT id, email, status FROM subscribers WHERE verification_token = ?'
    ).bind(token).first() as { id: number; email: string; status: string } | null

    if (!subscriber) {
      throw createError({ statusCode: 404, statusMessage: '未找到订阅记录' })
    }

    if (subscriber.status === 'unsubscribed') {
      return { success: true, message: '已退订' }
    }

    // Update to unsubscribed
    await db.prepare(
      'UPDATE subscribers SET status = ?, unsubscribed_at = datetime(\'now\') WHERE id = ?'
    ).bind('unsubscribed', subscriber.id).run()

    return { success: true, message: '已退订' }
  } catch (e: any) {
    if (e.statusCode) throw e
    console.error('Unsubscribe error:', e)
    throw createError({ statusCode: 500, statusMessage: '退订失败，请稍后重试' })
  }
})
