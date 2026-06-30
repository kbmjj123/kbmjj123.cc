<template>
  <!-- Desktop sidebar -->
  <aside class="hidden lg:block fixed left-0 top-[52px] bottom-0 w-[220px] overflow-y-auto px-3 py-5"
    :style="{ background: 'var(--color-bg-base)', borderRight: '1px solid var(--color-border)' }">

    <!-- Stats (customize or remove) -->
    <div class="sidebar-stats">
      <div class="stat-item">
        <div class="stat-num">{{ stats.items }}</div>
        <div class="stat-label">Items</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">{{ stats.categories }}</div>
        <div class="stat-label">Categories</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">{{ stats.contributors }}</div>
        <div class="stat-label">Contributors</div>
      </div>
    </div>

    <!-- Main nav -->
    <div class="mb-1">
      <div class="nav-section-title">Browse</div>
      <NavItem v-for="item in mainNav" :key="item.label" :to="item.to" :icon="item.icon" :label="item.label" />
    </div>

    <!-- Categories -->
    <div class="widget">
      <div class="widget-title">Categories</div>
      <ul class="category-list">
        <li v-for="cat in categories" :key="cat.slug" class="category-item">
          <NuxtLink :to="`/?category=${cat.slug}`" class="category-link">
            <span class="category-name">{{ cat.name }}</span>
            <span class="count">{{ cat.count }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Bottom links -->
    <div class="mt-6 pt-4" :style="{ borderTop: '1px solid var(--color-border)' }">
      <NavItem to="#" label="Custom Link 1" />
      <NavItem to="#" label="Custom Link 2" />
      <NavItem to="#" label="Custom Link 3" />
    </div>
  </aside>

  <!-- Mobile drawer -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[60] lg:hidden" style="pointer-events: auto;">
        <Transition name="overlay">
          <div v-if="isMobileMenuOpen" class="absolute inset-0" :style="{ background: 'rgba(0,0,0,0.6)', pointerEvents: 'auto' }" @click="isMobileMenuOpen = false" />
        </Transition>
        <aside class="sidebar-drawer px-3 py-4">
          <div class="flex items-center justify-between mb-4 px-3">
            <NuxtLink to="/" class="flex items-center gap-2" @click="isMobileMenuOpen = false">
              <div class="logo-icon">N</div>
              <span class="logo-text">NuxtStarter</span>
            </NuxtLink>
            <button class="w-7 h-7 flex items-center justify-center rounded-md"
              style="color: var(--color-text-secondary)" @click="isMobileMenuOpen = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="nav-section-title">Browse</div>
          <NavItem v-for="item in mainNav" :key="item.label" :to="item.to" :icon="item.icon" :label="item.label" @click="isMobileMenuOpen = false" />
          <div class="nav-section-title">Categories</div>
          <NavItem v-for="cat in categories" :key="cat.slug" :to="`/?category=${cat.slug}`"
            :label="cat.name" @click="isMobileMenuOpen = false" />
          <div class="mt-6 pt-4" :style="{ borderTop: '1px solid var(--color-border)' }">
            <NavItem to="#" label="Custom Link 1" @click="isMobileMenuOpen = false" />
            <button v-if="auth?.isLoggedIn?.value && auth?.user?.value" class="nav-item w-full" @click="auth.logout(); isMobileMenuOpen = false">Sign Out</button>
            <button v-else class="nav-item w-full" @click="auth.login(); isMobileMenuOpen = false">Sign In</button>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const auth = useAuth()
const isMobileMenuOpen = useState('mobileMenuOpen')

const mainNav = [
  { label: 'Home', to: '/', icon: '🏠' },
  { label: 'Explore', to: '/', icon: '🔍' },
  { label: 'Bookmarks', to: '/', icon: '⭐' },
]

const categories = computed(() => [
  { slug: 'tools-workflow', name: 'Tools & Workflow', count: 1 },
  { slug: 'startup-diary', name: 'Startup Diary', count: 1 },
  { slug: 'dev-practice', name: 'Dev Practice', count: 1 },
])

// Lock body scroll when mobile menu is open
watch(isMobileMenuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

const stats = reactive({
  items: 100,
  categories: 3,
  contributors: 5,
})
</script>

<style scoped>
.widget {
  margin-bottom: 12px;
}
.widget-title {
  font-family: var(--font-pixel);
  font-size: 13px;
  color: var(--accent-gold);
  border-bottom: 1px solid var(--border-pixel);
  padding-bottom: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}
.widget-title::before { content: "▸"; color: var(--accent-green); font-size: 12px; }

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.category-item {
  border-bottom: 1px dotted var(--border-pixel);
  transition: background 0.15s ease;
}
.category-item:last-child { border-bottom: none; }
.category-item:hover {
  background: rgba(74, 222, 128, 0.04);
}
.category-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 6px;
  text-decoration: none;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.15s;
  cursor: pointer;
}
.category-item:hover .category-link { color: var(--accent-green); }

.category-name { font-weight: 450; }
.count {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--text-muted);
  background: var(--bg-deep);
  padding: 0 8px;
  border: 1px solid var(--border-pixel);
  transition: border-color 0.15s, color 0.15s;
}
.category-item:hover .count {
  border-color: var(--accent-green);
  color: var(--accent-green);
}
</style>
