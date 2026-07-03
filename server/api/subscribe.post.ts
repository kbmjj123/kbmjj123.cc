// POST /api/subscribe — Submit subscription
import { sendVerificationEmail } from '../utils/email'

export default defineEventHandler(async (event) => {
  try {
    const { email, name, source } = await readBody<{
      email?: string
      name?: string
      source?: string
    }>(event)

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({ statusCode: 400, statusMessage: '邮箱格式不正确' })
    }

    // Get D1 binding & env vars
    const { cloudflare } = event.context as { cloudflare?: { env?: Record<string, any> } }
    const db = cloudflare?.env?.DB
    const apiKey = cloudflare?.env?.RESEND_API_KEY || process.env.RESEND_API_KEY || ''
    const blogUrl = cloudflare?.env?.API_BASE || process.env.API_BASE || 'https://kbmjj123.cc'

    if (!db) {
      throw createError({ statusCode: 500, statusMessage: '数据库不可用' })
    }
    if (!apiKey) {
      console.warn('RESEND_API_KEY not set — verification email will not be sent')
    }

    // Check existing subscriber
    const existing = await db.prepare(
      'SELECT id, email, status FROM subscribers WHERE email = ?'
    ).bind(email).first() as { id: number; email: string; status: string } | null

    if (existing) {
      if (existing.status === 'active') {
        throw createError({ statusCode: 409, statusMessage: '该邮箱已订阅' })
      }
      if (existing.status === 'unsubscribed') {
        // Re-subscribe: re-send verification
        const token = crypto.randomUUID()
        await db.prepare(
          'UPDATE subscribers SET status = ?, verification_token = ?, subscribed_at = datetime(\'now\'), source = ? WHERE id = ?'
        ).bind('pending', token, source || 'sidebar', existing.id).run()
        await sendVerifyAndLog(event, db, email, name, token, apiKey, blogUrl)
        return { success: true, message: '验证邮件已发送' }
      }
      // pending: re-send
      const record = await db.prepare(
        'SELECT verification_token FROM subscribers WHERE id = ?'
      ).bind(existing.id).first() as { verification_token: string } | null
      const token = record?.verification_token || crypto.randomUUID()
      if (!record?.verification_token) {
        await db.prepare(
          'UPDATE subscribers SET verification_token = ? WHERE id = ?'
        ).bind(token, existing.id).run()
      }
      await sendVerifyAndLog(event, db, email, name, token, apiKey, blogUrl)
      return { success: true, message: '验证邮件已重新发送' }
    }

    // New subscriber
    const token = crypto.randomUUID()
    await db.prepare(
      `INSERT INTO subscribers (email, name, status, source, verification_token)
       VALUES (?, ?, 'pending', ?, ?)`
    ).bind(email, name || null, source || 'sidebar', token).run()

    await sendVerifyAndLog(event, db, email, name, token, apiKey, blogUrl)

    return { success: true, message: '验证邮件已发送' }
  } catch (e: any) {
    if (e.statusCode) throw e
    console.error('Subscribe error:', e)
    throw createError({ statusCode: 500, statusMessage: '订阅失败，请稍后重试' })
  }
})

async function sendVerifyAndLog(
  event: any,
  db: any,
  email: string,
  name: string | undefined,
  token: string,
  apiKey: string,
  blogUrl: string,
) {
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping email send')
    return
  }

  // Get recent posts for email content
  const recentPosts = await getRecentPosts(event, 3)

  const result = await sendVerificationEmail({
    to: email,
    verifyToken: token,
    recentPosts,
    apiKey,
    blogUrl,
  })

  // Log to email_logs
  const subscriber = await db.prepare(
    'SELECT id FROM subscribers WHERE email = ?'
  ).bind(email).first() as { id: number } | null

  if (subscriber) {
    await db.prepare(
      `INSERT INTO email_logs (subscriber_id, email_type, recipient, subject, status, resend_id, error)
       VALUES (?, 'verify', ?, ?, ?, ?, ?)`
    ).bind(
      subscriber.id,
      email,
      '确认订阅 KB MJJ123 .cc',
      result.success ? 'sent' : 'failed',
      result.resendId || null,
      result.error || null,
    ).run()
  }

  if (!result.success) {
    console.error('Failed to send verification email:', result.error)
  }
}

async function getRecentPosts(event: any, limit: number) {
  try {
    // @ts-ignore — queryCollection is auto-imported in Nuxt Content server routes
    const posts = await queryCollection(event, 'posts').all()
    const published = (posts || [])
      .filter((p: any) => {
        const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
        return !meta.draft && meta.status !== 'draft'
      })
      .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, limit)

    return published.map((p: any) => {
      const slug = p.path?.replace('/posts/', '') || p.slug || ''
      return {
        title: p.title || 'Untitled',
        slug,
        date: p.date || '',
      }
    })
  } catch (e) {
    console.error('Failed to fetch recent posts:', e)
    return []
  }
}
