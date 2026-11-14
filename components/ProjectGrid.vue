<template>
  <div class="pgrid">
    <!-- Featured flagship project -->
    <div
      v-if="featured"
      class="pfeatured"
      itemscope
      itemtype="https://schema.org/SoftwareApplication"
    >
      <meta itemprop="applicationCategory" content="DeveloperApplication" />
      <div class="pf-body">
        <div class="pf-label">★ FEATURED · FLAGSHIP PRODUCT</div>
        <h3 class="name" itemprop="name">{{ featured.name }}</h3>
        <p class="desc" itemprop="description">{{ featured.desc }}</p>
        <div class="tagrow">
          <span v-for="tag in featured.tags" :key="tag" itemprop="keywords">{{ tag }}</span>
        </div>
        <div class="linkrow">
          <a v-for="link in featured.links" :key="link.label" :href="link.url" itemprop="url" target="_blank" rel="noopener noreferrer">{{ link.label }} ↗</a>
        </div>
      </div>
      <div v-if="featured.art" class="pf-visual" aria-hidden="true">
        <span class="corner tl">{{ featured.art.topLeft }}</span>
        <span class="glyph">{{ featured.art.glyph }}</span>
        <span class="corner br">{{ featured.art.bottomRight }}</span>
        <div class="scan"></div>
      </div>
    </div>

    <!-- Rest of the projects -->
    <div
      v-for="(project, i) in restProjects"
      :key="project.name"
      class="pcard"
      :class="`delay-${i}`"
      itemscope
      itemtype="https://schema.org/SoftwareApplication"
    >
      <meta itemprop="applicationCategory" content="DeveloperApplication" />
      <span class="idx">#{{ String(i + 2).padStart(2, '0') }}</span>
      <span class="status" :class="project.status">
        {{ project.status === 'live' ? '● LIVE' : '◆ WIP' }}
      </span>
      <h3 class="name" itemprop="name">{{ project.name }}</h3>
      <p class="desc" itemprop="description">{{ project.desc }}</p>
      <div class="tagrow">
        <span v-for="tag in project.tags" :key="tag" itemprop="keywords">{{ tag }}</span>
      </div>
      <div class="linkrow">
        <a v-for="link in project.links" :key="link.label" :href="link.url" itemprop="url" target="_blank" rel="noopener noreferrer">{{ link.label }} ↗</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProjectLink { label: string; url: string }
interface ProjectArt { glyph: string; topLeft: string; bottomRight: string }
interface Project {
  name: string
  desc: string
  tags: string[]
  links: ProjectLink[]
  status: 'live' | 'wip'
  featured?: boolean
  art?: ProjectArt
}

// Hand-maintained project showcase data (source of truth for the homepage).
const projects: Project[] = [
  {
    name: '🖼️ BulkPicTools',
    desc: 'Bulk image processing in your browser. Compress, convert, crop, resize — all locally, no upload required, no privacy concerns. Chain multiple operations into a single pass.',
    tags: ['#Vue', '#PWA', '#WebAssembly', '#Canvas', '#PrivacyFirst'],
    links: [
      { label: 'Website', url: 'https://bulkpictools.com' },
      { label: 'GitHub', url: 'https://github.com/kbmjj123/BulkPicTools' },
    ],
    status: 'live',
    featured: true,
    art: { glyph: '🖼️', topLeft: 'IMG://LOCAL', bottomRight: '100% CLIENT-SIDE' },
  },
  {
    name: '🔍 aifindr.org',
    desc: 'Open-source AI tool directory. 500+ tools across 12 categories, curated for makers. Submit a tool, get 3 free dofollow backlinks.',
    tags: ['#Nuxt', '#Cloudflare', '#D1', '#OpenSource'],
    links: [
      { label: 'Website', url: 'https://aifindr.org' },
      { label: 'GitHub', url: 'https://github.com/kbmjj123/aifindr.org' },
    ],
    status: 'live',
  },
  {
    name: '📊 umami-serve',
    desc: 'Self-hosted Umami analytics fork — deploy your own analytics server for free. No tracking limits, full data ownership, Docker-ready.',
    tags: ['#Umami', '#Analytics', '#Docker', '#Fork'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kbmjj123/umami-serve' },
    ],
    status: 'live',
  },
  {
    name: '🧰 JSON Toolbox',
    desc: 'Free online JSON tools. Format, validate, convert (CSV/YAML/TS/XML), compare, minify, test JSONPath — all in your browser. Open source.',
    tags: ['#Vue', '#OpenSource', '#JSON', '#WebTools'],
    links: [
      { label: 'Website', url: 'https://jsontoolbox.cc' },
      { label: 'GitHub', url: 'https://github.com/kbmjj123/jsontoolbox.cc' },
    ],
    status: 'live',
  },
  {
    name: '💻 kbmjj123.cc',
    desc: 'This very site — a pixel-styled indie dev log. Nuxt 4 + Cloudflare D1/R2/Pages, Nuxt Content v3. Full-text search, RSS, newsletter, dynamic OG images.',
    tags: ['#Nuxt', '#Cloudflare', '#Tailwind', '#D1', '#R2'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kbmjj123/kbmjj123.cc' },
    ],
    status: 'wip',
  },
]

