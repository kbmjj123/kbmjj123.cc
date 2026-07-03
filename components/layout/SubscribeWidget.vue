<template>
  <div class="widget">
    <div class="widget-title">订阅更新</div>
    <p class="widget-desc">获取最新文章与独立开发动态</p>

    <!-- Success state -->
    <div v-if="status === 'success'" class="subscribe-success">
      <span class="success-icon">✓</span>
      <span>验证邮件已发送，请查收并确认</span>
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
        <span v-else>订阅</span>
      </button>
    </form>

    <p class="widget-footnote">不频繁 · 随时退订</p>
  </div>
</template>

<script setup lang="ts">
type Status = 'idle' | 'loading' | 'success' | 'error'

const email = ref('')
const status = ref<Status>('idle')
const errorMsg = ref('')

async function handleSubmit() {
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorMsg.value = '请输入有效的邮箱地址'
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
      errorMsg.value = (res as any).message || '订阅失败'
      status.value = 'error'
    }
  } catch (e: any) {
    if (e.statusCode === 409) {
      errorMsg.value = '该邮箱已订阅'
    } else {
      errorMsg.value = e.statusMessage || '网络错误，请稍后重试'
    }
    status.value = 'error'
  }
}
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
