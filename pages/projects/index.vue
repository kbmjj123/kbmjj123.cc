<template>
  <div class="projects-page" itemscope itemtype="https://schema.org/CollectionPage">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/" class="crumb-link">Home</NuxtLink>
      <span class="crumb-sep">/</span>
      <span class="crumb-current">Projects</span>
    </nav>

    <div class="badge"><span class="dot"></span> SELECTED WORK · CASE STUDIES</div>
    <h1 class="page-title">Projects &amp; case studies</h1>
    <p class="page-lede">
      Products, open-source components, and the engineering decisions behind them.
      Each case study documents the problem, the approach, real results, and where you can try it yourself.
    </p>

    <!-- Status filter (client-side) -->
    <div class="filters" role="group" aria-label="Filter projects">
      <button
        v-for="f in filters"
        :key="f.key"
        class="filter"
        :class="{ active: activeFilter === f.key }"
        :aria-pressed="activeFilter === f.key"
        @click="activeFilter = f.key"
      >{{ f.label }}</button>
    </div>

    <!-- Case-study cards (ready) -->
    <section v-if="readyList.length" class="block">
      <div class="block-head"><h2 class="block-title">Case studies</h2><span class="block-note">{{ readyList.length }} published</span></div>
      <div class="cards">
        <article v-for="(item, i) in readyList" :key="item.slug" class="card" :class="{ 'card-featured': i === 0 }">
          <NuxtLink :to="`/projects/${item.slug}`" class="card-media" :aria-label="`Read case study: ${item.project}`">
            <img v-if="item.screenshot" :src="item.screenshot" :alt="`${item.project} screenshot`" width="1280" height="800" loading="lazy" decoding="async" />
          </NuxtLink>
          <div class="card-body">
            <div class="card-status">● CASE STUDY</div>
            <h3 class="card-title">{{ item.project }}</h3>
            <p class="card-desc">{{ item.value }}</p>
            <div class="tags"><span v-for="t in item.tags" :key="t">{{ t }}</span></div>
            <NuxtLink :to="`/projects/${item.slug}`" class="read-link">Read case study →</NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <!-- All projects status table -->
    <section class="block">
      <div class="block-head"><h2 class="block-title">All projects</h2><span class="block-note">{{ allProjects.length }} total</span></div>
      <div class="status-list">
        <div v-for="p in visibleProjects" :key="p.name" class="status-row">
          <span class="status-name">{{ p.name }}</span>
          <span v-if="p.caseStudy" class="status-pill ready">● CASE STUDY READY</span>
          <span v-else class="status-pill soon">◆ COMING SOON</span>
          <NuxtLink v-if="p.caseStudy" :to="`/projects/${p.caseStudy}`" class="status-link">Read case study →</NuxtLink>
          <span v-else class="status-link muted">Case study in progress</span>
        </div>
      </div>
      <div class="note">
        <b>WHY</b> 每个项目都有独立案例页，可被引用的同时也能被搜索引擎单独收录。尚未制作的案例页用 “coming soon” 状态占位，后续按各项目 GitHub 实际情况陆续补齐。
      </div>
    </section>

    <div class="bottom-cta">
      <span>Build logs &amp; field notes →</span>
      <NuxtLink to="/blog" class="btn btn-ghost">Read the Blog</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { projects } from '~/data/projects'

const { caseStudies } = useCaseStudies()
const readyList = computed(() => caseStudies.value.filter(c => c.status === 'ready'))

const filters = [
  { key: 'all', label: `All projects (${projects.length})` },
  { key: 'ready', label: `Case study ready (${readyList.value.length})` },
  { key: 'soon', label: `Coming soon (${projects.length - readyList.value.length})` },
]
const activeFilter = ref('all')

const allProjects = computed(() => projects)
const visibleProjects = computed(() => {
  if (activeFilter.value === 'ready') return allProjects.value.filter(p => !!p.caseStudy)
  if (activeFilter.value === 'soon') return allProjects.value.filter(p => !p.caseStudy)
  return allProjects.value
})

usePageSeo({
  title: 'Projects & Case Studies',
  description: 'Selected products and case studies by kbmjj123 — browser-based, privacy-first developer tools with the problems, decisions and results behind them.',
})
</script>

