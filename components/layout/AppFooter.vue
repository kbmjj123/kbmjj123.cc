<template>
  <footer class="app-footer"
    :style="{ borderTop: '1px solid var(--color-border)' }">
    <div style="max-width:1400px;margin:0 auto;">
      <p class="footer-text" style="color: var(--color-text-muted)">
        <NuxtLink to="/" style="color: var(--color-text-secondary)">Nuxt Starter</NuxtLink>
        &nbsp;&mdash;&nbsp;Your next project starts here.
        <br class="footer-br" />
        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
          style="color: var(--color-text-secondary)">GitHub</a>
        &nbsp;&middot;&nbsp;Built with Nuxt &amp; Cloudflare
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  padding: 32px 24px;
  text-align: center;
}
.footer-text {
  font-family: var(--font-body);
  font-size: 12px;
}
.footer-br {
  display: none;
}

@media (max-width: 640px) {
  .footer-br { display: inline; }
}
@media (min-width: 1024px) {
  .app-footer { padding-left: calc(220px + 24px); }
}
</style>
