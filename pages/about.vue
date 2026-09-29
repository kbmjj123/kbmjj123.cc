<template>
  <section class="about-content" itemscope itemtype="https://schema.org/AboutPage">
    <!-- Hero -->
    <h1>Hi, I'm KBMJJ</h1>
    <div class="subhead" itemprop="description">
      Independent developer building practical web products, content sites, and apps.
    </div>

    <div class="about-avatar-large" itemprop="mainContentOfPage">
      <div class="pixel-avatar-big">🧑‍💻</div>
      <div class="about-intro">
        I care about turning real user needs into simple, maintainable products. I choose technologies
        based on the product and business constraints rather than using complexity for its own sake.
        This blog is my development log — where I share what I build, what breaks, and what I learn.
      </div>
    </div>

    <!-- What I'm Building -->
    <div class="section-block">
      <h2 class="section-title">What I'm Building</h2>
      <div class="project-cards">
        <div class="project-card">
          <div class="project-name">
            <a href="/">KBMJJ123.cc</a>
          </div>
          <div class="project-desc">
            My personal site and development log. I write about product decisions, technical trade-offs,
            SEO, deployment, and the lessons I learn from real projects.
          </div>
          <div class="project-meta">
            <span class="meta-tag">Nuxt 4</span>
            <span class="meta-tag">Cloudflare D1</span>
            <span class="meta-tag">SSG</span>
          </div>
        </div>
        <div class="project-card">
          <div class="project-name">
            <a href="https://bulkpictools.com" target="_blank" rel="noopener">BulkPicTools</a>
          </div>
          <div class="project-desc">
            A browser-first image processing tool focused on practical bulk operations.
            No uploads, no server — everything runs in the browser.
          </div>
          <div class="project-meta">
            <span class="meta-tag">WebAssembly</span>
            <span class="meta-tag">Vue 3</span>
            <span class="meta-tag">Client-side</span>
          </div>
        </div>
        <div class="project-card project-card-more">
          <div class="project-name">More projects in progress</div>
          <div class="project-desc">
            I'm working on additional websites and mobile applications. I'll share more details
            as they become ready.
          </div>
        </div>
      </div>
    </div>

    <!-- What I Write About -->
    <div class="section-block">
      <h2 class="section-title">What I Write About</h2>
      <ul class="topic-list">
        <li>Building and shipping small web products</li>
        <li>Practical Vue, Nuxt, Cloudflare, and WebAssembly development</li>
        <li>Browser-first image and document processing</li>
        <li>SEO, content systems, distribution, and monetization</li>
        <li>AI-assisted development and content workflows</li>
        <li>Product decisions, failures, experiments, and trade-offs</li>
      </ul>
    </div>

    <!-- My Approach -->
    <div class="section-block">
      <h2 class="section-title">My Approach</h2>
      <div class="approach-text">
        I prefer useful products over unnecessary complexity. That does not mean every product
        should be simple in every way — it means the technical decisions should serve the user,
        the product, and the business context. I'm interested in what actually ships, what users
        actually need, and what continues to work after the initial launch.
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="section-block">
      <h2 class="section-title">Tech Stack</h2>
      <div class="skill-tags">
        <span v-for="skill in skills" :key="skill" class="skill-tag">{{ skill }}</span>
      </div>
    </div>

    <!-- Timeline -->
    <div class="section-block">
      <h2 class="section-title">Milestones</h2>
      <div v-for="item in milestones" :key="item.year" class="timeline-item">
        <span class="timeline-year">{{ item.year }}</span>
        <span class="timeline-desc" v-html="item.desc"></span>
      </div>
    </div>

    <!-- Contact -->
    <div class="contact-links" itemscope itemtype="https://schema.org/Person">
      <a v-for="link in links" :key="link.label" :href="link.url" target="_blank" rel="noopener" itemprop="sameAs">
        {{ link.label }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
usePageSeo({
  title: 'About',
  description: 'About KBMJJ123 — Independent developer building web products, content sites, and apps.',
})

const skills = ['Vue 3', 'Nuxt 4', 'TypeScript', 'Cloudflare D1', 'Cloudflare Pages', 'Cloudflare Workers', 'WebAssembly', 'R2', 'Tailwind CSS', 'Git']

const milestones = [
  { year: '2026.01', desc: '<strong>First product live</strong> — launched BulkPicTools, a browser-first image processing tool.' },
  { year: '2026', desc: '<strong>Rebuilt personal stack</strong> — migrated to Nuxt 4 + Cloudflare D1, fully serverless.' },
  { year: 'Now', desc: '<strong>Expanding</strong> — building new web tools and mobile apps, growing through SEO and content.' },
]

const links = [
  { label: 'GitHub', url: 'https://github.com/kbmjj123' },
  { label: 'X / Twitter', url: 'https://x.com/solomaker282' },
  { label: '✉️ Email', url: 'mailto:hello@kbmjj123.cc' },
]
</script>

<style scoped>
.about-content {
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
}
.about-content::before {
  content: "◆";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 14px;
  background: var(--bg-card);
  padding: 0 4px;
}

/* Hero */
.about-content h1 {
  font-family: var(--font-pixel);
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.subhead {
  font-size: 15px;
  color: var(--accent-green);
  margin-bottom: 20px;
  border-bottom: 1px dotted var(--border-pixel);
  padding-bottom: 14px;
  line-height: 1.6;
}
.about-avatar-large {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}
.pixel-avatar-big {
  width: 64px;
  height: 64px;
  background: var(--bg-deep);
  border: 3px solid var(--accent-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-family: var(--font-pixel);
  color: var(--accent-green);
  flex-shrink: 0;
}
.about-intro {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.9;
}

/* Section blocks */
.section-block {
  margin-top: 28px;
}
.section-title {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--accent-gold);
  margin-bottom: 14px;
  font-weight: 400;
}
.section-title::before {
  content: "▸ ";
  color: var(--accent-green);
}

/* Project cards */
.project-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.project-card {
  background: var(--bg-deep);
  border: 1px solid var(--border-pixel);
  padding: 16px 18px;
  transition: border-color 0.15s ease;
}
.project-card:hover {
  border-color: var(--accent-green);
}
.project-name {
  font-family: var(--font-pixel);
  font-size: 10px;
  margin-bottom: 8px;
}
.project-name a {
  color: var(--accent-green);
  text-decoration: none;
  transition: color 0.15s;
}
.project-name a:hover {
  color: var(--accent-gold);
}
.project-card-more .project-name {
  color: var(--text-muted);
}
.project-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 10px;
}
.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.meta-tag {
  font-family: var(--font-pixel);
  font-size: 7px;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border-pixel);
  padding: 3px 8px;
}