const featured = computed(() => projects.find(p => p.featured))
const restProjects = computed(() => projects.filter(p => !p.featured))
</script>

<style scoped>
.pgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* Featured */
.pfeatured {
  grid-column: 1 / -1;
  display: grid; grid-template-columns: 1.3fr 0.8fr;
  background: var(--bg-deep);
  border: 1.5px solid var(--accent-green);
  position: relative; overflow: hidden;
  opacity: 0; transform: translateY(20px);
  animation: pixelFadeUp 0.5s ease forwards;
  transition: box-shadow 0.2s ease;
}
.pfeatured:hover { box-shadow: 0 8px 26px rgba(74,222,128,0.08); }
.pf-body { padding: 26px 28px; }
.pf-label { font-family: var(--font-pixel); font-size: 8px; color: var(--accent-gold); letter-spacing: 1px; margin-bottom: 16px; }
.pfeatured .name { font-family: var(--font-pixel); font-size: 16px; color: var(--text-primary); margin-bottom: 14px; font-weight: 400; line-height: 1.6; }
.pfeatured .desc { font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 18px; }
.pf-visual {
  border-left: 1.5px solid var(--border-pixel);
  background-color: #0d0d18;
  background-image:
    linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px);
  background-size: 22px 22px;
  display: flex; align-items: center; justify-content: center;
  position: relative; min-height: 230px;
}
.pf-visual .glyph { font-size: 64px; filter: drop-shadow(0 0 18px rgba(74,222,128,0.35)); }
.pf-visual .corner { position: absolute; font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); }
.pf-visual .tl { top: 12px; left: 14px; }
.pf-visual .br { bottom: 12px; right: 14px; color: var(--accent-green); }
.pf-visual .scan { position: absolute; left: 0; right: 0; height: 2px; background: var(--accent-green); opacity: 0.35; animation: pfScan 4s linear infinite; }
@keyframes pfScan { 0% { top: 0; } 100% { top: 100%; } }

/* Normal cards */
.pcard {
  background: var(--bg-deep);
  border: 1.5px solid var(--border-pixel);
  padding: 20px 20px 22px;
  position: relative;
  transition: all 0.2s ease;
  opacity: 0; transform: translateY(20px);
  animation: pixelFadeUp 0.5s ease forwards;
}
.delay-0 { animation-delay: 0.12s; }
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.28s; }
.delay-3 { animation-delay: 0.36s; }
.pcard:hover { border-color: var(--accent-green); transform: translateY(-3px); box-shadow: 0 8px 22px rgba(74,222,128,0.06); }
.pcard .idx {
  position: absolute; top: -1px; left: 14px;
  font-family: var(--font-pixel); font-size: 8px; color: var(--text-muted);
  background: var(--bg-card); border: 1px solid var(--border-pixel); border-top: none;
  padding: 3px 9px;
}
.pcard .status {
  position: absolute; top: 14px; right: 14px;
  font-family: var(--font-pixel); font-size: 7px; padding: 3px 8px;
  border: 1px solid; letter-spacing: 0.5px;
}
.pcard .status.live { color: var(--accent-green); border-color: var(--accent-green); background: rgba(74,222,128,0.06); }
.pcard .status.wip { color: var(--accent-gold); border-color: var(--accent-gold); background: rgba(251,191,36,0.06); }
.pcard .name { font-family: var(--font-pixel); font-size: 12px; color: var(--text-primary); margin-bottom: 12px; font-weight: 400; line-height: 1.7; padding-right: 70px; }
.pcard .desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 14px; min-height: 70px; }
.tagrow { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
.tagrow span { font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border-pixel); padding: 3px 8px; }
.linkrow { display: flex; gap: 8px; flex-wrap: wrap; }
.linkrow a { font-family: var(--font-pixel); font-size: 8px; color: var(--accent-green); border: 1px solid var(--accent-green); padding: 5px 12px; text-decoration: none; transition: all 0.15s; }
.linkrow a:hover { background: var(--accent-green); color: var(--bg-deep); }

@media (max-width: 860px) {
  .pfeatured { grid-template-columns: 1fr; }
  .pf-visual { border-left: none; border-top: 1.5px solid var(--border-pixel); min-height: 160px; }
}
@media (max-width: 480px) {
  .pgrid { grid-template-columns: 1fr; }
  .pf-body { padding: 18px 16px 20px; }
  .pfeatured .name { font-size: 13px; }
  .pfeatured .desc { font-size: 14px; }
  .pcard { padding: 16px 14px 18px; }
}
</style>
