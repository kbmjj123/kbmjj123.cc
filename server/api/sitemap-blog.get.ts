export default defineEventHandler(async () => {
  try {
    const posts = await queryCollection('posts').all()
    if (!posts || !Array.isArray(posts)) return []

    return posts.map((p: any) => {
      const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
      const slug = p.path?.replace('/posts/', '') || ''
      return {
        loc: `/${slug}`,
        lastmod: meta.date || undefined,
        changefreq: 'weekly',
        priority: 0.8,
      }
    })
  } catch {
    return []
  }
})
