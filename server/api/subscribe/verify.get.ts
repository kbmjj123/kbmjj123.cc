// GET /api/subscribe/verify?token=xxx — Verify subscription

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const token = query.token as string

    if (!token) {
      throw createError({ statusCode: 400, statusMessage: '缺少验证参数' })
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
      return sendResponse(event, 400, '无效或已过期的验证链接')
    }

    if (subscriber.status === 'active') {
      return sendResponse(event, 200, '订阅已确认，无需重复验证')
    }

    if (subscriber.status === 'unsubscribed') {
      return sendResponse(event, 400, '该邮箱已退订')
    }

    // Update to active
    await db.prepare(
      'UPDATE subscribers SET status = ?, verified_at = datetime(\'now\') WHERE id = ?'
    ).bind('active', subscriber.id).run()

    return sendResponse(event, 200, '订阅成功！感谢你的关注 🎉')
  } catch (e: any) {
    if (e.statusCode) throw e
    console.error('Verify error:', e)
    throw createError({ statusCode: 500, statusMessage: '验证失败，请稍后重试' })
  }
})

function sendResponse(event: any, status: number, message: string) {
  setResponseStatus(event, status)
  return {
    success: status < 400,
    message,
  }
}
