// Shared post loading + mapping for the article list (home teaser, /blog, stats).
// One useAsyncData key ('posts-index') is reused across all consumers so the
// content query only runs once per page.

function toIsoDate(raw: string): string {
  if (!raw) return ''
  try {
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? '' : d.toISOString()
  } catch {
    return ''
  }
}

export interface PostItem {
  slug: string
  title: string
  date: string
  isoDate: string
  category: string
  categorySlug: string
  readTime: string
  excerpt: string
  tags: string[]
}

export function usePosts() {
  const { data: rawPosts, pending } = useAsyncData('posts-index', async () => {
    try {
      const posts = await queryCollection('posts').all()
      // Deep-clone to strip Content v3 proxy objects before serialization
      return JSON.parse(JSON.stringify(posts || [])) as Record<string, any>[]
    } catch (e) {
      console.error('Failed to load posts:', e)
      return [] as Record<string, any>[]
    }
  })

  const allPosts = computed<PostItem[]>(() => {
    if (!rawPosts.value) return []
    return (rawPosts.value || []).map((p) => {
      const meta: Record<string, any> = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
      if (meta.draft) return null
      const rawDate = meta.date || ''
      return {
        slug: p.path?.replace('/posts/', '') || '',
        title: p.title || '',
        date: rawDate,
        isoDate: toIsoDate(rawDate),
        category: meta.category || '',
        categorySlug: (meta.category || '').toLowerCase().replace(/\s+/g, '-'),
        readTime: typeof p.readTime === 'object' ? (p.readTime.text || '') : (p.readTime || meta.readTime || ''),
        excerpt: p.description || '',
        tags: meta.tags || [],
      }
    }).filter(Boolean) as PostItem[]
  })

  const sortedPosts = computed<PostItem[]>(() =>
    [...allPosts.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  )

  return { allPosts, sortedPosts, pending }
}
