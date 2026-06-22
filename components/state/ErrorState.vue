<template>
  <div class="error-container">
    <div class="error-icon"></div>
    <h1 class="error-title">⚠️ Something went wrong</h1>
    <p class="error-desc">
      {{ message || "We couldn't load the data." }}<br />
      Please check your connection and try again.
    </p>
    <div class="error-actions">
      <button class="error-btn retry" @click="$emit('retry')">↻ Retry</button>
      <NuxtLink to="/" class="error-btn home">⌂ Home</NuxtLink>
    </div>
    <div class="error-footer" v-if="errorCode">
      <span>Error code: {{ errorCode }} · Please try later</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
  errorCode?: string
}>()
defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-container {
  max-width: 600px;
  width: 100%;
  background: var(--bg-card);
  border: 2px solid var(--error-red);
  padding: 48px 40px 40px;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(248,113,113,0.08);
  animation: pixelFadeUp 0.6s ease forwards;
  margin: 0 auto;
}
.error-container::before {
  content: "";
  display: block;
  height: 3px;
  width: 100%;
  background: repeating-linear-gradient(90deg, var(--error-red) 0px, var(--error-red) 6px, transparent 6px, transparent 12px);
  margin-bottom: 28px;
  opacity: 0.7;
  background-size: 24px 100%;
  animation: pixelFlowLine 4s linear infinite;
}
.error-icon {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 60px solid var(--error-red);
  position: relative;
  margin-bottom: 20px;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.5);
  animation: wobble 2.8s ease-in-out infinite;
}
@keyframes wobble {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}
.error-icon::after {
  content: "!";
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-pixel);
  font-size: 32px;
  color: var(--bg-deep);
  font-weight: bold;
}
.error-title {
  font-family: var(--font-pixel);
  font-size: 18px;
  color: var(--error-red);
  margin-bottom: 10px;
}
.error-desc {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 28px;
  line-height: 1.8;
}
.error-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}
.error-btn {
  display: inline-block;
  font-family: var(--font-pixel);
  font-size: 10px;
  padding: 10px 20px;
  text-decoration: none;
  transition: all 0.15s ease;
  border: 2px solid;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
  cursor: pointer;
  background: transparent;
}
.error-btn.retry {
  color: var(--error-red);
  border-color: var(--error-red);
}
.error-btn.retry:hover {
  background: var(--error-red);
  color: var(--bg-deep);
  box-shadow: 4px 4px 0 rgba(248,113,113,0.2);
}
.error-btn.home {
  color: var(--text-secondary);
  border-color: var(--border-pixel);
}
.error-btn.home:hover {
  color: var(--accent-green);
  border-color: var(--accent-green);
}
.error-footer {
  margin-top: 28px;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text-muted);
}
@media (max-width: 480px) {
  .error-container { padding: 32px 20px 28px; }
  .error-title { font-size: 15px; }
  .error-icon { border-left-width: 30px; border-right-width: 30px; border-bottom-width: 45px; }
  .error-icon::after { font-size: 24px; top: 10px; }
}
</style>
