<template>
  <div class="pixel-widget">
    <h2 class="pixel-widget-title">Subscribe</h2>
    <p class="widget-desc">Get latest posts & dev updates</p>

    <!-- Success state -->
    <div v-if="status === 'success'" class="subscribe-success">
      <span class="success-icon">✓</span>
      <span>Verification email sent — check your inbox</span>
    </div>

    <!-- Error state -->
    <div v-else-if="status === 'error'" class="subscribe-error">
      <span class="error-icon">!</span>
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Loading / Form -->
    <form v-else @submit.prevent="handleSubmit" class="subscribe-form">
      <input
        v-model="email"
        type="email"
        placeholder="your@email.com"
        class="subscribe-input"
        :disabled="status === 'loading'"
        required
      />
      <button
        type="submit"
        class="subscribe-btn"
        :disabled="status === 'loading'"
      >
        <span v-if="status === 'loading'" class="btn-loading">··</span>
        <span v-else>Subscribe</span>
      </button>
    </form>

    <p class="widget-footnote">Low frequency · Unsubscribe anytime</p>
  </div>
</template>

<script setup lang="ts">
type Status = 'idle' | 'loading' | 'success' | 'error'

const email = ref('')
const status = ref<Status>('idle')
const errorMsg = ref('')

async function handleSubmit() {
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorMsg.value = 'Enter a valid email address'
    status.value = 'error'
    return
  }

  status.value = 'loading'
  errorMsg.value = ''

  try {
    const res = await $fetch('/api/subscribe', {
      method: 'POST',
      body: {
        email: email.value,
        source: 'sidebar',
      },
    })

    if (res.success) {
      status.value = 'success'
    } else {
      errorMsg.value = (res as any).message || 'Subscription failed'
      status.value = 'error'
    }
  } catch (e: any) {
    if (e.statusCode === 409) {
      errorMsg.value = 'Already subscribed'
    } else {
      errorMsg.value = e.statusMessage || 'Network error, try again later'
    }
    status.value = 'error'
  }
}
</script>

<style scoped>
.pixel-widget {
  background-color: rgba(255,255,255,0.015);
  border: 1.5px solid var(--border-pixel);
  padding: 18px 20px 20px;
}
.pixel-widget-title {
  font-family: var(--font-pixel);
  font-size: 13px;
  color: var(--accent-gold);
  border-bottom: 1px solid var(--border-pixel);
  padding-bottom: 8px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}
.pixel-widget-title::before { content: "▸"; color: var(--accent-green); font-size: 12px; }

.widget-desc {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--text-muted);
  margin: 0 0 10px;
  line-height: 1.5;
}

.subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.subscribe-input {
  width: 100%;
  padding: 8px 10px;
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--text-primary);
  background: var(--bg-deep);
  border: 1px solid var(--border-pixel);
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.subscribe-input:focus {
  border-color: var(--accent-green);
}
.subscribe-input:disabled {
  opacity: 0.5;
}

.subscribe-btn {
  width: 100%;
  padding: 8px;
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--accent-green);
  background: transparent;
  border: 1px solid var(--accent-green);
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.5px;
}
.subscribe-btn:hover:not(:disabled) {
  background: var(--accent-green);
  color: var(--bg-deep);
}
.subscribe-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.subscribe-success {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--accent-green);
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--accent-green);
  line-height: 1.5;
}
.success-icon {
  font-family: var(--font-pixel);
  font-size: 10px;
  flex-shrink: 0;
  margin-top: 2px;
}

.subscribe-error {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--error-red);
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--error-red);
  line-height: 1.5;
}
.error-icon {
  font-family: var(--font-pixel);
  font-size: 10px;
  flex-shrink: 0;
  margin-top: 2px;
}

.widget-footnote {
  font-family: var(--font-pixel);
  font-size: 7px;
  color: var(--text-muted);
  margin: 8px 0 0;
  text-align: center;
}
</style>
