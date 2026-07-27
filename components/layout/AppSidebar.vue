<template>
  <!-- Desktop sidebar -->
  <aside class="sidebar-desktop"
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
    <div style="margin-bottom: 4px;">
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

    <!-- Subscribe -->
    <SubscribeWidget />

    <!-- Bottom links -->
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-border);">
      <NavItem to="#" label="Custom Link 1" />
      <NavItem to="#" label="Custom Link 2" />
      <NavItem to="#" label="Custom Link 3" />
    </div>
  </aside>

  <!-- Mobile drawer -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isMobileMenuOpen" class="mobile-overlay" style="pointer-events: auto;">
        <Transition name="overlay">
          <div v-if="isMobileMenuOpen" style="position:absolute;inset:0;background:rgba(0,0,0,0.6);pointer-events:auto;" @click="isMobileMenuOpen = false" />
        </Transition>
        <aside class="sidebar-drawer px-3 py-4">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:0 12px;">
            <NuxtLink to="/" style="display:flex;align-items:center;gap:8px;text-decoration:none;" @click="isMobileMenuOpen = false">
              <div class="logo-icon">N</div>
              <span class="logo-text">NuxtStarter</span>
            </NuxtLink>
            <button style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:transparent;border:none;color:var(--color-text-secondary);cursor:pointer;"
              @click="isMobileMenuOpen = false">
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
          <SubscribeWidget />
          <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--color-border);">
            <NavItem to="#" label="Custom Link 1" @click="isMobileMenuOpen = false" />
            <button v-if="auth?.isLoggedIn?.value && auth?.user?.value" class="nav-item" style="width:100%;" @click="auth.logout(); isMobileMenuOpen = false">Sign Out</button>
            <button v-else class="nav-item" style="width:100%;" @click="auth.login(); isMobileMenuOpen = false">Sign In</button>
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
.sidebar-desktop {
  display: none;
  position: fixed;
  left: 0;
  top: 52px;
  bottom: 0;
  width: 220px;
  overflow-y: auto;
  padding: 20px 12px;
}
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
}

@media (min-width: 1024px) {
  .sidebar-desktop { display: block; }
}
</style>
