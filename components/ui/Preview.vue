<template>
  <!-- PhotoSwipe 挂载点（PS5 自设 position:fixed, 此 div 无需定位样式） -->
  <Teleport to="body">
    <div ref="pswpMount" />
  </Teleport>

  <!-- 自定义 UI 覆盖层 -->
  <Teleport to="body">
    <div
      v-if="preview.isReady.value"
      class="fixed inset-0 z-[100001] pointer-events-none"
    >
      <!-- ════ 上部区域 ════ -->
      <div class="pointer-events-auto absolute inset-x-0 top-0">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between px-4 h-12">
          <button
            type="button"
            class="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white transition-all"
            :title="t('common.close')"
            @click="handleClose"
          >
            <Icon name="lucide:x" class="h-5 w-5" />
          </button>

          <span class="text-sm font-medium text-white/80 select-none">
            {{ preview.currentIndex.value + 1 }} / {{ preview.totalSlides.value }}
          </span>

          <button
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white text-xs font-semibold transition-all"
            @click="handleDownloadAll"
          >
            <Icon name="lucide:download" class="h-3.5 w-3.5" />
            {{ t('result.download_zip') }}
          </button>
        </div>
      </div>

      <!-- ════ 下部区域 ════ -->
      <div class="pointer-events-auto absolute inset-x-0 bottom-0">
        <!-- 控制栏 -->
        <div class="flex items-center justify-center gap-3 h-12 px-4">
          <button
            type="button"
            class="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md text-white/70 hover:bg-white/20 hover:text-white transition-all disabled:opacity-30"
            :disabled="!canZoomOut"
            @click="preview.zoomOut()"
          >
            <Icon name="lucide:zoom-out" class="h-4 w-4" />
          </button>

          <span class="text-xs font-medium text-white/60 w-12 text-center select-none tabular-nums">
            {{ preview.zoomLevel.value }}%
          </span>

          <button
            type="button"
            class="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md text-white/70 hover:bg-white/20 hover:text-white transition-all disabled:opacity-30"
            :disabled="!canZoomIn"
            @click="preview.zoomIn()"
          >
            <Icon name="lucide:zoom-in" class="h-4 w-4" />
          </button>

          <div class="w-px h-5 bg-white/10 mx-1" />

          <button
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md text-white/70 hover:bg-white/20 hover:text-white text-xs font-semibold transition-all"
            @click="handleDownloadSingle"
          >
            <Icon name="lucide:download" class="h-3.5 w-3.5" />
            {{ t('result.gallery_download') }}
          </button>
        </div>

        <!-- 缩略图条 -->
        <div class="h-20 md:h-[88px] px-4 pb-3">
          <div
            ref="thumbScrollRef"
            class="flex justify-center gap-2 h-full overflow-x-auto scrollbar-hide items-center"
            style="-webkit-overflow-scrolling: touch"
          >
            <button
              v-for="(file, i) in files"
              :key="file.id"
              type="button"
              class="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none"
              :class="preview.currentIndex.value === i
                ? 'border-primary-500 shadow-lg shadow-primary-500/30 scale-105'
                : 'border-white/15 hover:border-white/40 opacity-60 hover:opacity-90'"
              @click="preview.goTo(i)"
            >
              <video v-if="isVideoFile(file)" :src="file.url" muted autoplay loop playsinline class="w-full h-full object-cover" preload="auto" />
              <img v-else :src="file.url" :alt="file.name" class="w-full h-full object-cover" loading="lazy" draggable="false" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ProcessedFile } from '~/types/result'

const props = defineProps<{
  files: ProcessedFile[]
  startIndex: number
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const isVideoFile = (file: ProcessedFile): boolean =>
  file.blob?.type?.startsWith('video/') ?? false

// PhotoSwipe mount
const pswpMount = ref<HTMLDivElement>()
const thumbScrollRef = ref<HTMLDivElement>()

const preview = useImagePreview()

// Zoom boundaries
const canZoomOut = computed(() => preview.zoomLevel.value > 10)
const canZoomIn = computed(() => preview.zoomLevel.value < 500)

// ── Lifecycle ──────────────────────────────────────────────

onMounted(() => {
  if (!pswpMount.value) return

  const topPad = 48 + (showAd.value ? 120 : 0)

  preview.open({
    files: props.files.map((f) => ({
      url: f.url,
      width: f.width || 1200,
      height: f.height || 800,
      alt: f.name,
    })),
    startIndex: props.startIndex,
    appendToEl: pswpMount.value,
    padding: { top: topPad, bottom: 140, left: 0, right: 0 },
  }).then(() => {
    // 等待 open() 完成（pswp 实例创建）后才可注册 destroy 回调
    preview.onDestroy(() => {
      emit('close')
    })
  })
})

onUnmounted(() => {
  preview.destroy()
})

// ── Handlers ───────────────────────────────────────────────

function handleClose() {
  preview.close()
  // onDestroy will emit event
}

async function handleDownloadAll() {
  const { downloadAsZip } = useImageProcessor()
  const blobs = props.files.map((f) => f.blob)
  const names = props.files.map((f) => f.name)
  try {
    await downloadAsZip(blobs, names, 'bulkpictools-preview.zip')
  } catch (e) {
    console.error('Preview download all failed:', e)
  }
}

function handleDownloadSingle() {
  const file = props.files[preview.currentIndex.value]
  if (!file) return
  const a = document.createElement('a')
  a.href = file.url
  a.download = file.name
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
