<template>
  <div class="empty-container">
    <div class="empty-icon"></div>
    <h1 class="empty-title">✨ This space is empty</h1>
    <p class="empty-desc">
      {{ message || "No posts have been published yet." }}<br />
      {{ action || "Ready to write your first one?" }}
    </p>
    <NuxtLink v-if="showBack" to="/" class="empty-btn">✎ Create Post</NuxtLink>
    <div class="empty-footer">
      <NuxtLink to="/">← Back to home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
  action?: string
  showBack?: boolean
}>(), {
  showBack: true,
})
</script>

<style scoped>
.empty-container {
  max-width: 600px;
  width: 100%;
  background: var(--bg-card);
  border: 2px solid var(--accent-blue);
  padding: 56px 40px 40px;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(96,165,250,0.06);
  animation: pixelFadeUp 0.6s ease forwards;
  margin: 0 auto;
}
.empty-container::before {
  content: "";
  display: block;
  height: 3px;
  width: 100%;
  background: repeating-linear-gradient(90deg, var(--accent-blue) 0px, var(--accent-blue) 6px, transparent 6px, transparent 12px);
  margin-bottom: 28px;
  opacity: 0.6;
  background-size: 24px 100%;
  animation: pixelFlowLine 4s linear infinite;
}
.empty-icon {
  display: inline-block;
  width: 64px;
  height: 64px;
  background: transparent;
  border: 4px solid var(--accent-blue);
  position: relative;
  margin-bottom: 24px;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.4);
  animation: pulseIcon 2.4s ease-in-out infinite;
}
@keyframes pulseIcon {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.85; box-shadow: 0 0 12px rgba(96,165,250,0.2); }
}
.empty-icon::before,
.empty-icon::after {
  content: "";
  position: absolute;
  background: var(--accent-blue);
}
.empty-icon::before {
  width: 4px;
  height: 40px;
  top: 12px;
  left: 30px;
}
.empty-icon::after {
  width: 40px;
  height: 4px;
  top: 30px;
  left: 12px;
}
.empty-title {
  font-family: var(--font-pixel);
  font-size: 18px;
  color: var(--accent-blue);
  margin-bottom: 10px;
}
.empty-desc {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 28px;
  line-height: 1.8;
}
.empty-btn {
  display: inline-block;
  font-family: var(--font-pixel);
  font-size: 11px;
  color: var(--accent-blue);
  background: transparent;
  border: 2px solid var(--accent-blue);
  padding: 10px 24px;
  text-decoration: none;
  transition: all 0.15s ease;
  box-shadow: 2px 2px 0 rgba(96,165,250,0.08);
}
.empty-btn:hover {
  background: var(--accent-blue);
  color: var(--bg-deep);
  box-shadow: 4px 4px 0 rgba(96,165,250,0.15);
}
.empty-footer {
  margin-top: 28px;
  font-family: var(--font-pixel);
  font-size: 9px;
  color: var(--text-muted);
}
.empty-footer a {
  color: var(--text-secondary);
  text-decoration: none;
  border-bottom: 1px dashed var(--border-pixel);
  transition: color 0.15s;
}
.empty-footer a:hover { color: var(--accent-green); }
@media (max-width: 480px) {
  .empty-container { padding: 32px 20px 28px; }
  .empty-title { font-size: 15px; }
  .empty-icon { width: 48px; height: 48px; }
  .empty-icon::before { height: 28px; top: 10px; left: 22px; }
  .empty-icon::after { width: 28px; top: 22px; left: 10px; }
}
</style>
