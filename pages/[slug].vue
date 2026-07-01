<template>
  <article class="post-detail" itemscope itemtype="https://schema.org/BlogPosting">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/" class="breadcrumb-link">Home</NuxtLink>
      <span class="breadcrumb-sep">▸</span>
      <NuxtLink v-if="category" :to="`/category/${categorySlug}`" class="breadcrumb-link breadcrumb-category">{{ category }}</NuxtLink>
      <span class="breadcrumb-sep" v-if="category">/</span>
      <span class="breadcrumb-current">{{ title }}</span>
    </nav>
    <!-- /Breadcrumb -->

    <h1 class="post-title" itemprop="headline">{{ title }}</h1>
    <div class="post-meta">
      <time :datetime="isoDate" class="date">{{ date }}</time>
      <span class="category" itemprop="about">{{ category }}</span>
      <span style="color:var(--text-muted);">⌨️ {{ readTime }}</span>
    </div>

    <!-- Schema.org hidden meta -->
    <meta itemprop="author" content="kbmjj123" />
    <meta v-if="isoDate" :content="isoDate" itemprop="datePublished" />
    <link itemprop="url" :href="`https://kbmjj123.cc/${slug}`" />

    <div class="post-body markdown-content" ref="postBodyRef" itemprop="articleBody">
      <ContentRenderer v-if="body && typeof body === 'object'" :value="{ body }" />
      <p v-else style="color:var(--text-secondary);font-size:15px;line-height:1.9;">{{ excerpt }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { setToc, clearToc } = useToc()
const postBodyRef = ref<HTMLElement | null>(null)

// Load content at setup time — works for SSG/SSR
const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('posts').path(`/posts/${slug}`).first()
)

// Draft check — hide draft posts from production
const draftPost = computed(() => {
  const raw = post.value
  if (!raw) return true
  const meta = typeof raw.meta === 'string' ? JSON.parse(raw.meta) : (raw.meta || {})
  return !!meta.draft
})

if (draftPost.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const postMeta = computed(() => {
  const raw = post.value
  if (!raw) return null
  const meta = typeof raw.meta === 'string' ? JSON.parse(raw.meta) : (raw.meta || {})
  return {
    title: raw.title || '',
    date: meta.date || '',
    isoDate: toIsoDate(meta.date || ''),
    category: meta.category || '',
    tags: meta.tags || [] as string[],
    readTime: meta.readTime || (typeof raw.readTime === 'object' ? raw.readTime.text : raw.readTime) || '',
    excerpt: raw.description || '',
    body: raw.body || null,
  }
})

function toIsoDate(raw: string): string {
  if (!raw) return ''
  try { const d = new Date(raw); return Number.isNaN(d.getTime()) ? '' : d.toISOString() }
  catch { return '' }
}

const title = computed(() => postMeta.value?.title || '')
const date = computed(() => postMeta.value?.date || '')
const isoDate = computed(() => postMeta.value?.isoDate || '')
const category = computed(() => postMeta.value?.category || '')
const categorySlug = computed(() => category.value.toLowerCase().replace(/\s+/g, '-'))
const tags = computed(() => postMeta.value?.tags || [])
const readTime = computed(() => postMeta.value?.readTime || '')
const excerpt = computed(() => postMeta.value?.excerpt || '')
const body = computed<any>(() => postMeta.value?.body || null)

// JSON-LD — BreadcrumbList
const ldBreadcrumb = computed(() => category.value ? ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kbmjj123.cc/' },
    { '@type': 'ListItem', position: 2, name: category.value, item: `https://kbmjj123.cc/category/${categorySlug.value}` },
    { '@type': 'ListItem', position: 3, name: title.value, item: `https://kbmjj123.cc/${slug}` },
  ],
}) : null)

// JSON-LD — BlogPosting
const ldPost = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title.value,
  url: `https://kbmjj123.cc/${slug}`,
  ...(isoDate.value ? { datePublished: isoDate.value } : {}),
  author: { '@type': 'Person', name: 'kbmjj123' },
  description: excerpt.value,
  ...(category.value ? { about: category.value } : {}),
  ...(tags.value.length > 0 ? { keywords: tags.value.map(t => t.replace(/^#/, '')).join(', ') } : {}),
}))

useHead(() => {
  const head: Record<string, any> = { script: [] }
  if (ldBreadcrumb.value) {
    head.script.push({
      id: `ld-breadcrumb-${slug}`,
      type: 'application/ld+json',
      innerHTML: JSON.stringify(ldBreadcrumb.value),
    })
  }
  head.script.push({
    id: `ld-post-${slug}`,
    type: 'application/ld+json',
    innerHTML: JSON.stringify(ldPost.value),
  })
  // Article OG meta
  const meta: Record<string, string>[] = [
    { property: 'article:published_time', content: isoDate.value },
    { property: 'article:author', content: 'kbmjj123' },
    { property: 'article:section', content: category.value },
  ]
  for (const tag of tags.value) {
    meta.push({ property: 'article:tag', content: tag.replace(/^#/, '') })
  }
  head.meta = meta.filter(m => m.content)
  return head
})

// SEO + OG image — reactive via computed
usePageSeo(() => ({
  title: title.value,
  description: excerpt.value,
  template: 'blog',
}))

// Build TOC from rendered DOM
function buildToc() {
  if (!postBodyRef.value) return
  const headings = postBodyRef.value.querySelectorAll('h2[id], h3[id]')
  if (headings.length > 0) {
    setToc(Array.from(headings).map(h => ({
      id: h.id, text: h.textContent || '', level: parseInt(h.tagName[1]),
    })))
    return true
  }
  return false
}

onMounted(() => {
  const tryBuild = () => { if (!buildToc()) setTimeout(tryBuild, 300) }
  setTimeout(tryBuild, 600)
})
onUnmounted(() => clearToc())
</script>

<style scoped>
.post-detail {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
  min-width: 0;
}
.breadcrumb {
  font-family: var(--font-pixel);
  font-size: 9px;
  margin-bottom: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 6px;
}
.breadcrumb-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s;
}
.breadcrumb-link:hover {
  color: var(--accent-green);
}
.breadcrumb-link::before { content: "["; }
.breadcrumb-link::after { content: "]"; }
.breadcrumb-category {
  color: var(--accent-gold);
}
.breadcrumb-sep {
  color: var(--text-muted);
  font-size: 7px;
}
.breadcrumb-current {
  color: var(--text-secondary);
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.post-detail::before {
  content: "\25C6";
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
  font-size: 22px;
  color: var(--text-primary);
  margin-bottom: 10px;
  line-height: 1.6;
}
.post-meta {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--text-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 14px 20px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px dotted var(--border-pixel);
  text-transform: uppercase;
}
.post-meta .category { color: var(--accent-gold); }
.post-meta .date::before,
.post-meta .category::before { font-family: system-ui; font-size: 9px; margin-right: 4px; }
.post-meta .date::before { content: "\1F4C5"; }
.post-meta .category::before { content: "\1F4C2"; }
.post-body {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.9;
  overflow-wrap: break-word;
  overflow: hidden;
}
.post-body :deep(img),
.post-body :deep(video),
.post-body :deep(iframe),
.post-body :deep(pre) {
  max-width: 100%;
  height: auto;
}
.post-body :deep(img) {
  display: block;
  border-radius: 4px;
}

@media (max-width: 480px) {
  .post-detail { padding: 16px 14px 18px; }
}
</style>
