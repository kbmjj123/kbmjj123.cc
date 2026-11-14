<template>
  <section class="blog-page">
    <!-- Hero -->
    <header class="blog-hero">
      <div class="badge"><span class="dot"></span> ✦ INDIE DEV LOG / ARTICLES</div>
      <h1 class="blog-hero-title">The Blog</h1>
      <p class="blog-hero-sub">
        Field notes from building web products, browser-first tools, and the occasional
        failed experiment. Product decisions, technical trade-offs, SEO, and what actually
        shipped — written as I learn it.
      </p>
      <div class="blog-hero-meta">
        <span><b>{{ postCount }}</b> POSTS</span>
        <span class="dot-sep">·</span>
        <span>SINCE 2026</span>
        <span class="dot-sep">·</span>
        <a href="/feed.xml" class="rss-link">RSS ↗</a>
      </div>
    </header>

    <!-- Category chips -->
    <nav class="chips" aria-label="Filter posts by category">
      <NuxtLink to="/blog" class="chip" :class="{ active: !activeCategory }">All</NuxtLink>
      <NuxtLink
        v-for="cat in categories"
        :key="cat.slug"
        :to="{ path: '/blog', query: { category: cat.slug } }"
        class="chip"
        :class="{ active: activeCategory === cat.slug }"
      >{{ cat.name }}</NuxtLink>
    </nav>

    <!-- Full post list -->
    <PostList variant="full" />
  </section>
</template>

<script setup lang="ts">
import categoriesData from '~/data/categories.json'
import { usePosts } from '~/composables/usePosts'

const route = useRoute()
const { allPosts } = usePosts()

const postCount = computed(() => allPosts.value.length)
const activeCategory = computed(() => route.query.category as string | undefined)
const categories = categoriesData as { slug: string; name: string }[]

usePageSeo({
  title: 'Blog',
  description: 'Indie developer blog — product decisions, technical trade-offs, SEO, deployment, and lessons from real projects.',
  template: 'prefix',
})
</script>

<style scoped>
.blog-page { display: flex; flex-direction: column; }

/* Hero */
.blog-hero {
  margin-top: 36px;
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  border-left: 3px solid var(--accent-green);
  padding: 30px 32px; position: relative;
}
.blog-hero::before {
  content: "◆"; color: var(--accent-green); font-size: 8px;
  position: absolute; top: -6px; left: 16px; background: var(--bg-card); padding: 0 5px;
}
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-pixel); font-size: 9px; color: var(--accent-gold);
  letter-spacing: 0.5px;
}
.badge .dot { width: 6px; height: 6px; background: var(--accent-green); box-shadow: 0 0 8px var(--accent-green); animation: pixelBlink 1.6s infinite; }
.blog-hero-title { font-family: var(--font-pixel); font-size: 24px; margin: 14px 0; color: var(--text-primary); font-weight: 400; }
.blog-hero-sub { font-size: 15px; color: var(--text-secondary); line-height: 1.9; max-width: 640px; margin-bottom: 18px; }
.blog-hero-meta { display: flex; gap: 12px; align-items: center; font-family: var(--font-pixel); font-size: 8px; color: var(--text-muted); flex-wrap: wrap; }
.blog-hero-meta b { color: var(--accent-green); }
.blog-hero-meta .dot-sep { color: var(--border-pixel); }
.rss-link { color: var(--accent-green); text-decoration: none; transition: color 0.15s; }
.rss-link:hover { color: var(--accent-gold); }

/* Category chips */
.chips { display: flex; gap: 8px; flex-wrap: wrap; margin: 26px 0 22px; }
.chip {
  font-family: var(--font-pixel); font-size: 8px; color: var(--text-muted);
  background: var(--bg-deep); border: 1px solid var(--border-pixel);
  padding: 8px 13px; text-decoration: none; transition: all 0.15s;
}
.chip:hover { color: var(--accent-green); border-color: var(--accent-green); }
.chip.active { color: var(--accent-green); border-color: var(--accent-green); background: rgba(74,222,128,0.06); }

@media (max-width: 480px) {
  .blog-hero { padding: 20px 18px; }
  .blog-hero-title { font-size: 17px; }
  .blog-hero-sub { font-size: 14px; }
  .badge { font-size: 7px; }
}
</style>
