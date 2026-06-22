<template>
  <section class="page-content">
    <h1>📂 Categories</h1>
    <div class="subhead">Browse posts by category</div>

    <div class="category-grid">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.slug"
        :to="`/category/${cat.slug}`"
        class="category-card"
      >
        <span class="category-name">{{ cat.name }}</span>
        <span class="category-count">{{ cat.count }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import categories from '~/data/categories.json'

usePageSeo({ title: 'Categories' })
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
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.category-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: var(--bg-deep);
  border: 1.5px solid var(--border-pixel);
  text-decoration: none;
  transition: all 0.15s ease;
}
.category-card:hover {
  border-color: var(--accent-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74,222,128,0.05);
}
.category-name {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--text-secondary);
}
.category-card:hover .category-name {
  color: var(--accent-green);
}
.category-count {
  font-family: var(--font-pixel);
  font-size: 9px;
  color: var(--text-muted);
  background: var(--bg-card);
  padding: 2px 10px;
  border: 1px solid var(--border-pixel);
}
.category-card:hover .category-count {
  border-color: var(--accent-green);
  color: var(--accent-green);
}
@media (max-width: 600px) {
  .category-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .page-content { padding: 16px 14px 18px; }
  .page-content h1 { font-size: 16px; }
}
</style>
