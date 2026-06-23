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
    <div class="pixel-body-wrapper" style="padding:20px;display:flex;justify-content:center;min-height:100vh;">
      <div class="pixel-container" style="max-width:1150px;width:100%;position:relative;">

        <!-- Header (sticky) -->
        <header class="pixel-header" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:0;padding:12px 0 16px;border-bottom:1px solid var(--border-pixel);position:sticky;top:0;z-index:100;background:var(--bg-deep);gap:8px 0;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
          <NuxtLink to="/" style="display:flex;align-items:center;text-decoration:none;">
            <div class="site-title" style="font-family:var(--font-pixel);font-size:20px;color:var(--accent-green);text-shadow:2px 2px 0 rgba(0,0,0,0.8);display:flex;align-items:center;gap:10px;white-space:nowrap;">
              <span style="display:inline-block;width:14px;height:14px;background:var(--accent-gold);border:2px solid var(--accent-gold);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 3s ease-in-out infinite;"></span>
              <span style="color:var(--accent-green);">KB</span>
              <span style="color:var(--accent-gold);letter-spacing:0.1em;">MJJ123</span>
              <span style="color:var(--text-muted);font-size:12px;margin-left:2px;font-family:var(--font-ui);">.cc</span>
              <span style="font-family:var(--font-ui);font-size:13px;font-weight:400;color:var(--text-secondary);margin-left:6px;background:rgba(74,222,128,0.06);padding:0 10px;border:1px solid var(--border-pixel);">✦ Indie Log</span>
            </div>
          </NuxtLink>

          <!-- Desktop nav -->
          <nav class="pixel-nav pixel-nav-desktop">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" class="pixel-nav-link" :class="{ active: isActive(item.path) }">
              {{ item.label }}
            </NuxtLink>
          </nav>

          <!-- Mobile hamburger -->
          <button class="pixel-hamburger" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </header>

        <!-- Mobile drawer overlay -->
        <Transition name="drawer">
          <div v-if="mobileMenuOpen" class="pixel-drawer-overlay" @click="mobileMenuOpen = false">
            <aside class="pixel-drawer" @click.stop>
              <div class="pixel-drawer-header">
                <NuxtLink to="/" style="display:flex;align-items:center;gap:6px;text-decoration:none;" @click="mobileMenuOpen = false">
                  <span style="display:inline-block;width:10px;height:10px;background:var(--accent-gold);border:2px solid var(--accent-gold);box-shadow:0 0 0 2px var(--bg-deep);flex-shrink:0;"></span>
                  <span style="font-family:var(--font-pixel);font-size:12px;color:var(--accent-green);letter-spacing:0.5px;">KB<span style="color:var(--accent-gold);">MJJ123</span></span>
                  <span style="font-family:var(--font-ui);font-size:10px;font-weight:400;color:var(--text-muted);">.cc</span>
                </NuxtLink>
                <button class="pixel-drawer-close" @click="mobileMenuOpen = false">&#10005;</button>
              </div>
              <nav class="pixel-drawer-nav">
                <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" class="pixel-drawer-link" :class="{ active: isActive(item.path) }" @click="mobileMenuOpen = false">
                  {{ item.label }}
                </NuxtLink>
              </nav>
            </aside>
          </div>
        </Transition>

        <!-- Main content + sidebar grid -->
        <div class="pixel-main-grid" style="display:grid;grid-template-columns:2.2fr 1fr;gap:36px;margin-top:40px;">
          <main>
            <slot />
          </main>
          <aside class="pixel-sidebar" style="display:flex;flex-direction:column;gap:28px;position:sticky;top:80px;align-self:start;">
            <PostSidebar v-if="isPostPage" />
            <template v-else>
              <!-- Categories widget -->
              <div class="pixel-widget">
                <h2 class="pixel-widget-title">Categories</h2>
                <ul class="pixel-category-list">
                  <li v-for="cat in categories" :key="cat.slug">
                    <h3 class="pixel-category-name"><NuxtLink :to="`/?category=${cat.slug}`">{{ cat.name }}</NuxtLink></h3>
                    <span class="pixel-category-count">{{ cat.count }}</span>
                  </li>
                </ul>
              </div>

              <!-- Tags widget -->
              <div class="pixel-widget">
                <h2 class="pixel-widget-title">Tags</h2>
                <div class="pixel-tag-cloud">
                  <NuxtLink v-for="t in tags.slice(0, 12)" :key="t.tag" :to="`/?tag=${t.tag.replace('#', '')}`" class="pixel-tag">{{ t.tag }}<sup style="color:var(--text-muted);margin-left:2px;">{{ t.count }}</sup></NuxtLink>
                </div>
              </div>

              <!-- Pixel counter -->
              <div class="pixel-widget" style="border-color:var(--border-pixel);background:rgba(0,0,0,0.2);">
                <div style="font-family:var(--font-pixel);font-size:9px;color:var(--text-muted);text-align:center;">
                  <span style="color:var(--accent-green);">◼</span> Pixels since 2026
                  <span style="color:var(--accent-gold);display:block;font-size:13px;margin-top:6px;letter-spacing:2px;">{{ `${postCount}`.padStart(7, '0') }}</span>
                  <span style="color:var(--text-muted);display:block;font-size:8px;margin-top:4px;">{{ catCount }} categories · {{ tags.length }} tags</span>
                </div>
              </div>
            </template>
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

