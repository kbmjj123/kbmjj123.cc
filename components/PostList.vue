<template>
  <section class="post-list">
    <h2 v-if="showHeader" class="sr-only">Latest Posts</h2>

    <!-- Active filter indicator -->
    <div v-if="showFilter && activeFilter" class="filter-bar">
      <span class="filter-label">
        {{ activeFilter.label }}: <strong>{{ activeFilter.value }}</strong>
      </span>
      <NuxtLink to="/blog" class="filter-clear">✕ Clear</NuxtLink>
    </div>

    <!-- Latest Videos — hand-maintained in data/videos.json, hidden while filtering -->
    <section v-if="showVideos && latestVideos.length && !hasFilter" class="latest-videos" aria-labelledby="latest-videos-title">
      <div class="latest-videos-head">
        <h2 id="latest-videos-title" class="latest-videos-title">
          <span aria-hidden="true">▶</span> Latest Videos
        </h2>
        <NuxtLink to="/videos" class="latest-videos-all">All videos →</NuxtLink>
      </div>
      <div class="latest-videos-grid">
        <VideoCard
          v-for="(v, i) in latestVideos"
          :key="v.id"
          :video="v"
          :style="{ animationDelay: `${i * 0.08}s` }"
        />
      </div>
    </section>

    <LoadingState v-if="pending" />

    <div v-if="showEmpty && displayPosts.length === 0 && !pending" class="empty-filter">
      <p class="empty-text">No posts match this filter.</p>
      <div class="empty-action"><NuxtLink to="/blog" class="empty-link">← All posts</NuxtLink></div>
    </div>

    <!-- Compact variant: homepage "Latest Writing" teaser cards -->
    <template v-if="variant === 'compact'">
      <NuxtLink
        v-for="(post, i) in displayPosts"
        :key="post.slug"
        :to="`/${post.slug}`"
        class="wcard"
        :style="{ animationDelay: `${0.1 + i * 0.1}s` }"
      >
        <div class="wcard-cat">{{ formatCategory(post.category) }}</div>
        <h3 class="wcard-title">{{ post.title }}</h3>
        <div class="wcard-meta">
          <span>{{ post.date }}</span><span>⌨ {{ post.readTime }}</span>
        </div>
      </NuxtLink>
    </template>

    <!-- Full variant: blog list cards -->
    <template v-else>
      <NuxtLink
        v-for="(post, i) in displayPosts"
        :key="post.slug"
        :to="`/${post.slug}`"
        class="post-card-link"
        itemprop="url"
        :style="{ animationDelay: `${0.1 + i * 0.1}s` }"
      >
        <article class="post-item" itemscope itemtype="https://schema.org/BlogPosting">
          <h3 class="post-title" itemprop="headline">{{ post.title }}</h3>
          <div class="post-meta">
            <time :datetime="post.isoDate" class="date">{{ post.date }}</time>
            <span class="category" itemprop="about">{{ formatCategory(post.category) }}</span>
            <span class="read">⌨️ {{ post.readTime }}</span>
          </div>
          <p class="post-excerpt" itemprop="description">{{ post.excerpt }}</p>
          <span class="btn-read">Read More</span>
          <meta itemprop="author" content="kbmjj123" />
          <meta v-if="post.isoDate" :content="post.isoDate" itemprop="datePublished" />
        </article>
      </NuxtLink>
    </template>
  </section>
</template>

<script setup lang="ts">
import { useVideos } from '~/composables/useVideos'
import { usePosts } from '~/composables/usePosts'

const props = withDefaults(defineProps<{
  /** 'full' = blog list cards, 'compact' = homepage teaser cards. */
  variant?: 'full' | 'compact'
  /** Max number of posts to show. 0 = no limit (show all). */
  limit?: number
  /** Apply category/tag filters from the URL query. */
  applyFilter?: boolean
  /** Show the active-filter bar with a Clear link. */
  showFilter?: boolean
  /** Show the Latest Videos strip. */
  showVideos?: boolean
  /** Show the empty state when nothing matches. */
  showEmpty?: boolean
  /** Render an sr-only "Latest Posts" heading for the feed. */
  showHeader?: boolean
}>(), {
  variant: 'full',
  limit: 0,
  applyFilter: true,
  showFilter: true,
  showVideos: true,
  showEmpty: true,
  showHeader: true,
})

const route = useRoute()
const { sortedPosts, pending } = usePosts()

const { latest } = useVideos()
const latestVideos = computed(() => latest.value.slice(0, 3))

const categoryFilter = computed(() => props.applyFilter ? route.query.category as string | undefined : undefined)
const tagFilter = computed(() => props.applyFilter ? route.query.tag as string | undefined : undefined)

const activeFilter = computed(() => {
  if (categoryFilter.value) return { label: 'Category', value: categoryFilter.value }
  if (tagFilter.value) return { label: 'Tag', value: `#${tagFilter.value}` }
  return null
})
const hasFilter = computed(() => !!activeFilter.value)

const filteredPosts = computed(() => {
  let result = sortedPosts.value
  if (categoryFilter.value) result = result.filter(p => p.categorySlug === categoryFilter.value)
  if (tagFilter.value) result = result.filter(p => p.tags.includes(`#${tagFilter.value}`))
  return result
})

const displayPosts = computed(() =>
  props.limit > 0 ? filteredPosts.value.slice(0, props.limit) : filteredPosts.value,
)

