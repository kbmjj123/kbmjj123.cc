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

// Fetch all posts from Nuxt Content
const { data: allPosts, pending: fetching } = useAsyncData('all-posts', async () => {
  try {
    return await queryCollection('posts').all()
  } catch {
    return await queryCollection('posts').select('id', 'path', 'title', 'description', 'body', 'meta', 'seo', 'stem', 'extension').all()
  }
})

// Find this post and extract frontmatter from meta JSON
const rawPost = computed(() => allPosts.value?.find((p: any) => p.path === `/posts/${slug}`) || null)

const contentPost = computed(() => {
  if (!rawPost.value) return null
  const meta = typeof rawPost.value.meta === 'string'
    ? JSON.parse(rawPost.value.meta)
    : (rawPost.value.meta || {})
  return { ...rawPost.value, date: meta.date || '', category: meta.category || '', tags: meta.tags || [] }
})

const pending = computed(() => fetching.value && !contentPost.value)

// Build final post data
const postData = computed(() => {
  if (contentPost.value) {
    return { ...contentPost.value, readTime: '8 min' }
  }
  if (pending.value) return null
  return null
})

// Build TOC from rendered H2/H3 IDs after mount
function buildTocFromDom() {
  if (!postBodyRef.value) return
  const headings = postBodyRef.value.querySelectorAll('h2[id], h3[id]')
  const items = Array.from(headings).map(h => ({
    id: h.id,
    text: h.textContent || '',
    level: parseInt(h.tagName[1]),
  }))
  if (items.length > 0) setToc(items)
}

// Watch for content render completion
watch(postData, () => {
  if (postData.value?.body) {
    nextTick(() => buildTocFromDom())
  }
}, { immediate: true })

onMounted(() => {
  if (postData.value?.body) nextTick(() => buildTocFromDom())
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
