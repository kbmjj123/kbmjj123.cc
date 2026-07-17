<template>
  <!-- PhotoSwipe mount (PS5 sets position:fixed, no extra positioning needed) -->
  <Teleport to="body">
    <div ref="pswpMount" />
  </Teleport>

  <!-- Pixel-style custom UI overlay -->
  <Teleport to="body">
    <div
      v-if="preview.isReady.value"
      class="preview-overlay"
    >
      <!-- ════ Top bar: close + counter ════ -->
      <div class="preview-top-bar">
        <button
          type="button"
          class="preview-btn"
          title="Close (Esc)"
          @click="handleClose"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <span class="preview-counter">
          {{ preview.currentIndex.value + 1 }} / {{ preview.totalSlides.value }}
        </span>

        <div class="preview-spacer" />
      </div>

      <!-- ════ Bottom bar: zoom + thumbnails ════ -->
      <div class="preview-bottom-bar">
        <!-- Zoom controls -->
        <div class="preview-zoom-row">
          <button
            type="button"
            class="preview-icon-btn"
            :disabled="!canZoomOut"
            title="Zoom out"
            @click="preview.zoomOut()"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35M8 11h6" />
            </svg>
          </button>

          <span class="preview-zoom-level">{{ preview.zoomLevel.value }}%</span>

          <button
            type="button"
            class="preview-icon-btn"
            :disabled="!canZoomIn"
            title="Zoom in"
            @click="preview.zoomIn()"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35M8 11h6M11 8v6" />
            </svg>
          </button>

          <div class="preview-divider" />

          <button
            type="button"
            class="preview-icon-btn"
            title="Download"
            @click="handleDownload"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </button>
        </div>

        <!-- Thumbnail strip -->
        <div ref="thumbScrollRef" class="preview-thumb-strip">
          <button
            v-for="(file, i) in files"
            :key="i"
            type="button"
            class="preview-thumb"
            :class="{ active: preview.currentIndex.value === i }"
            @click="preview.goTo(i)"
          >
            <img
              :src="file.url"
              :alt="file.alt || ''"
              loading="lazy"
              draggable="false"
            />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { PreviewImage } from '~/composables/useImagePreview'

const props = defineProps<{
  files: PreviewImage[]
  startIndex: number
}>()

const emit = defineEmits<{
  close: []
}>()

// PhotoSwipe mount
const pswpMount = ref<HTMLDivElement>()
const thumbScrollRef = ref<HTMLDivElement>()

const preview = useImagePreview()

// Zoom boundaries
const canZoomOut = computed(() => preview.zoomLevel.value > 10)
const canZoomIn = computed(() => preview.zoomLevel.value < 500)

// ── Lifecycle ─────────────────────────────────────────

onMounted(() => {
  if (!pswpMount.value) return

  preview.open({
    files: props.files,
    startIndex: props.startIndex,
    appendToEl: pswpMount.value,
    padding: { top: 48, bottom: 120, left: 0, right: 0 },
  }).then(() => {
    preview.onDestroy(() => {
      emit('close')
    })
  })
})

onUnmounted(() => {
  preview.destroy()
})

// ── Handlers ─────────────────────────────────────────

function handleClose() {
  preview.close()
}

function handleDownload() {
  const file = props.files[preview.currentIndex.value]
  if (!file) return
  const a = document.createElement('a')
  a.href = file.url
  a.download = file.url.split('/').pop() || 'image'
  a.click()
}

// Auto-scroll thumbnail to center active one
watch(
  () => preview.currentIndex.value,
  (idx) => {
    const el = thumbScrollRef.value
    if (!el) return
    const child = el.children[idx] as HTMLElement | undefined
    if (!child) return
    const scrollLeft = child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2
    el.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  },
)
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   Pixel Preview Overlay
   Matches blog theme: --bg-deep, --border-pixel,
   --accent-green, --accent-gold, --font-pixel
