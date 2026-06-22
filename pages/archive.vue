<template>
  <section class="archive-content">
    <h1>📚 Archive</h1>
    <div class="subhead">All posts, sorted by year</div>

    <div v-for="year in archive" :key="year.year" class="archive-year">
      <h2>{{ year.year }}</h2>
      <div v-for="post in year.posts" :key="post.title" class="archive-item">
        <span class="date">{{ post.date }}</span>
        <span class="title"><NuxtLink :to="post.slug">{{ post.title }}</NuxtLink></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
usePageSeo({ title: 'Archive', description: 'Browse all posts by year — archive of published articles.' })

const archive = [
  {
    year: '2026',
    posts: [
      { date: '06-14', title: 'Year One as Indie: From Zero to MVP', slug: '/year-one-as-indie' },
      { date: '06-10', title: '5 Principles to Balance Coding & Life', slug: '#' },
      { date: '06-05', title: 'What I Learned on Launch Day (with 3 users)', slug: '#' },
      { date: '05-28', title: 'Essential Indie Dev Toolkit (2026)', slug: '#' },
    ],
  },
  {
    year: '2025',
    posts: [
      { date: '12-12', title: 'My First Year as a Full-Time Indie', slug: '#' },
      { date: '09-03', title: 'Building a SaaS with Nuxt and Cloudflare', slug: '#' },
      { date: '05-20', title: 'Why I Ditched Vercel for Cloudflare Pages', slug: '#' },
    ],
  },
  {
    year: '2024',
    posts: [
      { date: '11-01', title: 'The Beginning: Quitting the 9-to-5', slug: '#' },
    ],
  },
]
</script>

<style scoped>
.archive-content {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
}
.archive-content::before {
  content: "◆";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 14px;
  background: var(--bg-card);
  padding: 0 4px;
}
.archive-content h1 {
  font-family: var(--font-pixel);
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 6px;
}
.subhead {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 22px;
  border-bottom: 1px dotted var(--border-pixel);
  padding-bottom: 12px;
}
.archive-year { margin-bottom: 28px; }
.archive-year h2 {
  font-family: var(--font-pixel);
  font-size: 14px;
  color: var(--accent-gold);
  margin-bottom: 12px;
  border-left: 3px solid var(--accent-green);
  padding-left: 12px;
}
.archive-item {
  display: flex;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px dotted var(--border-pixel);
  transition: background 0.1s;
}
.archive-item:hover { background: rgba(74,222,128,0.03); }
.archive-item .date {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--text-muted);
  min-width: 80px;
  flex-shrink: 0;
}
.archive-item .title a {
  font-size: 15px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}
.archive-item .title a:hover { color: var(--accent-green); }

@media (max-width: 860px) {
  .archive-content h1 { font-size: 17px; }
}
@media (max-width: 480px) {
  .archive-content { padding: 16px 14px 18px; }
  .archive-item { flex-direction: column; gap: 2px; }
  .archive-item .date { min-width: auto; }
}
</style>
