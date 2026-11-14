<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-main">
        <div class="badge"><span class="dot"></span> INDEPENDENT DEVELOPER · BUILDING IN PUBLIC</div>
        <h1 class="hero-title">
          I build <em>browser-first</em> tools<br />and write about how<br />they get made.
        </h1>
        <p class="hero-sub">
          Solo developer shipping practical web products — image tools, AI directories,
          self-hosted analytics — and documenting every product decision, trade-off,
          and dead end along the way.
        </p>
        <div class="cta-row">
          <a href="#projects" class="btn btn-primary">▣ View Projects</a>
          <NuxtLink to="/blog" class="btn btn-ghost">Read the Blog →</NuxtLink>
        </div>
      </div>

      <!-- Terminal status card -->
      <div class="terminal" aria-hidden="true">
        <div class="term-bar">
          <i></i><i></i><i></i>
          <span>kbmjj123@cc ~ %</span>
        </div>
        <div class="term-body">
          <div><span class="muted">$</span> <span class="k">whoami</span></div>
          <div>&gt; indie_dev, 1 person, 0 funding</div>
          <div class="sp"><span class="muted">$</span> <span class="k">status</span> --verbose</div>
          <div>&gt; shipping: <span class="v">5 projects</span></div>
          <div>&gt; writing: <span class="v">{{ postCount }} posts</span></div>
          <div>&gt; stack: <span class="v">Nuxt · Cloudflare</span></div>
          <div>&gt; uptime: <span class="v">since 2026.06</span></div>
          <div class="sp"><span class="muted">$</span> <span class="cursor"></span></div>
        </div>
      </div>
    </section>

    <!-- Stats strip -->
    <div class="stats">
      <div class="stat"><div class="n">05</div><div class="l">PROJECTS</div></div>
      <div class="stat"><div class="n gold">{{ pad(postCount) }}</div><div class="l">POSTS</div></div>
      <div class="stat"><div class="n">06</div><div class="l">CATEGORIES</div></div>
      <div class="stat"><div class="n gold">∞</div><div class="l">SIDE QUESTS</div></div>
    </div>

    <!-- Projects (main part) -->
    <section id="projects" class="section">
      <div class="section-head">
        <h2 class="section-title">Projects</h2>
        <span class="section-note">Things I've built (and am building)</span>
      </div>
      <ProjectGrid />
    </section>

    <!-- Latest writing entry -->
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">Latest Writing</h2>
        <NuxtLink to="/blog" class="section-link">All posts →</NuxtLink>
      </div>
      <div class="writing-grid">
        <PostList variant="compact" :limit="3" :apply-filter="false" :show-filter="false" :show-videos="false" :show-empty="false" :show-header="false" />
      </div>
      <div class="blog-cta">
        <div class="blog-cta-text">
          More field notes on shipping, breaking things,<br />and <span class="g">what actually worked</span>.
        </div>
        <NuxtLink to="/blog" class="btn btn-primary">Read the Blog →</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { usePosts } from '~/composables/usePosts'

const { allPosts } = usePosts()
const postCount = computed(() => allPosts.value.length)
const pad = (n: number) => String(n).padStart(2, '0')

usePageSeo({
  title: 'Indie Developer Log',
  description: 'KB MJJ123 .cc — indie developer building browser-first tools (BulkPicTools, aifindr.org, JSON Toolbox) and writing about product, code, and startup lessons.',
  template: 'prefix',
})
</script>

<style scoped>
.home { display: flex; flex-direction: column; }

/* Hero */
.hero {
  display: grid; grid-template-columns: 1.4fr 0.9fr; gap: 28px; margin-top: 36px;
  background-color: rgba(255,255,255,0.02);
  border: 1.5px solid var(--border-pixel);
  border-left: 3px solid var(--accent-green);
  padding: 34px 34px 30px; position: relative;
}
.hero::before {
  content: "◆"; color: var(--accent-green); font-size: 8px;
  position: absolute; top: -6px; left: 16px; background: var(--bg-card); padding: 0 5px;
}
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-pixel); font-size: 9px; color: var(--accent-gold);
  letter-spacing: 0.5px; margin-bottom: 20px;
}
.badge .dot {
  width: 6px; height: 6px; background: var(--accent-green);
  box-shadow: 0 0 8px var(--accent-green); animation: pixelBlink 1.6s infinite;
}
.hero-title {
  font-family: var(--font-pixel); font-size: 24px; line-height: 1.75;
  margin-bottom: 18px; font-weight: 400;
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
.terminal { background: var(--bg-deep); border: 1.5px solid var(--border-pixel); align-self: stretch; display: flex; flex-direction: column; }
.term-bar {
  display: flex; align-items: center; gap: 6px; padding: 9px 12px;
  border-bottom: 1px solid var(--border-pixel); background: rgba(255,255,255,0.02);
}
.term-bar i { width: 8px; height: 8px; display: block; }
.term-bar i:nth-child(1) { background: var(--error-red); }
.term-bar i:nth-child(2) { background: var(--accent-gold); }
.term-bar i:nth-child(3) { background: var(--accent-green); }
.term-bar span { margin-left: auto; font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); }
.term-body { padding: 16px; flex: 1; font-family: var(--font-pixel); font-size: 9px; line-height: 2.4; color: var(--text-secondary); }
.term-body .k { color: var(--accent-green); }
.term-body .v { color: var(--accent-gold); }
.term-body .muted { color: var(--text-muted); }
.term-body .sp { margin-top: 10px; }
.term-body .cursor { display: inline-block; width: 8px; height: 12px; background: var(--accent-green); vertical-align: middle; animation: pixelBlink 1s infinite; }

/* Stats */
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border-pixel); border: 1.5px solid var(--border-pixel); margin-top: 24px; }
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

/* Latest writing */
.writing-grid :deep(.post-list) { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.blog-cta {
  margin-top: 22px; border: 1.5px dashed var(--accent-green);
  background: rgba(74,222,128,0.03); padding: 22px;
  display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap;
}
.blog-cta-text { font-family: var(--font-pixel); font-size: 11px; color: var(--text-primary); line-height: 1.9; }
.blog-cta-text .g { color: var(--accent-green); }

@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .hero { padding: 22px 18px; }
  .hero-title { font-size: 15px; }
  .hero-sub { font-size: 14px; }
  .badge { font-size: 7px; }
  .stats { grid-template-columns: 1fr 1fr; }
  .section-title { font-size: 12px; }
  .writing-grid :deep(.post-list) { grid-template-columns: 1fr; }
  .blog-cta-text { font-size: 9px; }
}
</style>
