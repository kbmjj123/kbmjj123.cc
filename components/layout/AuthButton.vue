<template>
  <div class="auth-wrap">
    <!-- Logged in: avatar + dropdown -->
    <div v-if="isLoggedIn && user" style="position:relative;" @click.stop>
      <button class="auth-trigger"
        :style="{ color: 'var(--color-text-secondary)' }"
        @click="dropdownOpen = !dropdownOpen">
        <div class="auth-avatar"
          :style="{ background: 'var(--color-accent)', color: '#000' }">
          {{ user.username[0]?.toUpperCase() }}
        </div>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div v-if="dropdownOpen" class="auth-dropdown"
        :style="{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-modal)' }"
        @click="dropdownOpen = false">
        <div class="auth-email" :style="{ color: 'var(--color-text-muted)' }">
          {{ user.email || user.username }}
        </div>
        <div :style="{ borderTop: '1px solid var(--color-border)' }" />
        <button class="auth-signout"
          :style="{ color: 'var(--color-text-secondary)' }"
          @click="logout">Sign Out</button>
      </div>
    </div>

    <!-- Not logged in: sign in button -->
    <button v-else class="auth-signin"
      :style="{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }"
      @click="login">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
      Sign in
    </button>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn, loading, login, logout } = useAuth()
const dropdownOpen = ref(false)

// Close dropdown on outside click
if (import.meta.client) {
  document.addEventListener('click', () => { dropdownOpen.value = false })
}
</script>

<style scoped>
.auth-wrap {
  display: flex;
  align-items: center;
}
.auth-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.auth-avatar {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 10px;
}
.auth-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  width: 176px;
  padding: 4px 0;
  border-radius: 10px;
  z-index: 50;
}
.auth-email {
  padding: 8px 12px;
  font-family: var(--font-body);
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.auth-signout {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  font-family: var(--font-body);
  font-size: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.auth-signin {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 11px;
  background: transparent;
  cursor: pointer;
}
</style>
