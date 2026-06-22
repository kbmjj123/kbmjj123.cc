<template>
  <section class="post-detail">
    <template v-if="pending">
      <LoadingState />
    </template>
    <template v-else-if="error">
      <ErrorState :error="error" />
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
      <div class="post-body">
        <p style="color:var(--text-secondary);font-size:15px;line-height:1.9;">{{ postData.excerpt }}</p>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: apiPost, pending, error } = useLazyAsyncData(`post-${slug}`, () => {
  return $fetch(`/api/posts/${slug}`).catch(() => null)
})

// Fallback static data for demo
const demoPosts: Record<string, { title: string; date: string; category: string; readTime: string; excerpt: string }> = {
  'year-one-as-indie': {
    title: 'Year One as Indie: From Zero to MVP',
    date: '2026-06-14',
    category: 'Dev Practice',
    readTime: '8 min',
    excerpt: 'Quitting the 9-to-5 to build my own products. The real struggles with product-market fit, tech choices, and mental health. Honest reflections for fellow builders.',
  },
}

const postData = computed(() => {
  if (pending.value) return null
  if (apiPost.value) return apiPost.value
  return demoPosts[slug] || null
})
</script>

<style scoped>
.post-detail {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
}
.post-detail::before {
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
.post-meta .date::before { content: "📅"; }
.post-meta .category::before { content: "📂"; }
.post-body {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.9;
}
</style>