const mobileMenuOpen = ref(false)

const isPostPage = computed(() => !!route.params.slug && !['about', 'archive', 'projects'].includes(route.params.slug as string))

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/archive', label: 'Archive' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
]

// Dynamic categories, tags, and stats from real posts
type Category = { slug: string; name: string; count: number }
type TagCount = { tag: string; count: number }

const categories = ref<Category[]>([])
const tags = ref<TagCount[]>([])
const postCount = ref(0)
const catCount = ref(0)

onMounted(async () => {
  try {
    const posts = JSON.parse(JSON.stringify(
      await queryCollection('posts').all()
    ))
    if (!posts) return

    const catMap = new Map<string, number>()
    const tagMap = new Map<string, number>()

    for (const p of posts) {
      const meta = typeof p.meta === 'string' ? JSON.parse(p.meta) : (p.meta || {})
      const cat = meta.category
      if (cat) catMap.set(cat, (catMap.get(cat) || 0) + 1)
      const tgs: string[] = meta.tags || []
      for (const t of tgs) tagMap.set(t, (tagMap.get(t) || 0) + 1)
    }

    // Map category slugs to display names
    const catNames: Record<string, string> = {
      'dev-practice': 'Dev Practice',
      'product-business': 'Product & Business',
      'indie-mindset': 'Indie Mindset',
      'tools-workflow': 'Tools & Workflow',
      'startup-diary': 'Startup Diary',
      'tech-trends': 'Tech Trends',
    }

    categories.value = [...catMap.entries()]
      .map(([slug, count]) => ({ slug, name: catNames[slug] || slug, count }))
      .sort((a, b) => b.count - a.count)

    tags.value = [...tagMap.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    postCount.value = posts.length
    catCount.value = categories.value.length
  } catch (e) {
    console.error('Failed to load sidebar data:', e)
  }
})

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/kbmjj123/kbmjj123.cc' },
  { label: 'Twitter', url: 'https://twitter.com/solomaker282' },
  { label: 'RSS', url: '/api/rss' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.pixel-body-wrapper { flex-direction: column; align-items: center; }
.pixel-container { padding: 0 24px 24px; flex: 1; display: flex; flex-direction: column; }
.pixel-main-grid { flex: 1; }

.pixel-nav-desktop {
  display: flex;
  gap: 28px;
  align-items: center;
}
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

.pixel-category-name {
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
  display: inline;
}
.pixel-category-name a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}
.pixel-category-name a:hover {
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

/* Hamburger button */
.pixel-hamburger {
  display: none; flex-direction: column; gap: 3px; cursor: pointer;
  background: none; border: 1.5px solid var(--border-pixel); padding: 6px 5px;
  width: 28px; height: 28px; justify-content: center; align-items: center;
}
.pixel-hamburger span {
  display: block; width: 14px; height: 1.5px; background: var(--text-secondary);
  border-radius: 1px;
}

/* Mobile drawer overlay */
.pixel-drawer-overlay {
  position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.6);
}
.pixel-drawer {
  position: fixed; top: 0; left: 0; bottom: 0; width: 260px; max-width: 80vw;
  background: var(--bg-card); border-right: 2px solid var(--border-pixel);
  display: flex; flex-direction: column; padding: 20px 16px;
  box-shadow: 4px 0 20px rgba(0,0,0,0.4);
}
.pixel-drawer-header {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 16px; border-bottom: 1px solid var(--border-pixel); margin-bottom: 20px;
}
.pixel-drawer-close {
  background: none; border: 1px solid var(--border-pixel); color: var(--text-muted);
  cursor: pointer; font-size: 12px; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-pixel);
}
.pixel-drawer-nav {
  display: flex; flex-direction: column; gap: 4px;
}
.pixel-drawer-link {
  font-family: var(--font-pixel); font-size: 10px; color: var(--text-secondary);
  text-decoration: none; padding: 10px 12px; border: 1.5px solid transparent;
  transition: all 0.15s ease;
}
.pixel-drawer-link:hover, .pixel-drawer-link.active {
  color: var(--accent-green); border-color: var(--accent-green);
  background: rgba(74,222,128,0.04);
}

/* Drawer animation */
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.2s ease; }
.drawer-enter-active .pixel-drawer, .drawer-leave-active .pixel-drawer { transition: transform 0.2s ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .pixel-drawer { transform: translateX(-100%); }
.drawer-leave-to .pixel-drawer { transform: translateX(-100%); }

/* Mobile: show hamburger, hide nav */
@media (max-width: 860px) {
  .pixel-nav-desktop { display: none !important; }
  .pixel-hamburger { display: flex !important; }
  .pixel-container { padding: 20px 18px 18px; }
  .pixel-main-grid { grid-template-columns: 1fr !important; gap: 28px; }
  .pixel-sidebar { display: none !important; }
  .site-title { font-size: 18px; }
}
@media (max-width: 480px) {
  .pixel-body-wrapper { padding: 8px !important; }
  .pixel-container { padding: 10px 8px; }
  .site-title { font-size: 15px; }
}
</style>
