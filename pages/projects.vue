<template>
  <section class="projects-content">
    <h1>🚀 Projects</h1>
    <div class="subhead">Things I've built (and am building)</div>

    <div class="project-grid">
      <div v-for="project in projects" :key="project.name" class="project-card">
        <h3>{{ project.name }}</h3>
        <div class="project-desc">{{ project.desc }}</div>
        <div class="project-tags">
          <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
        </div>
        <div class="project-links">
          <a v-for="link in project.links" :key="link.label" :href="link.url">{{ link.label }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
usePageSeo({ title: 'Projects' })

const projects = [
  {
    name: 'PixelFlow',
    desc: 'Visual workflow builder for creators — automate repetitive tasks with a drag-and-drop interface.',
    tags: ['#Nuxt', '#Vue', '#Tailwind', '#D1'],
    links: [{ label: 'Demo', url: '#' }, { label: 'GitHub', url: '#' }],
  },
  {
    name: 'DevLog',
    desc: 'Minimalist blog platform for indie developers — exactly what this site is running on.',
    tags: ['#Nuxt', '#Cloudflare', '#D1', '#Markdown'],
    links: [{ label: 'Demo', url: '#' }, { label: 'GitHub', url: '#' }],
  },
  {
    name: 'Pulse',
    desc: 'Simple uptime monitoring for small projects — checks your endpoints and sends alerts via Telegram.',
    tags: ['#Node', '#Workers', '#Telegram'],
    links: [{ label: 'Demo', url: '#' }, { label: 'GitHub', url: '#' }],
  },
  {
    name: 'PixelUI',
    desc: 'Component library with a pixel-inspired aesthetic — built for Vue 3 and Tailwind.',
    tags: ['#Vue', '#Tailwind', '#Design'],
    links: [{ label: 'Demo', url: '#' }, { label: 'GitHub', url: '#' }],
  },
]
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
.project-card h3 {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 6px;
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
