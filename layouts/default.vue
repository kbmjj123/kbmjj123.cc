<template>
  <div class="pixel-body pixel-scrollbar">
    <!-- Loading overlay (hides after load) -->
    <div v-if="showLoader" id="loader-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:var(--bg-deep);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;transition:opacity 0.5s ease;">
      <div style="display:grid;grid-template-columns:24px 24px;grid-template-rows:24px 24px;gap:6px;margin-bottom:28px;">
        <div style="background:var(--accent-green);border:2px solid var(--accent-green);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 1.2s ease-in-out infinite alternate;animation-delay:0s;"></div>
        <div style="background:var(--accent-green);border:2px solid var(--accent-green);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 1.2s ease-in-out infinite alternate;animation-delay:0.3s;"></div>
        <div style="background:var(--accent-green);border:2px solid var(--accent-green);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 1.2s ease-in-out infinite alternate;animation-delay:0.6s;"></div>
        <div style="background:var(--accent-green);border:2px solid var(--accent-green);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 1.2s ease-in-out infinite alternate;animation-delay:0.9s;"></div>
      </div>
      <div style="font-family:var(--font-pixel);font-size:14px;color:var(--accent-gold);letter-spacing:4px;animation:pixelBlink 1.6s step-end infinite;">LOADING</div>
    </div>

    <!-- Main container -->
    <div style="padding:20px;display:flex;justify-content:center;min-height:100vh;">
      <div class="pixel-container" style="max-width:1150px;width:100%;position:relative;">

        <!-- Header (sticky) -->
        <header class="pixel-header" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:0;padding:12px 0 16px;border-bottom:1px solid var(--border-pixel);position:sticky;top:0;z-index:100;background:var(--bg-deep);gap:8px 0;">
          <NuxtLink to="/" style="display:flex;align-items:center;text-decoration:none;">
            <div class="site-title" style="font-family:var(--font-pixel);font-size:20px;color:var(--accent-green);text-shadow:2px 2px 0 rgba(0,0,0,0.8);display:flex;align-items:center;gap:10px;white-space:nowrap;">
              <span style="display:inline-block;width:14px;height:14px;background:var(--accent-gold);border:2px solid var(--accent-gold);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 3s ease-in-out infinite;"></span>
              <span style="color:var(--accent-green);">KB</span>
              <span style="color:var(--accent-gold);letter-spacing:0.1em;">MJJ123</span>
              <span style="color:var(--text-muted);font-size:12px;margin-left:2px;font-family:var(--font-ui);">.cc</span>
              <span style="font-family:var(--font-ui);font-size:13px;font-weight:400;color:var(--text-secondary);margin-left:6px;background:rgba(74,222,128,0.06);padding:0 10px;border:1px solid var(--border-pixel);">✦ Indie Log</span>
            </div>
          </NuxtLink>
          <nav class="pixel-nav" style="display:flex;gap:4px 16px;font-family:var(--font-pixel);font-size:10px;white-space:nowrap;">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" class="pixel-nav-link" :class="{ active: isActive(item.path) }">
              {{ item.label }}
            </NuxtLink>
          </nav>
        </header>

        <!-- Main content + sidebar grid -->
        <div class="pixel-main-grid" style="display:grid;grid-template-columns:2.2fr 1fr;gap:36px;margin-top:40px;">
          <main>
            <slot />
          </main>
          <aside class="pixel-sidebar" style="display:flex;flex-direction:column;gap:28px;">
            <!-- About widget -->
            <div class="pixel-widget">
              <div class="pixel-widget-title">About</div>
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <div style="width:44px;height:44px;background:var(--bg-deep);border:2px solid var(--accent-green);display:flex;align-items:center;justify-content:center;font-size:20px;font-family:var(--font-pixel);color:var(--accent-green);flex-shrink:0;">👨‍💻</div>
                <span style="font-family:var(--font-pixel);font-size:9px;color:var(--text-secondary);">@kbmjj123</span>
              </div>
              <p style="font-size:14px;color:var(--text-secondary);line-height:1.8;">
                <strong style="color:var(--text-primary);">Indie Developer</strong> · Full-stack &amp; product design.<br />
                Building with <span style="color:var(--accent-gold);">craft</span> &amp; <span style="color:var(--accent-green);">simplicity</span>.
              </p>
              <div style="margin-top:8px;font-family:var(--font-pixel);font-size:9px;color:var(--text-muted);border-top:1px dashed var(--border-pixel);padding-top:10px;">⚡ Currently: PixelFlow</div>
            </div>

            <!-- Categories widget -->
            <div class="pixel-widget">
              <div class="pixel-widget-title">Categories</div>
              <ul class="pixel-category-list">
                <li v-for="cat in categories" :key="cat.name">
                  <NuxtLink :to="cat.to">{{ cat.name }}</NuxtLink>
                  <span class="pixel-category-count">{{ cat.count }}</span>
                </li>
              </ul>
            </div>

            <!-- Tags widget -->
            <div class="pixel-widget">
              <div class="pixel-widget-title">Tags</div>
              <div class="pixel-tag-cloud">
                <NuxtLink v-for="tag in tags" :key="tag" to="#" class="pixel-tag">{{ tag }}</NuxtLink>
              </div>
            </div>

            <!-- Pixel counter -->
            <div class="pixel-widget" style="border-color:var(--border-pixel);background:rgba(0,0,0,0.2);">
              <div style="font-family:var(--font-pixel);font-size:9px;color:var(--text-muted);text-align:center;">
                <span style="color:var(--accent-green);">◼</span> Pixels since 2026
                <span style="color:var(--accent-gold);display:block;font-size:13px;margin-top:6px;letter-spacing:2px;">0 0 0 0 0 1 4</span>
              </div>
            </div>
          </aside>
        </div>

        <!-- Footer -->
        <footer style="margin-top:36px;padding-top:20px;border-top:1px solid var(--border-pixel);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-muted);font-family:var(--font-pixel);">
          <span><span style="color:#f472b6;">♥</span> 2026 <span style="color:var(--accent-green);">kbmjj123.cc</span></span>
          <span style="font-size:9px;letter-spacing:0.5px;">✦ pixel · indie · craft ✦</span>
          <div style="display:flex;gap:0;">
            <a v-for="link in socialLinks" :key="link.label" :href="link.url" style="color:var(--text-muted);text-decoration:none;margin-left:18px;transition:color 0.15s;font-size:10px;" @mouseenter="$event.target.style.color='var(--accent-green)'" @mouseleave="$event.target.style.color='var(--text-muted)'">{{ link.label }}</a>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const showLoader = ref(true)