<style scoped>
.projects-page {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
  min-width: 0;
}
.projects-page::before {
  content: "\25C6";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 14px;
  background: var(--bg-card);
  padding: 0 4px;
}
.breadcrumb { font-family: var(--font-pixel); font-size: 9px; margin-bottom: 18px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.crumb-link { color: var(--text-muted); text-decoration: none; }
.crumb-link:hover { color: var(--accent-green); }
.crumb-sep { color: var(--text-muted); font-size: 7px; }
.crumb-current { color: var(--text-secondary); }
.badge { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-pixel); font-size: 9px; color: var(--accent-gold); margin-bottom: 14px; letter-spacing: 0.5px; }
.badge .dot { width: 6px; height: 6px; background: var(--accent-green); box-shadow: 0 0 8px var(--accent-green); }
.page-title { font-family: var(--font-pixel); font-size: clamp(15px, 2.2vw, 20px); font-weight: 400; color: var(--text-primary); margin-bottom: 14px; line-height: 1.7; }
.page-lede { font-size: 15px; color: var(--text-secondary); line-height: 1.9; max-width: 720px; margin-bottom: 22px; }

.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
.filter { font-family: var(--font-pixel); font-size: 8px; color: var(--text-muted); background: var(--bg-deep); border: 1px solid var(--border-pixel); padding: 8px 12px; cursor: pointer; transition: all 0.15s; }
.filter:hover { color: var(--text-secondary); border-color: var(--border-pixel); }
.filter.active { color: var(--bg-deep); background: var(--accent-green); border-color: var(--accent-green); }

.block { margin-top: 34px; }
.block-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--border-pixel); padding-bottom: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.block-title { font-family: var(--font-pixel); font-size: 13px; font-weight: 400; }
.block-title::before { content: "▸ "; color: var(--accent-green); }
.block-note { font-family: var(--font-pixel); font-size: 8px; color: var(--text-muted); }

.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 18px; }
.card { background: var(--bg-deep); border: 1.5px solid var(--border-pixel); display: flex; flex-direction: column; min-width: 0; transition: all 0.2s ease; }
.card:hover { border-color: var(--accent-green); transform: translateY(-3px); }
.card-featured { border-color: var(--accent-green); }
.card-media { display: block; border-bottom: 1px solid var(--border-pixel); aspect-ratio: 16/10; overflow: hidden; }
.card-media img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.card-body { padding: 18px; display: flex; flex-direction: column; flex: 1; }
.card-status { font-family: var(--font-pixel); font-size: 8px; color: var(--accent-green); margin-bottom: 10px; }
.card-title { font-family: var(--font-pixel); font-size: 12px; font-weight: 400; color: var(--text-primary); margin-bottom: 12px; line-height: 1.6; }
.card-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 14px; flex: 1; }
.tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
.tags span { font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border-pixel); padding: 3px 8px; }
.read-link { font-family: var(--font-pixel); font-size: 9px; color: var(--accent-gold); text-decoration: none; }
.read-link:hover { color: var(--accent-green); }

.status-list { border: 1.5px solid var(--border-pixel); background: rgba(255, 255, 255, 0.02); }
.status-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border-pixel); font-size: 14px; }
.status-row:last-child { border-bottom: 0; }
.status-name { font-family: var(--font-pixel); font-size: 9px; color: var(--text-primary); min-width: 200px; }
.status-pill { font-family: var(--font-pixel); font-size: 7px; padding: 3px 8px; border: 1px solid; letter-spacing: 0.5px; }
.status-pill.ready { color: var(--accent-green); border-color: var(--accent-green); background: rgba(74, 222, 128, 0.06); }
.status-pill.soon { color: var(--text-muted); border: 1px dashed var(--border-pixel); }
.status-link { font-family: var(--font-pixel); font-size: 8px; color: var(--accent-green); margin-left: auto; text-decoration: none; }
.status-link:hover { color: var(--accent-gold); }
.status-link.muted { color: var(--text-muted); }
.note { border: 1px dashed var(--accent-blue); background: rgba(96, 165, 250, 0.04); color: var(--text-secondary); font-size: 12px; padding: 10px 12px; line-height: 1.7; margin-top: 14px; }
.note b { color: var(--accent-blue); font-family: var(--font-pixel); font-size: 8px; }

.bottom-cta { border: 1.5px dashed var(--accent-green); background: rgba(74, 222, 128, 0.03); padding: 18px 20px; margin-top: 34px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.bottom-cta span { font-family: var(--font-pixel); font-size: 10px; color: var(--text-primary); }
.btn { font-family: var(--font-pixel); font-size: 9px; padding: 10px 18px; text-decoration: none; display: inline-flex; align-items: center; }
.btn-ghost { color: var(--accent-gold); border: 1.5px solid var(--accent-gold); }

@media (max-width: 480px) {
  .projects-page { padding: 16px 14px 18px; }
  .status-name { min-width: auto; }
}
</style>
