<template>
  <section class="post-list">
    <h1 class="sr-only">kbmjj123.cc — Indie Developer Log</h1>
    <h2 class="sr-only">Latest Posts</h2>
    <!-- Active filter indicator -->
    <div v-if="activeFilter" class="filter-bar">
      <span style="font-family:var(--font-pixel);font-size:9px;color:var(--text-muted);">
        {{ activeFilter.label }}: <strong style="color:var(--accent-green);">{{ activeFilter.value }}</strong>
      </span>
      <NuxtLink to="/" style="font-family:var(--font-pixel);font-size:8px;color:var(--accent-gold);text-decoration:none;border:1px solid var(--accent-gold);padding:2px 10px;transition:all 0.15s;" @mouseenter="$event.target.style.background='var(--accent-gold)';$event.target.style.color='var(--bg-deep)'" @mouseleave="$event.target.style.background='transparent';$event.target.style.color='var(--accent-gold)'">✕ Clear</NuxtLink>
    </div>

    <!-- Loading state -->
    <LoadingState v-if="pending" />

    <!-- Empty state -->
    <div v-if="filteredPosts.length === 0 && !pending" class="empty-filter">
      <p style="font-family:var(--font-pixel);font-size:10px;color:var(--text-muted);text-align:center;padding:40px 20px;">No posts match this filter.</p>
      <div style="text-align:center;"><NuxtLink to="/" style="font-family:var(--font-pixel);font-size:9px;color:var(--accent-green);border:1px solid var(--accent-green);padding:6px 18px;text-decoration:none;">← All posts</NuxtLink></div>
    </div>

    <!-- Post list — semantic markup with schema.org microdata -->
    <article v-for="(post, i) in filteredPosts" :key="post.slug" class="post-item" :style="{ animationDelay: `${0.1 + i * 0.1}s` }" itemscope itemtype="https://schema.org/BlogPosting" role="link" tabindex="0" @click="navigateTo(`/${post.slug}`)" @keydown.enter.prevent="navigateTo(`/${post.slug}`)">
      <h3 class="post-title" itemprop="headline">
        <NuxtLink :to="`/${post.slug}`" itemprop="url" tabindex="-1" @click.stop>{{ post.title }}</NuxtLink>
      </h3>
      <div class="post-meta">
        <time :datetime="post.isoDate" class="date">{{ post.date }}</time>
        <span class="category" itemprop="about">{{ post.category }}</span>
        <span style="color:var(--text-muted);">⌨️ {{ post.readTime }}</span>
      </div>
      <p class="post-excerpt" itemprop="description">{{ post.excerpt }}</p>
      <NuxtLink :to="`/${post.slug}`" tabindex="-1" @click.stop class="btn-read">Read More</NuxtLink>
      <!-- Schema.org hidden meta -->
      <meta itemprop="author" content="kbmjj123" />
      <meta v-if="post.isoDate" :content="post.isoDate" itemprop="datePublished" />
    </article>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const siteUrl = 'https://kbmjj123.cc'

// --- SEO base — via @nuxtjs/seo (defineSeoMeta + defineOgImage) ---
usePageSeo({
  title: 'Indie Developer Log',
  description: 'KB MJJ123 .cc — Indie developer blog sharing coding, product, and startup insights.',
  template: 'prefix',
})

// @nuxtjs/seo auto-handles canonical URL, og:url, og:type, og:locale, og:site_name
// from site config in nuxt.config.ts — no manual tags needed.

// --- SSR-safe post loading (useAsyncData for SSG/SSR, not client-only onMounted) ---
const { data: rawPosts, pending } = useAsyncData('posts-index', async () => {
  try {
    const posts = await queryCollection('posts').all()
    // Deep-clone to strip Content v3 proxy objects before serialization
    return JSON.parse(JSON.stringify(posts || []))
  } catch (e) {
    console.error('Failed to load posts:', e)
    return []
  }
})

function toIsoDate(raw: string): string {
  if (!raw) return ''
  try {
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? '' : d.toISOString()
  } catch {
    return ''
  }
}

