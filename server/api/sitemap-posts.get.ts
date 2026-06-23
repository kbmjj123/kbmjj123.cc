// server/api/sitemap-posts.ts
export default defineEventHandler(async (event) => {
  try {
		//@ts-ignore
    const posts = await queryCollection(event, 'posts')
      .all()
    return posts.map((p: any) => ({
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