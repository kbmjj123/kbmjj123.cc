<template>
  <article v-if="study" class="case-detail" itemscope itemtype="https://schema.org/TechArticle">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/" class="crumb-link">Home</NuxtLink>
      <span class="crumb-sep">/</span>
      <NuxtLink to="/projects" class="crumb-link">Projects</NuxtLink>
      <span class="crumb-sep">/</span>
      <span class="crumb-current">{{ study.project }}</span>
    </nav>

    <div class="badge"><span class="dot"></span> CASE STUDY · {{ study.project.toUpperCase() }}</div>
    <h1 class="case-title" itemprop="headline">{{ study.title }}</h1>
    <p class="case-value">{{ study.value }}</p>

    <!-- Entry links -->
    <div class="case-links">
      <a v-for="link in study.links" :key="link.label" :href="link.url" class="btn" :class="link.label.toLowerCase().includes('demo') ? 'btn-primary' : 'btn-outline'" target="_blank" rel="noopener noreferrer">
        {{ link.label }} ↗
      </a>
    </div>

    <!-- Screenshot -->
    <figure v-if="study.screenshot" class="case-figure">
      <img :src="study.screenshot" :alt="`${study.project} screenshot`" width="1280" height="800" decoding="async" />
    </figure>

    <!-- Author byline -->
    <div class="byline" itemprop="author" itemscope itemtype="https://schema.org/Person">
      <img class="byline-avatar" src="/images/site/me.webp" alt="kbmjj123" width="48" height="48" />
      <div>
        <div class="byline-name" itemprop="name">kbmjj123 · Indie Developer</div>
        <div class="byline-sub">
          Case study · <NuxtLink to="/about">About the author</NuxtLink> ·
          <a href="https://github.com/kbmjj123" target="_blank" rel="noopener noreferrer" itemprop="sameAs">github.com/kbmjj123</a>
        </div>
      </div>
    </div>

    <!-- Body: markdown sections rendered through ContentRenderer -->
    <div class="case-body markdown-content" itemprop="articleBody">
      <ContentRenderer v-if="study.body && typeof study.body === 'object'" :value="{ body: study.body }" />
    </div>

    <!-- Try it -->
    <div class="try-box">
      <h3>▶ Try it</h3>
      <div class="links">
        <a v-for="link in study.links" :key="link.label" :href="link.url" class="btn" :class="link.label.toLowerCase().includes('demo') ? 'btn-primary' : 'btn-outline'" target="_blank" rel="noopener noreferrer">
          {{ link.label }} ↗
        </a>
      </div>
    </div>

    <!-- Schema hints (debug, hidden) -->
    <link itemprop="url" :href="`https://kbmjj123.cc/projects/${study.slug}`" />
  </article>

  <div v-else class="case-missing">
    <h1>Case study not found</h1>
    <p>This project’s case study is not published yet.</p>
    <NuxtLink to="/projects" class="btn btn-ghost">← Back to projects</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { CaseStudyItem } from '~/composables/useProjects'

const route = useRoute()
const slug = route.params.slug as string

// Await the content query so the page is populated during SSG prerender
const { data: rawStudy } = await useAsyncData(`case-study-${slug}`, () =>
  queryCollection('projects').path(`/projects/${slug}`).first()
)

const study = computed<CaseStudyItem | null>(() => {
  const p: any = rawStudy.value
  if (!p) return null
  const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
  return {
    slug: (p.path || '').replace('/projects/', ''),
    title: p.title || '',
    description: p.description || '',
    project: meta.project || '',
    status: meta.status || 'ready',
    value: meta.value || '',
    screenshot: meta.screenshot || '',
    links: Array.isArray(meta.links) ? meta.links : [],
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    body: p.body || null,
    date: meta.date || '',
  }
})

if (!study.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found' })
}

const s = computed(() => study.value!)

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: 'Projects', item: '/projects' },
      { name: s.value.project || s.value.title },
    ],
  }),
  defineArticle({
    '@type': 'TechArticle',
    headline: s.value.title,
    description: s.value.description,
    ...(s.value.date ? { datePublished: s.value.date } : {}),
  }),
  defineSoftwareApp({
    name: s.value.project,
    description: s.value.value,
    applicationCategory: 'DeveloperApplication',
    url: s.value.links.find(l => l.label.toLowerCase().includes('demo'))?.url || `https://kbmjj123.cc/projects/${s.value.slug}`,
    ...(s.value.screenshot ? { screenshot: `https://kbmjj123.cc${s.value.screenshot}` } : {}),
  }),
])

usePageSeo(() => ({
  title: s.value.title,
  description: s.value.description,
  image: s.value.screenshot || undefined,
}))
</script>

<style scoped>
.case-detail {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
  min-width: 0;
}
.case-detail::before {
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
.case-title { font-family: var(--font-pixel); font-size: clamp(15px, 2vw, 20px); font-weight: 400; color: var(--text-primary); margin-bottom: 14px; line-height: 1.7; }
.case-value { font-size: 16px; color: var(--text-secondary); line-height: 1.9; margin-bottom: 22px; max-width: 760px; }
.case-links { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
.btn { font-family: var(--font-pixel); font-size: 9px; padding: 10px 16px; text-decoration: none; display: inline-flex; align-items: center; transition: all 0.15s; }
.btn-primary { color: var(--bg-deep); background: var(--accent-green); border: 1.5px solid var(--accent-green); }
.btn-primary:hover { filter: brightness(1.1); }
.btn-outline { color: var(--text-secondary); border: 1.5px solid var(--border-pixel); }
.btn-outline:hover { color: var(--accent-green); border-color: var(--accent-green); }
.btn-ghost { color: var(--accent-gold); border: 1.5px solid var(--accent-gold); }
.case-figure { border: 1.5px solid var(--border-pixel); overflow: hidden; margin-bottom: 10px; }
.case-figure img { width: 100%; height: auto; display: block; object-fit: cover; object-position: top; }
.byline { display: flex; align-items: center; gap: 14px; border: 1px solid var(--border-pixel); background: rgba(255, 255, 255, 0.02); padding: 14px 16px; margin: 24px 0 28px; }
.byline-avatar { width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--accent-green); object-fit: cover; }
.byline-name { font-family: var(--font-pixel); font-size: 9px; color: var(--accent-green); }
.byline-sub { font-size: 12px; color: var(--text-secondary); margin-top: 5px; }
.byline-sub a { color: var(--accent-green); text-decoration: none; }
.byline-sub a:hover { text-decoration: underline; }
.case-body { font-size: 15px; color: var(--text-secondary); line-height: 1.95; overflow-wrap: break-word; }
.case-body :deep(img), .case-body :deep(pre) { max-width: 100%; height: auto; }
.try-box { border: 1.5px dashed var(--accent-green); background: rgba(74, 222, 128, 0.03); padding: 20px; margin-top: 32px; }
.try-box h3 { font-family: var(--font-pixel); font-size: 11px; color: var(--accent-green); margin-bottom: 14px; font-weight: 400; }
.links { display: flex; gap: 10px; flex-wrap: wrap; }
.case-missing { background-color: rgba(255, 255, 255, 0.02); border: 1.5px solid var(--border-pixel); padding: 28px 30px; }
.case-missing h1 { font-family: var(--font-pixel); font-size: 16px; margin-bottom: 14px; }
.case-missing p { color: var(--text-secondary); margin-bottom: 18px; }

@media (max-width: 480px) {
  .case-detail { padding: 16px 14px 18px; }
}
</style>