interface PostItem {
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

const allPosts = computed<PostItem[]>(() => {
  if (!rawPosts.value) return []
  return (rawPosts.value || []).map((p: Record<string, any>) => {
    const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
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

// --- Filter from query params ---
const categoryFilter = computed(() => route.query.category as string | undefined)
const tagFilter = computed(() => route.query.tag as string | undefined)
const activeFilter = computed(() => {
  if (categoryFilter.value) return { label: 'Category', value: categoryFilter.value }
  if (tagFilter.value) return { label: 'Tag', value: `#${tagFilter.value}` }
  return null
})

const filteredPosts = computed(() => {
  let result = allPosts.value
  if (categoryFilter.value) {
    result = result.filter(p => p.categorySlug === categoryFilter.value)
  }
  if (tagFilter.value) {
    result = result.filter(p => p.tags.includes(`#${tagFilter.value}`))
  }
  return [...result].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// --- Keywords meta (not auto-generated by @nuxtjs/seo) ---
const keywords = computed(() => {
  const cats = [...new Set(allPosts.value.map(p => p.category).filter(Boolean))]
  return cats.length > 0 ? cats.join(', ') : undefined
})

useHead(() => ({
  meta: keywords.value ? [{ name: 'keywords', content: keywords.value }] : [],
}))

// --- JSON-LD structured data: CollectionPage + ItemList of BlogPosting ---
const hasFilter = computed(() => !!activeFilter.value)

const ldJson = computed(() => {
  if (hasFilter.value) return null // only emit for unfiltered collection page
  const posts = filteredPosts.value
  if (posts.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'kbmjj123.cc — Indie Developer Log',
    description: 'Indie developer blog sharing coding, product, and startup insights.',
    url: siteUrl + '/',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          url: `${siteUrl}/${post.slug}`,
          ...(post.isoDate ? { datePublished: post.isoDate } : {}),
          author: { '@type': 'Person', name: 'kbmjj123' },
          description: post.excerpt,
        },
      })),
    },
  }
})

useHead(() => ldJson.value ? {
  script: [
    {
      id: 'ld-collectionpage',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(ldJson.value),
    },
  ],
} : {})
</script>

<style scoped>
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(74,222,128,0.04);
  border: 1.5px solid var(--border-pixel);
  border-left: 3px solid var(--accent-green);
}
.post-item {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 24px 26px 22px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  animation: pixelFadeUp 0.5s ease forwards;
  cursor: pointer;
}
.post-item:hover {
  border-color: var(--accent-green);
  box-shadow: 0 4px 16px rgba(74,222,128,0.04);
  transform: translateY(-2px);
}
.post-item:hover .post-title a { color: var(--accent-green); }
.post-item:hover .btn-read {
  background: var(--accent-green);
  color: var(--bg-deep);
  box-shadow: 4px 4px 0 rgba(74,222,128,0.15);
}
.post-item::before {
  content: "◆";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 14px;
  background: var(--bg-card);
  padding: 0 4px;
}
.post-title {
  font-family: var(--font-pixel);
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.7;
}
.post-title a { color: inherit; text-decoration: none; transition: color 0.15s; }
.post-title a:hover { color: var(--accent-green); }
.post-meta {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--text-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 14px 20px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dotted var(--border-pixel);
  text-transform: uppercase;
}
.post-meta .category { color: var(--accent-gold); }
.post-meta .category::before { content: "📂 "; font-family: system-ui; font-size: 9px; }
.post-meta .date::before { content: "📅 "; font-family: system-ui; font-size: 9px; }
.post-excerpt {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.9;
  font-weight: 400;
}
.btn-read {
  display: inline-block;
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--accent-green);
  background: transparent;
  border: 1.5px solid var(--accent-green);
  padding: 6px 18px;
  text-decoration: none;
  transition: all 0.15s ease;
  letter-spacing: 0.5px;
  box-shadow: 2px 2px 0 rgba(74,222,128,0.08);
}
.btn-read:hover {
  background: var(--accent-green);
  color: var(--bg-deep);
  box-shadow: 4px 4px 0 rgba(74,222,128,0.15);
}

@media (max-width: 480px) {
  .post-item { padding: 16px 14px 18px; }
  .post-title { font-size: 12px; }
  .post-excerpt { font-size: 14px; }
  .btn-read { font-size: 9px; padding: 4px 12px; }
}
</style>
