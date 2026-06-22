<template>
  <section class="about-content">
    <h1>👨‍💻 About Me</h1>
    <div class="subhead">Independent developer · craft &amp; simplicity</div>

    <div class="about-avatar-large">
      <div class="pixel-avatar-big">🧑‍🚀</div>
      <div class="about-intro">
        <strong>Hi, I'm PixelDev</strong> — a full-stack indie developer based in the cloud.<br />
        I build digital products with a focus on <span style="color:var(--accent-gold);">craft</span>,
        <span style="color:var(--accent-green);">performance</span>, and
        <span style="color:#f472b6;">minimalism</span>.
        This blog is my digital garden where I share lessons, tools, and thoughts along the indie journey.
      </div>
    </div>

    <div class="skill-section">
      <h3>Tech Stack</h3>
      <div class="skill-tags">
        <span v-for="skill in skills" :key="skill" class="skill-tag">{{ skill }}</span>
      </div>
    </div>

    <div class="timeline">
      <h3>Milestones</h3>
      <div v-for="item in milestones" :key="item.year" class="timeline-item">
        <span class="timeline-year">{{ item.year }}</span>
        <span class="timeline-desc" v-html="item.desc"></span>
      </div>
    </div>

    <div class="contact-links">
      <a v-for="link in links" :key="link.label" :href="link.url">{{ link.label }}</a>
    </div>
  </section>
</template>

<script setup lang="ts">
usePageSeo({ title: 'About' })

const skills = ['#Nuxt4', '#Vue3', '#TypeScript', '#Tailwind', '#Cloudflare', '#D1', '#Pages', '#R2', '#Workers', '#Git']

const milestones = [
  { year: '2024', desc: '<strong>Started indie journey</strong> — left 9-to-5 to build my own products.' },
  { year: '2025', desc: '<strong>Launched first MVP</strong> — a productivity tool for indie devs (3 paying users).' },
  { year: '2026', desc: '<strong>Rebuilt stack</strong> — migrated to Nuxt 4 + Cloudflare D1, fully serverless.' },
  { year: 'Now', desc: '<strong>Building PixelFlow</strong> — a visual workflow builder for creators.' },
]

const links = [
  { label: 'GitHub', url: '#' },
  { label: 'Twitter / X', url: '#' },
  { label: 'LinkedIn', url: '#' },
  { label: '✉️ Email', url: 'mailto:hello@devpixel.dev' },
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
.about-content h1 {
  font-family: var(--font-pixel);
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.subhead {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  border-bottom: 1px dotted var(--border-pixel);
  padding-bottom: 14px;
}
.about-avatar-large {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
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
.about-intro strong { color: var(--text-primary); }

.skill-section { margin-top: 28px; }
.skill-section h3 {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--accent-gold);
  margin-bottom: 12px;
}
.skill-section h3::before { content: "▸ "; color: var(--accent-green); }
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

.timeline { margin-top: 28px; }
.timeline h3 {
  font-family: var(--font-pixel);
  font-size: 12px;
  color: var(--accent-gold);
  margin-bottom: 14px;
}
.timeline h3::before { content: "▸ "; color: var(--accent-green); }
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
  min-width: 60px;
  flex-shrink: 0;
}
.timeline-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}
.timeline-desc strong { color: var(--text-primary); }

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

@media (max-width: 860px) {
  .about-content h1 { font-size: 17px; }
}
@media (max-width: 480px) {
  .about-content { padding: 16px 14px 18px; }
  .about-content h1 { font-size: 14px; }
  .about-avatar-large { flex-direction: column; align-items: flex-start; }
  .timeline-item { flex-direction: column; gap: 4px; }
}
</style>
