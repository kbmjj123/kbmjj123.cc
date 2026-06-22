<template>
  <div style="display:flex;flex-direction:column;gap:28px;">
    <div class="pixel-widget">
      <h2 class="pixel-widget-title">📋 On this page</h2>
      <nav v-if="toc.length > 0" class="pixel-toc">
        <a
          v-for="item in toc"
          :key="item.id"
          :href="`#${item.id}`"
          class="pixel-toc-link"
          :class="{ 'toc-h3': item.level === 3, 'toc-active': activeId === item.id }"
          @click.prevent="scrollTo(item.id)"
        >{{ item.text }}</a>
      </nav>
      <p v-else style="font-family:var(--font-pixel);font-size:8px;color:var(--text-muted);padding:8px 0;">No headings found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TocItem } from '~/composables/useToc'

const { toc } = useToc()
const activeId = ref('')

// Scroll to heading with sticky header offset
function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const headerH = 80 // sticky header height
  const top = el.getBoundingClientRect().top + window.scrollY - headerH
  window.scrollTo({ top, behavior: 'smooth' })
  activeId.value = id
}

// Observe headings and highlight current one
let observer: IntersectionObserver | null = null

onMounted(() => {
  const ids = toc.value.map(t => t.id)
  if (ids.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
          break
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px' }
  )

  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer?.observe(el)
  })
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.pixel-widget {
  background-color: rgba(255,255,255,0.015);
  border: 1.5px solid var(--border-pixel);
  padding: 18px 20px 20px;
}
.pixel-widget-title {
  font-family: var(--font-pixel);
  font-size: 11px;
  color: var(--accent-gold);
  border-bottom: 1px solid var(--border-pixel);
  padding-bottom: 8px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}
.pixel-widget-title::before {
  content: "▸";
  color: var(--accent-green);
  font-size: 12px;
}
.pixel-toc {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.pixel-toc-link {
  display: block;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 5px 0 5px 12px;
  border-left: 2px solid var(--border-pixel);
  transition: all 0.15s ease;
  line-height: 1.6;
}
.pixel-toc-link:hover {
  color: var(--accent-green);
  border-left-color: var(--accent-green);
}
.pixel-toc-link.toc-h3 {
  padding-left: 22px;
  font-size: 7px;
  color: var(--text-muted);
}
.pixel-toc-link.toc-active {
  color: var(--accent-green);
  border-left-color: var(--accent-green);
  background: rgba(74,222,128,0.04);
}
</style>
