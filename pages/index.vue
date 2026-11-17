<template>
  <div class="home">
    <!-- Hero: personal identity -->
    <section class="hero">
      <div class="hero-main">
        <AuthorPhoto alt="kbmjj123, independent developer" size="sm" class="hero-photo-mobile" />
        <div class="hero-badge">
          <span class="dot"></span> INDEPENDENT DEVELOPER · PRODUCT BUILDER
        </div>
        <h1 class="hero-title">
          Independent developer building <em>practical web products</em>.
        </h1>
        <p class="hero-sub">
          Focus on Vue + NuxtJS + Cloudflare stack, tech for business only.
          Simple, effective &amp; user-oriented side projects.
        </p>
        <div class="cta-row">
          <a href="#projects" class="btn btn-primary">▣ View Projects</a>
          <NuxtLink to="/blog" class="btn btn-ghost">Read the Blog →</NuxtLink>
        </div>
      </div>

      <!-- Terminal profile card -->
      <div class="terminal">
        <div class="term-bar">
          <i></i><i></i><i></i>
          <span>kbmjj123@cc ~ %</span>
        </div>
        <div class="term-identity">
          <AuthorPhoto alt="" size="lg" aria-hidden="true" />
          <div class="term-identity-text">
            <span class="term-who">kbmjj123 | Indie Developer</span>
            <span class="term-role">Independent Developer | Product Builder</span>
          </div>
        </div>
        <div class="term-body" aria-hidden="true">
          <div><span class="muted">$</span> <span class="k">whoami</span></div>
          <div>&gt; He/Him · Online / Asia</div>
          <div class="sp"><span class="muted">$</span> <span class="k">profile</span> --verbose</div>
          <div>&gt; stack: <span class="v">Vue3 · Nuxt3 · Cloudflare</span></div>
          <div>&gt; shipping: <span class="v">{{ projectCount }} projects</span></div>
          <div>&gt; writing: <span class="v">{{ postCount }} posts</span></div>
          <div>&gt; site: <span class="v">bulkpictools.com</span></div>
          <div class="sp"><span class="muted">$</span> <span class="cursor"></span></div>
        </div>
      </div>
    </section>

    <!-- Stats strip -->
    <div class="stats">
      <div class="stat"><div class="n">{{ pad(projectCount) }}</div><div class="l">PROJECTS</div></div>
      <div class="stat"><div class="n gold">{{ pad(postCount) }}</div><div class="l">POSTS</div></div>
      <div class="stat"><div class="n">06</div><div class="l">CATEGORIES</div></div>
      <div class="stat"><div class="n gold">∞</div><div class="l">SIDE QUESTS</div></div>
    </div>

    <!-- Projects -->
    <section id="projects" class="section">
      <div class="section-head">
        <h2 class="section-title">Projects</h2>
        <span class="section-note">Things I've built (and am building)</span>
      </div>
      <ProjectGrid />
    </section>

    <!-- Latest build logs -->
    <section id="build-logs" class="section">
      <div class="section-head">
        <h2 class="section-title">Latest build logs</h2>
        <NuxtLink to="/blog" class="section-link">Read all build logs →</NuxtLink>
      </div>
      <div class="logs">
        <NuxtLink v-for="(log, i) in buildLogs" :key="log.slug" :to="`/${log.slug}`" class="log">
          <span class="log-no">0{{ i + 1 }}</span>
          <span class="log-main">
            <span class="log-title">{{ log.title }}</span>
            <span class="log-sub">{{ log.sub }}</span>
          </span>
          <span class="log-arrow">→</span>
        </NuxtLink>
      </div>
      <div class="logs-note">Real posts from this site. Case-study pages link back to their build logs; every claim stays verifiable.</div>
    </section>

    <!-- About me -->
    <section id="about" class="section">
      <div class="section-head">
        <h2 class="section-title">About Me</h2>
        <NuxtLink to="/about" class="section-link">Full profile →</NuxtLink>
      </div>
      <div class="about-panel">
        <p class="about-lead">
          Hi, I'm an independent developer who builds practical web-based products
          and business-oriented side projects.
        </p>
        <p class="about-text">
          I only choose tech stacks that fit my workflow, mainly using Vue, NuxtJS and Cloudflare
          to develop and deploy lightweight landing pages and web tools efficiently. I focus on making
          technology serve real business needs rather than over-engineering. I also share my
          product-building journey, lightweight development experience and indie maker insights.
        </p>
        <div class="about-facts">
          <div class="fact">
            <span class="fact-k">LOCATION</span>
            <span class="fact-v">Online / Asia</span>
          </div>
          <div class="fact">
            <span class="fact-k">WEBSITE</span>
            <span class="fact-v"><a href="https://bulkpictools.com" target="_blank" rel="noopener noreferrer">bulkpictools.com ↗</a></span>
          </div>
          <div class="fact">
            <span class="fact-k">TECH STACK</span>
            <span class="fact-v">Vue3 / Nuxt3 / WebAssembly / TailwindCSS / Cloudflare</span>
          </div>
          <div class="fact">
            <span class="fact-k">TOPICS</span>
            <span class="fact-v">#IndieDeveloper #WebDev #NuxtJS #Cloudflare #SideProject #ProductBuilding</span>
          </div>
        </div>
        <div class="about-social">
          <a v-for="profile in socialProfiles" :key="profile.label" :href="profile.url" target="_blank" rel="noopener noreferrer">
            {{ profile.label }} ↗
          </a>
        </div>
        <div class="blog-cta">
          <div class="blog-cta-text">
            Field notes on shipping, breaking things,<br />and <span class="g">what actually worked</span>.
          </div>
          <NuxtLink to="/blog" class="btn btn-primary">Read the Blog →</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePosts } from '~/composables/usePosts'
