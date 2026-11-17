// server/api/sitemap-posts.ts
const siteUrl = 'https://kbmjj123.cc'

export default defineEventHandler(async (event) => {
  try {
		//@ts-ignore
    const posts = await queryCollection(event, 'posts')
      .all()
    const published = (posts || []).filter((p: any) => {
      const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
      return !meta.draft
    })
    const postEntries = published.map((p: any) => {
      const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
      const entry: any = {
        loc: p.path.replace('/posts', ''),
        lastmod: p.updatedAt || p.date || undefined,
        changefreq: 'weekly',
        priority: 0.8,
      }
      if (meta.image) {
        entry.images = [{ loc: `${siteUrl}${meta.image}`, title: p.title }]
      }
      return entry
    })

    // Case-study pages from the projects collection
    let projectEntries: any[] = []
    try {
      //@ts-ignore
      const studies = await queryCollection(event, 'projects').all()
      projectEntries = (studies || [])
        .filter((s: any) => {
          const meta = typeof s.meta === 'string' ? JSON.parse(s.meta) : (s.meta || {})
          return meta.status === 'ready'
        })
        .map((s: any) => ({
          loc: s.path || '/projects',
          lastmod: s.updatedAt || undefined,
          changefreq: 'monthly',
          priority: 0.9,
        }))
    } catch (e) {
      console.error('sitemap projects error:', e)
    }

    return [...postEntries, ...projectEntries]
  } catch (e) {
    console.error('sitemap error:', e)
    return []
  }
})