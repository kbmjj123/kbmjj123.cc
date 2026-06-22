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
      <div class="post-body" v-html="postData.html || `<p>${postData.excerpt}</p>`"></div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { useToc } from '~/composables/useToc'

const route = useRoute()
const slug = route.params.slug as string
const { setToc, clearToc } = useToc()

const { data: apiPost, pending, error } = useLazyAsyncData(`post-${slug}`, () => {
  return $fetch(`/api/posts/${slug}`).catch(() => null)
})

interface PostData {
  title: string
  date: string
  category: string
  readTime: string
  excerpt: string
  html?: string
  headings?: { id: string; text: string; level: number }[]
}

const demoPosts: Record<string, PostData> = {
  'year-one-as-indie': {
    title: 'Year One as Indie: From Zero to MVP',
    date: '2026-06-14',
    category: 'Dev Practice',
    readTime: '8 min',
    excerpt: 'Quitting the 9-to-5 to build my own products. The real struggles with product-market fit, tech choices, and mental health. Honest reflections for fellow builders.',
    headings: [
      { id: 'the-decision', text: 'The Decision to Go Indie', level: 2 },
      { id: 'first-3-months', text: 'First 3 Months: The Honeymoon', level: 2 },
      { id: 'finding-pain-points', text: 'Finding Real Pain Points', level: 2 },
      { id: 'building-mvp', text: 'Building the MVP', level: 3 },
      { id: 'launch-and-silence', text: 'Launch and Silence', level: 2 },
      { id: 'lessons-learned', text: 'Lessons Learned', level: 3 },
      { id: 'whats-next', text: "What's Next", level: 2 },
    ],
  },
  'balance-coding-life': {
    title: '5 Principles to Balance Coding & Life',
    date: '2026-06-10',
    category: 'Indie Mindset',
    readTime: '5 min',
    excerpt: "Indie devs are prone to burnout. I've developed a rhythm that boosts both productivity and well-being.",
    headings: [
      { id: 'why-balance-matters', text: 'Why Balance Matters', level: 2 },
      { id: 'principle-1', text: 'Principle 1: Time Boxing', level: 2 },
      { id: 'principle-2', text: 'Principle 2: Physical First', level: 2 },
      { id: 'principle-3', text: 'Principle 3: Deep Work Mornings', level: 2 },
      { id: 'principle-4', text: 'Principle 4: No-Code Evenings', level: 2 },
      { id: 'principle-5', text: 'Principle 5: Weekly Review', level: 2 },
    ],
  },
  'launch-day-3-users': {
    title: 'What I Learned on Launch Day (with 3 users)',
    date: '2026-06-05',
    category: 'Product & Business',
    readTime: '6 min',
    excerpt: 'The excitement of shipping, followed by the silence of a ghost town.',
    headings: [
      { id: 'the-build-up', text: 'The Build Up', level: 2 },
      { id: 'pressing-launch', text: 'Pressing Launch', level: 2 },
      { id: '3-users', text: 'Those 3 Users', level: 3 },
      { id: 'the-crash', text: 'The Crash After', level: 2 },
      { id: 'what-i-changed', text: 'What I Changed', level: 2 },
    ],
  },
  'indie-dev-toolkit-2026': {
    title: 'Essential Indie Dev Toolkit (2026)',
    date: '2026-05-28',
    category: 'Tools & Workflow',
    readTime: '4 min',
    excerpt: 'From editor to analytics, design to deployment. My curated stack for 2026.',
    headings: [
      { id: 'editor', text: 'Editor & IDE', level: 2 },
      { id: 'frontend-stack', text: 'Frontend Stack', level: 2 },
      { id: 'backend-infra', text: 'Backend & Infra', level: 2 },
      { id: 'design-tools', text: 'Design Tools', level: 3 },
      { id: 'analytics', text: 'Analytics & Monitoring', level: 2 },
    ],
  },
}

const postData = computed(() => {
  if (pending.value) return null
  if (apiPost.value) return apiPost.value
  return demoPosts[slug] || null
})

// Set TOC when post data is available
watch(postData, (post) => {
  if (post?.headings) {
    setToc(post.headings)
  }
}, { immediate: true })

// Clear TOC when leaving
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
