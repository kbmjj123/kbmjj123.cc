<template>
  <section class="post-detail">
    <template v-if="pending">
      <LoadingState />
    </template>
    <template v-else-if="!postData">
      <EmptyState />
    </template>
    <template v-else>
      <h1 class="post-title">{{ postData.title }}</h1>
      <div class="post-meta">
        <span class="date">{{ postData.date }}</span>
        <span class="category">{{ postData.category }}</span>
        <span style="color:var(--text-muted);">⌨️ {{ postData.readTime }}</span>
      </div>
      <div class="post-body" ref="postBodyRef">
        <ContentRenderer :value="postData" v-if="postData.body" />
        <p v-else style="color:var(--text-secondary);font-size:15px;line-height:1.9;">{{ postData.excerpt }}</p>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { setToc, clearToc } = useToc()
const postBodyRef = ref<HTMLElement | null>(null)

// Provide SSR fallback data — always visible on first paint
const demoPost = {
  'year-one-as-indie': { title: 'Year One as Indie: From Zero to MVP', date: '2026-06-14', category: 'Dev Practice', readTime: '8 min', excerpt: 'Building my own products from scratch.', body: null },
  'balance-coding-life': { title: '5 Principles to Balance Coding & Life', date: '2026-06-10', category: 'Indie Mindset', readTime: '5 min', excerpt: "A framework to stay productive and sane.", body: null },
}

// Try client-side only Nuxt Content fetch (ssr: false avoids proxy serialization issues)
const { data: allPosts, pending: fetching } = useAsyncData('all-posts-nossr', async () => {
  try {
    const posts = await queryCollection('posts').all()
    return (posts || []).map((p: any) => ({
      id: p.id, path: p.path, title: p.title, description: p.description,
      body: p.body, meta: p.meta,
    }))
  } catch { return null }
}, { lazy: true, ssr: false })

const contentPost = computed(() => {
  const posts = allPosts.value
  if (!posts) return null
  const p = posts.find((x: any) => x.path === `/posts/${slug}`)
  if (!p) return null
  const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
  return {
    id: p.id, path: p.path, title: p.title, description: p.description,
    body: p.body,
    date: meta.date || '', category: meta.category || '', tags: meta.tags || [],
  }
})

const pending = computed(() => fetching.value && !contentPost.value)

// Use demo data for SSR, upgrade to Content when available
const postData = ref(demoPost[slug] || null)

// Upgrade to real content when fetched
watch(contentPost, (post) => {
  if (post) postData.value = { ...post, readTime: '8 min' }
})

// Build TOC from rendered H2/H3 IDs — retry until headings found
function buildToc() {
  if (!postBodyRef.value) return
  const headings = postBodyRef.value.querySelectorAll('h2[id], h3[id]')
  if (headings.length > 0) {
    setToc(Array.from(headings).map(h => ({ id: h.id, text: h.textContent || '', level: parseInt(h.tagName[1]) })))
    return true
  }
  return false
}

// Retry TOC build with delays to catch ContentRenderer mount
onMounted(() => {
  const tryBuild = () => { if (!buildToc()) setTimeout(tryBuild, 200) }
  tryBuild()
})
onUnmounted(() => clearToc())
</script>

<style scoped>
.post-detail {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
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
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.5;
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
}
</style>
