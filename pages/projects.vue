<template>
  <section class="projects-content">
    <h1>🚀 Projects</h1>
    <div class="subhead">Things I've built (and am building)</div>

    <div class="project-grid">
      <div v-for="project in projects" :key="project.name" class="project-card" itemscope itemtype="https://schema.org/SoftwareApplication">
        <meta itemprop="applicationCategory" content="DeveloperApplication" />
        <h2 class="project-name" itemprop="name">{{ project.name }}</h2>
        <div class="project-desc" itemprop="description">{{ project.desc }}</div>
        <div class="project-tags">
          <span v-for="tag in project.tags" :key="tag" itemprop="keywords">{{ tag }}</span>
        </div>
        <div class="project-links">
          <a v-for="link in project.links" :key="link.label" :href="link.url" itemprop="url">{{ link.label }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
usePageSeo({ title: 'Projects', description: 'Showcase of independent projects — products and open-source work in progress.' })

const projects = [
  {
    name: '🖼️ BulkPicTools',
    desc: 'Bulk image processing in your browser. Compress, convert, crop, resize — all locally, no upload required, no privacy concerns. Supports tool chaining so you can run multiple operations in one pass.',
    tags: ['#Vue', '#PWA', '#WebAssembly', '#Canvas'],
    links: [
      { label: 'Website', url: 'https://bulkpictools.com' },
      { label: 'Website', url: 'https://github.com/kbmjj123/BulkPicTools' },
    ],
  },
  {
    name: '🔍 aifindr.org',
    desc: 'Open-source AI tool directory. 500+ tools across 12 categories, curated for makers and developers. Submit your tool and get 3 free dofollow backlinks (GitHub DA 100 + aifindr.org + contributor page).',
    tags: ['#Nuxt', '#Cloudflare', '#D1', '#OpenSource'],
    links: [
      { label: 'Website', url: 'https://aifindr.org' },
      { label: 'GitHub', url: 'https://github.com/kbmjj123/aifindr.org' },
      { label: 'Aswsome', url: 'https://github.com/kbmjj123/awesome-ai-tools' },
    ],
  },
  {
    name: '📊 umami-serve',
    desc: 'Self-hosted Umami analytics fork — deploy your own analytics server for free. Customized from official Umami source for personal deployment, no tracking limits, full data ownership.',
    tags: ['#Umami', '#Analytics', '#Docker', '#SelfHosted', '#Fork'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kbmjj123/umami-serve' },
    ],
  },
  {
    name: '💻 kbmjj123.cc',
    desc: 'This very site — an indie developer blog with pixel aesthetic. Built with Nuxt 4, Cloudflare D1/R2/Pages, Nuxt Content v3, and Tailwind v4. Features full-text search, RSS, newsletter, and dynamic OG images.',
    tags: ['#Nuxt', '#Cloudflare', '#Tailwind', '#D1', '#R2'],
    links: [
      { label: 'GitHub', url: 'https://github.com/kbmjj123/kbmjj123.cc' },
    ],
  },
]

// Schema.org — CollectionPage via @nuxtjs/seo schema-org module
// Individual project microdata uses itemscope SoftwareApplication in template
useSchemaOrg([
  defineWebPage({ '@type': 'CollectionPage' }),
])
</script>

<style scoped>
.projects-content {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
}
.projects-content::before {
  content: "◆";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 14px;
  background: var(--bg-card);
  padding: 0 4px;
}
.projects-content h1 {
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
.project-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.project-card {
  background: var(--bg-deep);
  border: 1.5px solid var(--border-pixel);
  padding: 18px 18px 20px;
  transition: all 0.2s ease;
  position: relative;
}
.project-card:hover {
  border-color: var(--accent-green);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(74,222,128,0.05);
}
.project-name {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-weight: 400;
}
.project-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 14px;
}
.project-tags span {
  font-family: var(--font-pixel);
  font-size: 7px;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border-pixel);
  padding: 2px 8px;
}
.project-links { display: flex; gap: 10px; }
.project-links a {
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--accent-green);
  text-decoration: none;
  border: 1px solid var(--accent-green);
  padding: 4px 12px;
  transition: all 0.15s ease;
}
.project-links a:hover {
  background: var(--accent-green);
  color: var(--bg-deep);
}

@media (max-width: 860px) {
  .project-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .projects-content { padding: 16px 14px 18px; }
  .project-card { padding: 14px; }
}
</style>