function formatCategory(raw: string): string {
  return (raw || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// Keywords meta (not auto-generated by @nuxtjs/seo)
const keywords = computed(() => {
  const cats = [...new Set(sortedPosts.value.map(p => p.category).filter(Boolean))]
  return cats.length > 0 ? cats.join(', ') : undefined
})
useHead(() => ({
  meta: keywords.value ? [{ name: 'keywords', content: keywords.value }] : [],
}))
</script>

<style scoped>
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
.post-list { display: flex; flex-direction: column; gap: 18px; }

/* filter bar */
.filter-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px;
  background: rgba(74,222,128,0.04);
  border: 1.5px solid var(--border-pixel);
  border-left: 3px solid var(--accent-green);
  margin-bottom: 4px;
}
.filter-label { font-family: var(--font-pixel); font-size: 9px; color: var(--text-muted); }
.filter-label strong { color: var(--accent-green); }
.filter-clear {
  font-family: var(--font-pixel); font-size: 8px; color: var(--accent-gold);
  text-decoration: none; border: 1px solid var(--accent-gold); padding: 4px 12px;
  transition: all 0.15s;
}
.filter-clear:hover { background: var(--accent-gold); color: var(--bg-deep); }

/* latest videos */
.latest-videos {
  background: rgba(255,255,255,0.015);
  border: 1.5px solid var(--border-pixel);
  border-left: 3px solid var(--accent-gold);
  padding: 18px 20px 20px;
  margin-bottom: 4px;
}
.latest-videos-head {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  border-bottom: 1px dashed var(--border-pixel); padding-bottom: 10px; margin-bottom: 16px;
}
.latest-videos-title { font-family: var(--font-pixel); font-size: 10px; color: var(--accent-gold); font-weight: 400; letter-spacing: 0.5px; }
.latest-videos-title span { color: var(--accent-green); }
.latest-videos-all { font-family: var(--font-pixel); font-size: 8px; color: var(--text-muted); text-decoration: none; transition: color 0.15s; }
.latest-videos-all:hover { color: var(--accent-green); }
.latest-videos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

/* empty */
.empty-filter { padding: 8px 0; }
.empty-text { font-family: var(--font-pixel); font-size: 10px; color: var(--text-muted); text-align: center; padding: 40px 20px; }
.empty-action { text-align: center; }
.empty-link { font-family: var(--font-pixel); font-size: 9px; color: var(--accent-green); border: 1px solid var(--accent-green); padding: 6px 18px; text-decoration: none; }

/* full cards */
.post-card-link {
  display: block; text-decoration: none; color: inherit;
  opacity: 0; transform: translateY(20px);
  animation: pixelFadeUp 0.5s ease forwards;
}
.post-item {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 24px 26px 22px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s;
  position: relative;
}
.post-item::before {
  content: "◆"; color: var(--accent-green); font-size: 8px;
  position: absolute; top: -6px; left: 16px; background: var(--bg-card); padding: 0 5px;
}
.post-card-link:hover .post-item {
  border-color: var(--accent-green);
  box-shadow: 0 4px 16px rgba(74,222,128,0.04);
  transform: translateY(-2px);
}
.post-card-link:hover .post-item .post-title { color: var(--accent-green); }
.post-card-link:hover .post-item .btn-read {
  background: var(--accent-green); color: var(--bg-deep);
  box-shadow: 4px 4px 0 rgba(74,222,128,0.15);
}
.post-title { font-family: var(--font-pixel); font-size: 14px; color: var(--text-primary); margin-bottom: 12px; line-height: 1.8; transition: color 0.15s; }
.post-meta {
  font-family: var(--font-pixel); font-size: 9px; color: var(--text-muted);
  display: flex; flex-wrap: wrap; gap: 14px 20px; margin-bottom: 12px;
  padding-bottom: 10px; border-bottom: 1px dotted var(--border-pixel);
  text-transform: uppercase;
}
.post-meta .category { color: var(--accent-gold); }
.post-meta .date::before { content: "📅 "; font-family: system-ui; font-size: 9px; }
.post-meta .category::before { content: "📂 "; font-family: system-ui; font-size: 9px; }
.post-excerpt { font-size: 15px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.9; }
.btn-read {
  display: inline-block; font-family: var(--font-pixel); font-size: 9px;
  color: var(--accent-green); background: transparent;
  border: 1.5px solid var(--accent-green); padding: 6px 16px;
  transition: all 0.15s ease; letter-spacing: 0.5px;
  box-shadow: 2px 2px 0 rgba(74,222,128,0.08);
}

/* compact cards (homepage teaser) */
.wcard {
  display: flex; flex-direction: column;
  background: var(--bg-deep);
  border: 1.5px solid var(--border-pixel);
  padding: 18px 18px 20px;
  text-decoration: none;
  transition: all 0.2s;
  opacity: 0; transform: translateY(20px);
  animation: pixelFadeUp 0.5s ease forwards;
}
.wcard:hover { border-color: var(--accent-green); transform: translateY(-3px); box-shadow: 0 6px 16px rgba(74,222,128,0.05); }
.wcard-cat { font-family: var(--font-pixel); font-size: 7px; color: var(--accent-gold); letter-spacing: 0.5px; margin-bottom: 12px; }
.wcard-title { font-family: var(--font-pixel); font-size: 11px; line-height: 1.9; color: var(--text-primary); margin-bottom: 14px; font-weight: 400; flex: 1; transition: color 0.15s; }
.wcard:hover .wcard-title { color: var(--accent-green); }
.wcard-meta {
  font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted);
  border-top: 1px dotted var(--border-pixel); padding-top: 12px;
  display: flex; justify-content: space-between;
}

@media (max-width: 480px) {
  .latest-videos-grid { grid-template-columns: 1fr; }
  .latest-videos-title { font-size: 9px; }
  .post-item { padding: 16px 14px 18px; }
  .post-title { font-size: 12px; }
  .post-excerpt { font-size: 14px; }
  .btn-read { font-size: 9px; padding: 4px 12px; }
  .wcard-title { font-size: 10px; }
}
</style>
