<template>
  <section class="post-list">
    <article v-for="(post, i) in posts" :key="post.slug" class="post-item" :style="{ animationDelay: `${0.1 + i * 0.1}s` }">
      <h2 class="post-title">
        <NuxtLink :to="`/${post.slug}`">{{ post.title }}</NuxtLink>
      </h2>
      <div class="post-meta">
        <span class="date">{{ post.date }}</span>
        <span class="category">{{ post.category }}</span>
        <span style="color:var(--text-muted);">⌨️ {{ post.readTime }}</span>
      </div>
      <p class="post-excerpt">{{ post.excerpt }}</p>
      <NuxtLink :to="`/${post.slug}`" class="btn-read">Read More</NuxtLink>
    </article>
  </section>
</template>

<script setup lang="ts">
usePageSeo({ title: 'Home' })

interface Post {
  slug: string
  title: string
  date: string
  category: string
  readTime: string
  excerpt: string
}

const posts: Post[] = [
  {
    slug: 'year-one-as-indie',
    title: 'Year One as Indie: From Zero to MVP',
    date: '2026-06-14',
    category: 'Dev Practice',
    readTime: '8 min',
    excerpt: 'Quitting the 9-to-5 to build my own products. The real struggles with product-market fit, tech choices, and mental health. Honest reflections for fellow builders.',
  },
  {
    slug: 'balance-coding-life',
    title: '5 Principles to Balance Coding & Life',
    date: '2026-06-10',
    category: 'Indie Mindset',
    readTime: '5 min',
    excerpt: 'Indie devs are prone to burnout. I\'ve developed a rhythm that boosts both productivity and well-being. Here\'s my practical framework to stay sustainable.',
  },
  {
    slug: 'launch-day-3-users',
    title: 'What I Learned on Launch Day (with 3 users)',
    date: '2026-06-05',
    category: 'Product & Business',
    readTime: '6 min',
    excerpt: 'The excitement of shipping, followed by the silence of a ghost town. But those first 3 users taught me more about true product value than any course ever did.',
  },
  {
    slug: 'indie-dev-toolkit-2026',
    title: 'Essential Indie Dev Toolkit (2026)',
    date: '2026-05-28',
    category: 'Tools & Workflow',
    readTime: '4 min',
    excerpt: 'From editor to analytics, design to deployment. My carefully curated stack that maximizes velocity without sacrificing quality. Updated for 2026.',
  },
]
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
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
}
.post-item:hover {
  border-color: var(--accent-green);
  box-shadow: 0 4px 16px rgba(74,222,128,0.04);
  transform: translateY(-2px);
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
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 10px;
  line-height: 1.6;
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
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.8;
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
</style>
