import fs from 'node:fs'
import path from 'node:path'
import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  const routes: { loc: string; lastmod?: string; changefreq: string; priority: number }[] = []

  const postsDir = path.resolve(process.cwd(), 'content/posts')

  try {
    if (!fs.existsSync(postsDir)) {
      console.warn('posts dir not found:', postsDir)
      return routes
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))

    for (const file of files) {
      const slug = file.replace(/\.md$/, '')
      const filePath = path.join(postsDir, file)
      const stats = fs.statSync(filePath)

      routes.push({
        loc: `/${slug}`,           // 对应你之前的 URL 格式
        lastmod: stats.mtime.toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      })
    }
  } catch (e) {
    console.error('sitemap error:', e)
  }

  return routes
})