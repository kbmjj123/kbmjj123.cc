// server/api/sitemap.xml.get.ts — Full sitemap XML (static pages + all posts)
export default defineEventHandler(async (event) => {
  try {
    // @ts-ignore
    const posts = await queryCollection(event, 'posts').all()

    const siteUrl = 'https://kbmjj123.cc'
    const now = new Date().toISOString()

    // Static pages — manually defined since [slug] catch-all can't be auto-discovered
    const staticPages = [
      { loc: '/', changefreq: 'daily', priority: '1.0', lastmod: now },
      { loc: '/about', changefreq: 'monthly', priority: '0.5', lastmod: '2026-06-22T16:15:41.029Z' },
      { loc: '/archive', changefreq: 'weekly', priority: '0.7', lastmod: '2026-06-22T16:15:48.702Z' },
      { loc: '/projects', changefreq: 'monthly', priority: '0.5', lastmod: '2026-06-22T16:15:58.702Z' },
    ]

    // Blog posts from Nuxt Content
    const postPages = (posts || [])
      .map((p: any) => {
        const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
        const slug = (p.path || '').replace('/posts/', '')
        if (!slug) return null
        return {
          loc: `/${slug}`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: p.updatedAt || meta.date || now,
        }
      })
      .filter(Boolean)

    const allUrls = [...staticPages, ...postPages]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u: any) => `  <url>
    <loc>${siteUrl}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    return xml
  } catch (e) {
    console.error('Sitemap generation error:', e)
    setResponseStatus(event, 500)
    return '<?xml version="1.0"?><error>Failed to generate sitemap</error>'
  }
})
