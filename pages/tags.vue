<template>
  <section class="page-content">
    <h1>🏷️ Tags</h1>
    <div class="subhead">All tags used across posts</div>

    <div class="tag-cloud-page">
      <NuxtLink
        v-for="tag in tags"
        :key="tag"
        :to="`/tag/${tag.replace('#', '')}`"
        class="tag-item"
      >
        {{ tag }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import tags from '~/data/tags.json'

usePageSeo({ title: 'Tags' })
</script>

<style scoped>
.page-content {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
}
.page-content::before {
  content: "◆";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 14px;
  background: var(--bg-card);
  padding: 0 4px;
}
.page-content h1 {
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
.tag-cloud-page {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag-item {
  font-family: var(--font-pixel);
  font-size: 9px;
  color: var(--text-muted);
  background: var(--bg-deep);
  border: 1px solid var(--border-pixel);
  padding: 5px 14px;
  text-decoration: none;
  transition: all 0.15s ease;
  letter-spacing: 0.3px;
}
.tag-item:hover {
  color: var(--accent-green);
  border-color: var(--accent-green);
  background: rgba(74,222,128,0.04);
}
@media (max-width: 480px) {
  .page-content { padding: 16px 14px 18px; }
  .tag-item { font-size: 8px; padding: 4px 10px; }
}
</style>
