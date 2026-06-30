// server/routes/feed.xml.get.ts — RSS 2.0 feed with full content
import type { MinimalNode } from 'minimark'

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Render a minimark/MDC AST node to HTML string */
function renderNode(node: MinimalNode): string {
  if (node.type === 'text') return xmlEscape(node.value ?? '')
  if (node.type !== 'element' || !node.tag) return ''
  const { tag, props, children } = node

  // Self-closing elements
  if (tag === 'br') return '<br>'
  if (tag === 'hr') return '<hr>'
  if (tag === 'img') {
    const src = props?.src ? xmlEscape(String(props.src)) : ''
    const alt = props?.alt ? xmlEscape(String(props.alt)) : ''
    return `<img src="${src}" alt="${alt}">`
  }

  const inner = children?.map(c => renderNode(c)).join('') ?? ''

  // Code blocks — raw code in props.code
  if (tag === 'code' && props?.code) {
    const lang = props.language ? ` class="language-${xmlEscape(String(props.language))}"` : ''
    return `<pre><code${lang}>${xmlEscape(String(props.code))}</code></pre>`
  }
  if (tag === 'pre' && props?.code) {
    const lang = props.language ? ` class="language-${xmlEscape(String(props.language))}"` : ''
    return `<pre><code${lang}>${xmlEscape(String(props.code))}</code></pre>`
  }
  if (tag === 'code-inline') {
    return `<code>${inner}</code>`
  }

  // Anchor
  if (tag === 'a') {
    const href = props?.href ? xmlEscape(String(props.href)) : ''
    return `<a href="${href}">${inner}</a>`
  }

  // Heading with id
  if (tag?.[0] === 'h' && tag.length === 2 && /^h[1-6]$/.test(tag)) {
    const id = props?.id ? ` id="${xmlEscape(String(props.id))}"` : ''
    return `<${tag}${id}>${inner}</${tag}>`
  }

  // Block elements
  if (tag === 'blockquote') return `<blockquote>${inner}</blockquote>`
  if (tag === 'ul') return `<ul>${inner}</ul>`
  if (tag === 'ol') return `<ol>${inner}</ol>`
  if (tag === 'li') return `<li>${inner}</li>`
  if (tag === 'p') return `<p>${inner}</p>`

  // Inline elements
  if (tag === 'strong') return `<strong>${inner}</strong>`
  if (tag === 'em') return `<em>${inner}</em>`
  if (tag === 's') return `<s>${inner}</s>`

  // Table
  if (['table', 'thead', 'tbody', 'tr', 'th', 'td'].includes(tag)) {
    return `<${tag}>${inner}</${tag}>`
  }

  // Fallback: wrap unknown inline tags
  return `<${tag}>${inner}</${tag}>`
}

/** Render a minimark tree to HTML */
function renderTree(tree: { children?: MinimalNode[] }): string {
  return tree.children?.map(c => renderNode(c)).join('\n') ?? ''
}

export default defineEventHandler(async (event) => {
  try {
    const siteUrl = 'https://kbmjj123.cc'
    const now = new Date().toUTCString()

    // @ts-ignore — queryCollection injected by @nuxt/content
    const posts = await queryCollection(event, 'posts')
      .all()

    const sorted = posts
      .filter((p: any) => p.draft !== true && p.status !== 'draft')
      .sort((a: any, b: any) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime())
      .slice(0, 20)

    const items = sorted.map((p: any) => {
      const slug = (p.path || p._path || '').replace('/posts/', '').replace(/^\//, '')
      const title = xmlEscape(p.title || '')
      const description = xmlEscape(p.description || p.excerpt || '')
      const category = xmlEscape(p.category || '')
      const date = new Date(p.date || p.createdAt || 0).toUTCString()
      let contentHtml = description
      try {
        if (p.body) contentHtml = renderTree(p.body)
      } catch { /* fallback to description */ }

      return `    <item>
      <title>${title}</title>
      <link>${siteUrl}/${slug}</link>
      <guid isPermaLink="true">${siteUrl}/${slug}</guid>
      <pubDate>${date}</pubDate>
      <description>${description}</description>
      <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
      <category>${category}</category>
    </item>`
    }).join('\n')

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