onMounted(() => {
  setTimeout(() => { showLoader.value = false }, 600)
})

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/archive', label: 'Archive' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
]

const categories = [
  { name: 'Dev Practice', count: 14, to: '#' },
  { name: 'Product & Business', count: 9, to: '#' },
  { name: 'Indie Mindset', count: 7, to: '#' },
  { name: 'Tools & Workflow', count: 6, to: '#' },
  { name: 'Startup Diary', count: 5, to: '#' },
  { name: 'Tech Trends', count: 4, to: '#' },
]

const tags = ['#javascript', '#typescript', '#vue', '#nuxt', '#tailwind', '#cloudflare', '#product', '#indiehackers', '#startup']

const socialLinks = [
  { label: 'GitHub', url: '#' },
  { label: 'Twitter', url: '#' },
  { label: 'RSS', url: '#' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.pixel-container { padding: 0 24px 24px; }

.pixel-nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 4px 6px;
  border: 1.5px solid transparent;
  transition: all 0.15s ease;
  letter-spacing: 0.3px;
}
.pixel-nav-link:hover,
.pixel-nav-link.active {
  color: var(--accent-green);
  border-color: var(--accent-green);
  background: rgba(74,222,128,0.04);
}
.pixel-nav-link::before {
  content: "[";
  color: var(--text-muted);
  margin-right: 2px;
}
.pixel-nav-link::after {
  content: "]";
  color: var(--text-muted);
  margin-left: 2px;
}
.pixel-nav-link:hover::before,
.pixel-nav-link:hover::after,
.pixel-nav-link.active::before,
.pixel-nav-link.active::after {
  color: var(--accent-green);
}

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

.pixel-category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.pixel-category-list li {
  padding: 6px 0;
  border-bottom: 1px dotted var(--border-pixel);
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}
.pixel-category-list li:last-child { border-bottom: none; }
.pixel-category-list a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}
.pixel-category-list a:hover { color: var(--accent-green); }
.pixel-category-count {
  color: var(--text-muted);
  font-family: var(--font-pixel);
  font-size: 9px;
  background: var(--bg-deep);
  padding: 0 8px;
  border: 1px solid var(--border-pixel);
}

.pixel-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.pixel-tag {
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text-muted);
  background: var(--bg-deep);
  border: 1px solid var(--border-pixel);
  padding: 3px 10px;
  text-decoration: none;
  transition: all 0.15s ease;
  letter-spacing: 0.3px;
}
.pixel-tag:hover {
  color: var(--accent-green);
  border-color: var(--accent-green);
  background: rgba(74,222,128,0.04);
}

@media (max-width: 860px) {
  .pixel-container { padding: 20px 18px 18px; }
  .pixel-main-grid { grid-template-columns: 1fr !important; gap: 28px; }
  .pixel-sidebar { display: none !important; }
  .site-title { font-size: 18px; }
  .pixel-nav { font-size: 9px; }
}
@media (max-width: 480px) {
  .pixel-container { padding: 14px 12px; }
  .site-title { font-size: 15px; }
}
</style>
