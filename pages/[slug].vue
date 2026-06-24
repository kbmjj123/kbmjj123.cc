<template>
  <section class="post-detail">
    <h1 class="post-title">{{ title }}</h1>
    <div class="post-meta">
      <span class="date">{{ date }}</span>
      <span class="category">{{ category }}</span>
      <span style="color:var(--text-muted);">⌨️ {{ readTime }}</span>
    </div>
    <div class="post-body markdown-content" ref="postBodyRef">
      <ContentRenderer v-if="body && typeof body === 'object'" :value="{ body }" />
      <p v-else style="color:var(--text-secondary);font-size:15px;line-height:1.9;">{{ excerpt }}</p>
    </div>
  </section>
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

const postMeta = computed(() => {
  const raw = post.value
  if (!raw) return null
  const meta = typeof raw.meta === 'string' ? JSON.parse(raw.meta) : (raw.meta || {})
  return {
    title: raw.title || '',
    date: meta.date || '',
    category: meta.category || '',
    readTime: meta.readTime || (typeof raw.readTime === 'object' ? raw.readTime.text : raw.readTime) || '',
    excerpt: raw.description || '',
    body: raw.body || null,
  }
})

const title = computed(() => postMeta.value?.title || '')
const date = computed(() => postMeta.value?.date || '')
const category = computed(() => postMeta.value?.category || '')
const readTime = computed(() => postMeta.value?.readTime || '')
const excerpt = computed(() => postMeta.value?.excerpt || '')
const body = computed<any>(() => postMeta.value?.body || null)

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
}

@media (max-width: 480px) {
  .post-detail { padding: 16px 14px 18px; }
}
</style>
