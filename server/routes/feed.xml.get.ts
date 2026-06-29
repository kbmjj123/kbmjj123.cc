// server/api/rss.get.ts — RSS 2.0 feed
export default defineEventHandler(async (event) => {
  try {
    // @ts-ignore
    const posts = await queryCollection(event, 'posts').all()

    const siteUrl = 'https://kbmjj123.cc'
    const now = new Date().toUTCString()

    const items = (posts || [])
      .map((p: any) => {
        const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
        const slug = (p.path || '').replace('/posts/', '')
        const date = meta.date ? new Date(meta.date).toUTCString() : ''
        const excerpt = (p.description || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const title = (p.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const category = (meta.category || '').replace(/&/g, '&amp;')

        return { slug, title, date, excerpt, category }
      })
      .filter((p: any) => p.slug && p.date)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20)

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>kbmjj123.cc — Indie Developer Log</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <description>KB MJJ123 .cc — Indie developer blog sharing coding, product, and startup insights.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    ${items.map((p: any) => `    <item>
      <title>${p.title}</title>
      <link>${siteUrl}/${p.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${p.slug}</guid>
      <pubDate>${p.date}</pubDate>
      <description>${p.excerpt}</description>
      <category>${p.category}</category>
    </item>`).join('\n')}
  </channel>
</rss>`

    setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    return xml
  } catch (e) {
    console.error('RSS generation error:', e)
    setResponseStatus(event, 500)
    return '<?xml version="1.0"?><error>Failed to generate RSS feed</error>'
  }
})