═══════════════════════════════════════════════════ */

.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 100001;
  pointer-events: none;
}

/* ── Top bar ──────────────────────────────────── */

.preview-top-bar {
  position: absolute;
  inset-inline: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 12px;
  pointer-events: auto;
  background: rgba(11, 11, 18, 0.88);
  border-bottom: 1px solid var(--border-pixel, #2a2a42);
}

.preview-spacer {
  flex: 1;
}

.preview-counter {
  font-family: var(--font-pixel, 'Press Start 2P', monospace);
  font-size: 10px;
  color: var(--accent-gold, #fbbf24);
  user-select: none;
  white-space: nowrap;
}

/* ── Bottom bar ───────────────────────────────── */

.preview-bottom-bar {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 12px;
  pointer-events: auto;
  background: rgba(11, 11, 18, 0.88);
  border-top: 1px solid var(--border-pixel, #2a2a42);
}

.preview-zoom-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.preview-zoom-level {
  font-family: var(--font-pixel, 'Press Start 2P', monospace);
  font-size: 9px;
  color: var(--text-secondary, #9aa8c9);
  min-width: 48px;
  text-align: center;
  user-select: none;
}

.preview-divider {
  width: 1px;
  height: 16px;
  background: var(--border-pixel, #2a2a42);
  margin: 0 4px;
}

/* ── Buttons ──────────────────────────────────── */

.preview-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: transparent;
  border: 1px solid var(--border-pixel, #2a2a42);
  color: var(--text-secondary, #9aa8c9);
  cursor: pointer;
  transition: all 0.15s ease;
}

.preview-btn:hover {
  border-color: var(--accent-green, #4ade80);
  color: var(--accent-green, #4ade80);
  background: rgba(74, 222, 128, 0.06);
}

.preview-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid var(--border-pixel, #2a2a42);
  color: var(--text-muted, #4d5a7a);
  cursor: pointer;
  transition: all 0.15s ease;
}

.preview-icon-btn:hover:not(:disabled) {
  border-color: var(--accent-green, #4ade80);
  color: var(--accent-green, #4ade80);
  background: rgba(74, 222, 128, 0.06);
}

.preview-icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ── Thumbnail strip ──────────────────────────── */

.preview-thumb-strip {
  display: flex;
  justify-content: center;
  gap: 6px;
  overflow-x: auto;
  padding: 2px 0;
  -webkit-overflow-scrolling: touch;
}

.preview-thumb-strip::-webkit-scrollbar {
  height: 4px;
}
.preview-thumb-strip::-webkit-scrollbar-track {
  background: transparent;
}
.preview-thumb-strip::-webkit-scrollbar-thumb {
  background: var(--border-pixel, #2a2a42);
  border: 1px solid var(--accent-green, #4ade80);
}
.preview-thumb-strip::-webkit-scrollbar-thumb:hover {
  background: var(--accent-green, #4ade80);
}

.preview-thumb {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 0;
  overflow: hidden;
  border: 2px solid var(--border-pixel, #2a2a42);
  background: var(--bg-deep, #0b0b12);
  cursor: pointer;
  padding: 0;
  transition: all 0.15s ease;
}

.preview-thumb:hover {
  border-color: var(--accent-green, #4ade80);
  opacity: 0.85;
}

.preview-thumb.active {
  border-color: var(--accent-green, #4ade80);
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.3);
  opacity: 1;
}

.preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Responsive ───────────────────────────────── */

@media (max-width: 480px) {
  .preview-top-bar {
    height: 42px;
    padding: 0 8px;
  }

  .preview-bottom-bar {
    padding: 8px 8px 10px;
    gap: 6px;
  }

  .preview-thumb {
    width: 40px;
    height: 40px;
  }

  .preview-counter {
    font-size: 8px;
  }

  .preview-zoom-level {
    font-size: 8px;
    min-width: 36px;
  }
}
</style>
