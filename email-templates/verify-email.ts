// Verify Email Template — PixelBlog style
// Component-based architecture (React Email spirit, zero runtime deps)

interface RecentPost {
  title: string
  slug: string
  date: string
}

export interface VerifyEmailProps {
  verifyUrl: string
  recentPosts: RecentPost[]
  blogUrl: string
}

export function renderVerifyEmail(props: VerifyEmailProps): string {
  const { verifyUrl, recentPosts, blogUrl } = props

  const postsHtml = recentPosts
    .map(
      (p) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px dotted #2a2a42;">
          <a href="${blogUrl}/${p.slug}" style="color:#4ade80;text-decoration:none;font-size:14px;font-family:Inter,-apple-system,sans-serif;">
            ${escHtml(p.title)}
          </a>
          <div style="color:#4d5a7a;font-size:12px;font-family:'Press Start 2P',monospace;margin-top:4px;">
            ${p.date}
          </div>
        </td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>确认订阅 KB MJJ123 .cc</title>
</head>
<body style="margin:0;padding:0;background-color:#0b0b12;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0b12;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Main Container -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Top decorative bar -->
          <tr>
            <td style="padding:0;">
              <div style="height:3px;background:repeating-linear-gradient(90deg,#4ade80,#4ade80 8px,transparent 8px,transparent 16px);"></div>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:32px 0 24px;text-align:center;">
              <div style="font-family:'Press Start 2P',monospace;font-size:14px;color:#fbbf24;letter-spacing:1px;">
                KB MJJ123 .cc
              </div>
              <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#4d5a7a;margin-top:8px;">
                ✦ INDIE DEV LOG ✦
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#13131e;border:1px solid #2a2a42;border-radius:4px;padding:40px 32px;">

              <!-- Title -->
              <h1 style="font-family:'Press Start 2P',monospace;font-size:16px;color:#e8edf5;margin:0 0 16px;line-height:1.6;">
                [ 确认订阅 ]
              </h1>

              <!-- Intro text -->
              <p style="font-family:Inter,-apple-system,sans-serif;font-size:13px;color:#9aa8c9;line-height:1.8;margin:0 0 8px;">
                感谢你的订阅！确认后，你将收到不定期 Newsletter，汇总近期文章与独立开发动态。
              </p>
              <p style="font-family:Inter,-apple-system,sans-serif;font-size:13px;color:#9aa8c9;line-height:1.8;margin:0 0 24px;">
                点击下方按钮完成验证：
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td align="center" style="border:1px solid #4ade80;border-radius:2px;">
                    <a href="${escHtml(verifyUrl)}"
                       style="display:inline-block;padding:12px 32px;font-family:'Press Start 2P',monospace;font-size:10px;color:#0b0b12;text-decoration:none;background:#4ade80;">
                      ✓ 确认订阅
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Recent posts -->
              <div style="border-top:1px solid #2a2a42;padding-top:24px;">
                <h2 style="font-family:'Press Start 2P',monospace;font-size:10px;color:#fbbf24;margin:0 0 16px;">
                  ▸ 近期文章
                </h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${postsHtml}
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="font-family:Inter,-apple-system,sans-serif;font-size:11px;color:#4d5a7a;margin:0 0 8px;">
                你收到这封邮件是因为有人使用此邮箱订阅了 KB MJJ123 .cc。
              </p>
              <p style="font-family:Inter,-apple-system,sans-serif;font-size:11px;color:#4d5a7a;margin:0;">
                如果你没有发起此操作，请忽略此邮件。
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
