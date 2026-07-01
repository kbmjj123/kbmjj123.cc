<template>
  <section class="archive-content">
    <h1>📚 Archive</h1>
    <div class="subhead">All posts, sorted by year</div>

    <LoadingState v-if="pending" />

    <div v-for="year in archive" :key="year.year" class="archive-year" itemscope itemtype="https://schema.org/ItemList">
      <h2 itemprop="name">{{ year.year }}</h2>
      <div v-for="(post, i) in year.posts" :key="post.title" class="archive-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <meta itemprop="position" :content="String(i + 1)" />
        <time :datetime="post.isoDate" class="date">{{ post.date }}</time>
        <span class="title"><NuxtLink :to="post.slug" itemprop="url"><span itemprop="name">{{ post.title }}</span></NuxtLink></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
usePageSeo({ title: 'Archive', description: 'Browse all posts by year — archive of published articles.' })

interface ArchivePost { date: string; isoDate: string; title: string; slug: string }
interface ArchiveYear { year: string; posts: ArchivePost[] }

function toIsoDate(raw: string): string {
  if (!raw) return ''
  try { const d = new Date(raw); return Number.isNaN(d.getTime()) ? '' : d.toISOString() }
  catch { return '' }
}

const { data: rawPosts, pending } = useAsyncData('posts-archive', async () => {
  try {
    const posts = JSON.parse(JSON.stringify(await queryCollection('posts').all()))
    return (posts || []) as Record<string, any>[]
  } catch (e) {
    console.error('Failed to load archive:', e)
    return []
  }
})

const archive = computed<ArchiveYear[]>(() => {
  if (!rawPosts.value) return []
  const posts = rawPosts.value
  const grouped: Record<string, ArchivePost[]> = {}
  for (const p of posts) {
    const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
    if (meta.draft) continue
    const rawDate = meta.date || ''
    const year = rawDate ? String(new Date(rawDate).getFullYear()) : 'Unknown'
    if (!grouped[year]) grouped[year] = []
    grouped[year].push({
      date: rawDate ? rawDate.slice(5) : '',
      isoDate: toIsoDate(rawDate),
      title: p.title || '',
      slug: `/${p.path?.replace('/posts/', '') || ''}`,
    })
  }
  return Object.entries(grouped)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, posts]) => ({ year, posts }))
})

// @nuxtjs/seo auto-generates WebPage schema from route meta — no manual call needed
</script>

<style scoped>
.archive-content {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
}
.archive-content::before {
  content: "◆";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 14px;
  background: var(--bg-card);
  padding: 0 4px;
}
.archive-content h1 {
  font-family: var(--font-pixel);
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.subhead {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 22px;
  border-bottom: 1px dotted var(--border-pixel);
  padding-bottom: 12px;
}
.archive-year { margin-bottom: 28px; }
.archive-year h2 {
  font-family: var(--font-pixel);
  font-size: 14px;
  color: var(--accent-gold);
  margin-bottom: 12px;
  border-left: 3px solid var(--accent-green);
  padding-left: 12px;
}
.archive-item {
  display: flex;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px dotted var(--border-pixel);
  transition: background 0.1s;
}
.archive-item:hover { background: rgba(74,222,128,0.03); }
.archive-item .date {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--text-muted);
  min-width: 80px;
  flex-shrink: 0;
}
.archive-item .title a {
  font-size: 15px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}
.archive-item .title a:hover { color: var(--accent-green); }

@media (max-width: 860px) {
  .archive-content h1 { font-size: 17px; }
}
@media (max-width: 480px) {
  .archive-content { padding: 16px 14px 18px; }
  .archive-item { flex-direction: column; gap: 2px; }
  .archive-item .date { min-width: auto; }
}
</style>
