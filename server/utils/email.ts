// Email utility — Resend API via fetch
// Works in Cloudflare Workers without Node.js SDK compatibility issues

import { renderVerifyEmail, type VerifyEmailProps } from '../../email-templates/verify-email'

const RESEND_API = 'https://api.resend.com/emails'
const FROM_ADDRESS = 'KB MJJ123 .cc <blog@kbmjj123.cc>'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  apiKey: string
}

async function sendEmail(params: SendEmailParams): Promise<{ id?: string; error?: string }> {
  const { to, subject, html, apiKey } = params

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [to],
      subject,
      html,
    }),
  })

  const data: Record<string, any> = await res.json()

  if (!res.ok) {
    return { error: data?.message || data?.error || 'Unknown Resend error' }
  }

  return { id: data?.id }
}

export interface SendVerifyEmailParams {
  to: string
  verifyToken: string
  recentPosts: VerifyEmailProps['recentPosts']
  apiKey: string
  blogUrl: string
}

export async function sendVerificationEmail(params: SendVerifyEmailParams): Promise<{
  success: boolean
  resendId?: string
  error?: string
}> {
  const { to, verifyToken, recentPosts, apiKey, blogUrl } = params

  const verifyUrl = `${blogUrl}/api/subscribe/verify?token=${encodeURIComponent(verifyToken)}`

  const html = renderVerifyEmail({
    verifyUrl,
    recentPosts,
    blogUrl,
  })

  const result = await sendEmail({
    to,
    subject: 'Confirm your subscription — KB MJJ123 .cc',
    html,
    apiKey,
  })

  if (result.error) {
    return { success: false, error: result.error }
  }

  return { success: true, resendId: result.id }
}
