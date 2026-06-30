// server/routes/feed.xml.get.ts — RSS 2.0 feed with full content
// Uses node:fs at build time via nitro prerender — generates static feed.xml
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// @ts-ignore
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

interface PostEntry {
  slug: string
  title: string
  date: string
  updatedAt: string
  excerpt: string
  contentHtml: string
  category: string
  tags: string[]
}

function loadPosts(): PostEntry[] {
  const dir = join(process.cwd(), 'content/posts')
  let files: string[]
  try {
    files = readdirSync(dir).filter((f: string) => f.endsWith('.md'))
  } catch {
    return []
  }

  return files
    .map((f: string): PostEntry | null => {
      const content = readFileSync(join(dir, f), 'utf-8')
      const slug = f.replace(/\.md$/, '')

      // Split frontmatter and body
      const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (!match) return null

      const frontmatter = match[1]
      const body = match[2]

      const getFm = (key: string): string => {
        const re = new RegExp(`^${key}:\\s*(.+)$`, 'm')
        const m = frontmatter.match(re)
        return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''
      }

      const getFmArray = (key: string): string[] => {
        // Handles both inline: tags: ["#a", "#b"]
        // and multi-line: tags:\n  - "#a"\n  - "#b"
        const inline = frontmatter.match(new RegExp(`^${key}:\\s*\\[(.*?)\\]`, 'm'))
        if (inline) {
          return inline[1]
            .split(',')
            .map((t: string) => t.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean)
        }
        // Multi-line list
        const lines = frontmatter.split('\n')
        const idx = lines.findIndex((l: string) => l.match(new RegExp(`^${key}:`)))
        if (idx === -1) return []
        const items: string[] = []
        for (let i = idx + 1; i < lines.length; i++) {
          const m = lines[i].match(/^\s+-\s+(.+)$/)
          if (m) items.push(m[1].trim().replace(/^["']|["']$/g, ''))
          else break
        }
        return items
      }

      const title = getFm('title')
      const date = getFm('date')
      const updatedAt = getFm('updatedAt') || date
      const excerpt = getFm('description')
      const category = getFm('category')
      const tags = getFmArray('tags')

      if (!title || !date) return null

      // Render markdown to HTML
      const contentHtml = md.render(body)

      return { slug, title, date, updatedAt, excerpt, contentHtml, category, tags }
    })
    .filter(Boolean) as PostEntry[]
}

export default defineEventHandler(async (event) => {
  try {
    const siteUrl = 'https://kbmjj123.cc'
    const now = new Date().toUTCString()

    const posts = loadPosts()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20)

    const items = posts
      .map((p) => {
        const excerpt = p.excerpt
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
        const title = p.title
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        const category = p.category
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        const date = new Date(p.date).toUTCString()

        return `    <item>
      <title>${title}</title>
      <link>${siteUrl}/${p.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${p.slug}</guid>
      <pubDate>${date}</pubDate>
      <description>${excerpt}</description>
      <content:encoded><![CDATA[${p.contentHtml}]]></content:encoded>
      <category>${category}</category>
    </item>`
      })
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>kbmjj123.cc — Indie Developer Log</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>KB MJJ123 .cc — Indie developer blog sharing coding, product, and startup insights.</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
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
