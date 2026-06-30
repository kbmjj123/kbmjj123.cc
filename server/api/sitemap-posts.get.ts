// server/api/sitemap-posts.ts
export default defineEventHandler(async (event) => {
  try {
		//@ts-ignore
    const posts = await queryCollection(event, 'posts')
      .all()
    const published = (posts || []).filter((p: any) => {
      const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
      return !meta.draft
    })
    return published.map((p: any) => ({
      loc: p.path.replace('/posts', ''),
      lastmod: p.updatedAt || p.date || undefined,
      changefreq: 'weekly',
      priority: 0.8,
    }))
  } catch (e) {
    console.error('sitemap error:', e)
    return []
  }
})