<template>
  <section v-if="posts.length > 0" class="related-section">
    <h2 class="related-title">📖 Related Reading</h2>

    <div class="related-grid">
      <NuxtLink
        v-for="post in posts"
        :key="post.slug"
        :to="`/${post.slug}`"
        class="related-card"
      >
        <h3 class="related-card-title">{{ post.title }}</h3>
        <div class="related-card-meta">
          <span class="related-category">{{ post.category }}</span>
          <span class="related-read">⌨️ {{ post.readTime }}</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
interface RelatedPost {
  slug: string
  title: string
  category: string
  readTime: string
}

defineProps<{
  posts: RelatedPost[]
}>()
</script>

<style scoped>
.related-section {
  margin-top: 36px;
  padding-top: 10px;
  position: relative;
}
.related-section::before {
  content: "◆";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 0;
  background: var(--bg-card);
  padding: 0 6px 0 2px;
}
.related-title {
  font-family: var(--font-pixel);
  font-size: 13px;
  color: var(--accent-gold);
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}
.related-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.related-card {
  display: block;
  border: 1.5px solid var(--border-pixel);
  padding: 14px 16px;
  text-decoration: none;
  background-color: rgba(255,255,255,0.015);
  transition: all 0.15s ease;
}
.related-card:hover {
  border-color: var(--accent-green);
  background-color: rgba(74,222,128,0.04);
}
.related-card-title {
  font-family: var(--font-pixel);
  font-size: 11px;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 8px;
  transition: color 0.15s;
}
.related-card:hover .related-card-title {
  color: var(--accent-green);
}
.related-card-meta {
  font-family: var(--font-pixel);
  font-size: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
}
.related-category {
  color: var(--accent-gold);
}
.related-read {
  color: var(--text-muted);
}

@media (max-width: 860px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .related-section { margin-top: 24px; }
  .related-card { padding: 12px 14px; }
  .related-card-title { font-size: 10px; }
}
</style>