import { projects } from '~/data/projects'
import { socialProfiles } from '~/data/social'

const { allPosts } = usePosts()
const postCount = computed(() => allPosts.value.length)
const projectCount = computed(() => projects.length)
const pad = (n: number) => String(n).padStart(2, '0')

// Curated build logs — titles derived from real posts so nothing is fabricated.
const buildLogSlugs = [
  'what-a-browser-only-tool-site-actually-costs',
  'self-hosted-analytics-d1-free-tier',
  'from-zero-to-2-dollar-6-months-tool-site',
]
const buildLogSubs: Record<string, string> = {
  'what-a-browser-only-tool-site-actually-costs': 'A line-by-line cost breakdown of a browser-only tool site.',
  'self-hosted-analytics-d1-free-tier': 'Building my own analytics, and hitting the free tier wall two days later.',
  'from-zero-to-2-dollar-6-months-tool-site': 'Six months of running a tool site as an indie developer.',
}
const buildLogs = computed(() =>
  buildLogSlugs
    .map(slug => allPosts.value.find(p => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map(p => ({ slug: p.slug, title: p.title, sub: buildLogSubs[p.slug] || '' }))
)

usePageSeo({
  title: 'Indie Developer Log',
  description: 'kbmjj123 | Indie Developer — independent product builder using Vue, NuxtJS and Cloudflare to ship practical, lightweight web tools.',
  template: 'prefix',
})
</script>

<style scoped>
.home { display: flex; flex-direction: column; }

/* Hero */
.hero {
  display: grid; grid-template-columns: 1.4fr 0.9fr; gap: 28px; margin-top: 0;
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  border-left: 3px solid var(--accent-green);
  padding: 34px 34px 30px; position: relative;
}
.hero::before {
  content: "◆"; color: var(--accent-green); font-size: 8px;
  position: absolute; top: -6px; left: 16px; background: var(--bg-card); padding: 0 5px;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-pixel); font-size: clamp(7px, 1vw, 9px); color: var(--accent-gold);
  letter-spacing: 0.5px; margin-bottom: 20px;
}
.hero-badge .dot {
  width: 6px; height: 6px; background: var(--accent-green); flex-shrink: 0;
  box-shadow: 0 0 8px var(--accent-green); animation: pixelBlink 1.6s infinite;
}
.hero-photo-mobile { display: none; }
.hero-title {
  font-family: var(--font-pixel); font-size: clamp(14px, 2.2vw, 24px); line-height: 1.75;
  margin-bottom: 18px; font-weight: 400; max-width: 620px;
}
.hero-title em { font-style: normal; color: var(--accent-green); }
.hero-sub { font-size: 15px; color: var(--text-secondary); line-height: 1.9; max-width: 560px; margin-bottom: 26px; }
.cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
.btn {
  font-family: var(--font-pixel); font-size: 10px; padding: 11px 22px;
  transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px;
  letter-spacing: 0.5px; text-decoration: none;
}
.btn-primary { color: var(--bg-deep); background: var(--accent-green); border: 1.5px solid var(--accent-green); box-shadow: 3px 3px 0 rgba(74,222,128,0.15); }
.btn-primary:hover { background: var(--bg-deep); color: var(--accent-green); box-shadow: 0 0 0 transparent; }
.btn-ghost { color: var(--accent-gold); border: 1.5px solid var(--accent-gold); }
.btn-ghost:hover { background: var(--accent-gold); color: var(--bg-deep); }

/* Terminal */
.terminal { background: var(--bg-deep); border: 1.5px solid var(--border-pixel); align-self: stretch; display: flex; flex-direction: column; min-width: 0; }
.term-bar {
  display: flex; align-items: center; gap: 6px; padding: 9px 12px;
  border-bottom: 1px solid var(--border-pixel); background: rgba(255,255,255,0.02);
}
.term-bar i { width: 8px; height: 8px; display: block; }
.term-bar i:nth-child(1) { background: var(--error-red); }
.term-bar i:nth-child(2) { background: var(--accent-gold); }
.term-bar i:nth-child(3) { background: var(--accent-green); }
.term-bar span { margin-left: auto; font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); }
.term-identity { display: flex; align-items: center; gap: 14px; padding: 16px 16px 0; }
.term-identity-text { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.term-who { font-family: var(--font-pixel); font-size: 10px; color: var(--accent-green); line-height: 1.6; }
.term-role { font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); line-height: 1.6; }
.term-body { padding: 12px 16px 16px; flex: 1; font-family: var(--font-pixel); font-size: 9px; line-height: 2.4; color: var(--text-secondary); }
.term-body .k { color: var(--accent-green); }
.term-body .v { color: var(--accent-gold); }
.term-body .muted { color: var(--text-muted); }
.term-body .sp { margin-top: 10px; }
.term-body .cursor { display: inline-block; width: 8px; height: 12px; background: var(--accent-green); vertical-align: middle; animation: pixelBlink 1s infinite; }