/* Topic list */
.topic-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.topic-list li {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  padding: 6px 0;
  border-bottom: 1px dotted var(--border-pixel);
  position: relative;
  padding-left: 16px;
}
.topic-list li::before {
  content: "◇";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  left: 0;
  top: 8px;
}
.topic-list li:last-child {
  border-bottom: none;
}

/* Approach */
.approach-text {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.9;
  border-left: 2px solid var(--accent-gold);
  padding-left: 16px;
}

/* Skill tags */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-tag {
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text-secondary);
  background: var(--bg-deep);
  border: 1px solid var(--border-pixel);
  padding: 4px 12px;
  transition: all 0.15s ease;
}
.skill-tag:hover {
  color: var(--accent-green);
  border-color: var(--accent-green);
}

/* Timeline */
.timeline-item {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  border-left: 2px solid var(--border-pixel);
  padding-left: 16px;
  position: relative;
}
.timeline-item::before {
  content: "◈";
  color: var(--accent-green);
  font-size: 10px;
  position: absolute;
  left: -7px;
  top: 0;
  background: var(--bg-card);
  padding: 0 2px;
}
.timeline-year {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--accent-gold);
  min-width: 72px;
  flex-shrink: 0;
}
.timeline-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.timeline-desc strong { color: var(--text-primary); }

/* Contact */
.contact-links {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px dashed var(--border-pixel);
  display: flex;
  flex-wrap: wrap;
  gap: 14px 24px;
}
.contact-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-family: var(--font-pixel);
  font-size: 10px;
  transition: color 0.15s;
  border: 1px solid transparent;
  padding: 4px 8px;
}
.contact-links a:hover {
  color: var(--accent-green);
  border-color: var(--accent-green);
}

/* Responsive */
@media (max-width: 860px) {
  .about-content h1 { font-size: 17px; }
  .subhead { font-size: 14px; }
}
@media (max-width: 480px) {
  .about-content { padding: 16px 14px 18px; }
  .about-content h1 { font-size: 14px; }
  .about-avatar-large { flex-direction: column; align-items: flex-start; }
  .timeline-item { flex-direction: column; gap: 4px; }
  .timeline-year { min-width: auto; }
}
</style>
