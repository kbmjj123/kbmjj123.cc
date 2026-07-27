<template>
  <header class="app-header"
    :style="{ background: 'var(--color-header-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }">
    <div class="header-inner">
      <!-- Left: Logo -->
      <NuxtLink to="/" class="header-logo">
        <div class="logo-icon">N</div>
        <span class="logo-text">Nuxt<span class="org">Starter</span></span>
      </NuxtLink>

      <!-- Center: Search (desktop only) -->
      <div class="header-search-wrap">
        <div class="header-search" @click="console.log('search')">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span class="placeholder">Search...</span>
          <span class="kbd">⌘K</span>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="header-actions">
        <!-- Desktop: Submit + Auth -->
        <NuxtLink to="/" class="btn-header-submit desktop-only">
          CTA
        </NuxtLink>
        <div class="desktop-only"><AuthButton /></div>
        <ThemeToggle />
        <!-- Mobile hamburger -->
        <button class="hamburger-btn"
          style="color: var(--color-text-secondary)" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Toggle menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const isMobileMenuOpen = useState('mobileMenuOpen', () => false)
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 52px;
}
.header-inner {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 100%;
}
.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  text-decoration: none;
}
.header-search-wrap {
  flex: 1;
  display: none;
  justify-content: center;
  max-width: 420px;
  margin: 0 auto;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  margin-left: auto;
}
.desktop-only {
  display: none;
}
.hamburger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  flex-shrink: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}

@media (min-width: 640px) {
  .header-inner { gap: 16px; }
  .header-search-wrap { display: flex; }
  .header-actions { gap: 6px; }
  .desktop-only { display: flex; }
  .btn-header-submit.desktop-only { display: inline-flex; }
}
@media (min-width: 1024px) {
  .header-inner { padding: 0 24px; }
  .hamburger-btn { display: none; }
}
</style>