/* Stats */
.stats {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
  gap: 1px; background: var(--border-pixel); border: 1.5px solid var(--border-pixel); margin-top: 24px;
}
.stat { background: var(--bg-deep); padding: 18px 20px; text-align: center; }
.stat .n { font-family: var(--font-pixel); font-size: 20px; color: var(--accent-green); }
.stat .n.gold { color: var(--accent-gold); }
.stat .l { font-family: var(--font-pixel); font-size: 8px; color: var(--text-muted); margin-top: 10px; letter-spacing: 0.5px; }

/* Sections */
.section { margin-top: 46px; scroll-margin-top: 80px; }
.section-head {
  display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
  border-bottom: 1px solid var(--border-pixel); padding-bottom: 12px; margin-bottom: 22px; flex-wrap: wrap;
}
.section-title { font-family: var(--font-pixel); font-size: 15px; font-weight: 400; color: var(--text-primary); }
.section-title::before { content: "▸ "; color: var(--accent-green); }
.section-note { font-size: 13px; color: var(--text-muted); }
.section-link { font-family: var(--font-pixel); font-size: 9px; color: var(--accent-green); text-decoration: none; transition: color 0.15s; }
.section-link:hover { color: var(--accent-gold); }

/* Latest build logs */
.logs {
  border: 1.5px solid var(--border-pixel);
  background: rgba(255,255,255,0.02);
}
.log {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 15px 18px; border-bottom: 1px solid var(--border-pixel);
  text-decoration: none; transition: background 0.15s;
}
.log:last-child { border-bottom: none; }
.log:hover { background: rgba(74,222,128,0.04); }
.log-no {
  font-family: var(--font-pixel); font-size: 9px; color: var(--accent-gold);
  min-width: 22px; flex-shrink: 0; padding-top: 2px;
}
.log-main { display: flex; flex-direction: column; gap: 6px; min-width: 0; flex: 1; }
.log-title { font-size: 14px; color: var(--text-primary); line-height: 1.6; }
.log:hover .log-title { color: var(--accent-green); }
.log-sub { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
.log-arrow { font-family: var(--font-pixel); font-size: 11px; color: var(--accent-green); flex-shrink: 0; }
.logs-note { font-size: 12px; color: var(--text-muted); margin-top: 12px; line-height: 1.7; }

/* About me */
.about-panel {
  border: 1.5px solid var(--border-pixel);
  background: rgba(255,255,255,0.02);
  padding: 26px 28px;
}
.about-lead {
  font-family: var(--font-pixel); font-size: 12px; line-height: 1.9;
  color: var(--text-primary); margin-bottom: 16px;
}
.about-text { font-size: 15px; color: var(--text-secondary); line-height: 1.9; margin-bottom: 22px; }
.about-facts {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 1px; background: var(--border-pixel); border: 1px solid var(--border-pixel); margin-bottom: 20px;
}
.fact { background: var(--bg-deep); padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.fact-k { font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); letter-spacing: 0.5px; }
.fact-v { font-size: 13px; color: var(--text-secondary); line-height: 1.7; overflow-wrap: anywhere; }
.fact-v a { color: var(--accent-green); text-decoration: none; }
.fact-v a:hover { text-decoration: underline; }
.about-social { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
.about-social a {
  font-family: var(--font-pixel); font-size: 8px; color: var(--accent-gold);
  border: 1px solid var(--border-pixel); padding: 8px 12px;
  text-decoration: none; transition: all 0.15s;
}
.about-social a:hover { border-color: var(--accent-green); color: var(--accent-green); }

.blog-cta {
  border: 1.5px dashed var(--accent-green);
  background: rgba(74,222,128,0.03); padding: 22px;
  display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap;
}
.blog-cta-text { font-family: var(--font-pixel); font-size: 11px; color: var(--text-primary); line-height: 1.9; }
.blog-cta-text .g { color: var(--accent-green); }

@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; padding: 26px 22px; }
  .hero-photo-mobile { display: block; margin-bottom: 16px; }
  .term-identity :deep(.author-photo) { display: none; }
  .term-identity { padding-top: 12px; }
  .btn { min-height: 44px; }
}
@media (max-width: 480px) {
  .hero { padding: 22px 18px; }
  .hero-sub { font-size: 14px; }
  .stat { padding: 14px 8px; }
  .section-title { font-size: 12px; }
  .about-panel { padding: 18px 16px; }
  .about-lead { font-size: 9px; }
  .about-text { font-size: 14px; }
  .blog-cta-text { font-size: 9px; }
  .term-body { font-size: 8px; }
  .log { gap: 10px; padding: 13px 14px; }
  .log-title { font-size: 13px; }
  .log-sub { font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-badge .dot, .term-body .cursor { animation: none; }
}
</style>
