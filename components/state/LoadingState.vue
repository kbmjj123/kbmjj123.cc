<template>
  <div class="loading-state">
    <div style="display:grid;grid-template-columns:24px 24px;grid-template-rows:24px 24px;gap:6px;margin-bottom:28px;">
      <div style="background:var(--accent-green);border:2px solid var(--accent-green);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 1.2s ease-in-out infinite alternate;animation-delay:0s;"></div>
      <div style="background:var(--accent-green);border:2px solid var(--accent-green);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 1.2s ease-in-out infinite alternate;animation-delay:0.3s;"></div>
      <div style="background:var(--accent-green);border:2px solid var(--accent-green);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 1.2s ease-in-out infinite alternate;animation-delay:0.6s;"></div>
      <div style="background:var(--accent-green);border:2px solid var(--accent-green);box-shadow:0 0 0 2px var(--bg-deep);animation:pixelBlockPulse 1.2s ease-in-out infinite alternate;animation-delay:0.9s;"></div>
    </div>
    <div style="font-family:var(--font-pixel);font-size:14px;color:var(--accent-gold);letter-spacing:4px;animation:pixelBlink 1.6s step-end infinite;">LOADING</div>
  </div>
</template>

<style scoped>
.loading-state {
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:80px 20px;background:var(--bg-card);border:1.5px solid var(--border-pixel);
}
</style>
