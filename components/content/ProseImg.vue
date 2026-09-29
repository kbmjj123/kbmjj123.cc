<template>
  <!--
    自定义图片组件 - 覆盖 Nuxt Content 的默认 ProseImg
    功能：
    - 桌面端/移动端响应式 picture（.webp → -m.webp）
    - 点击图片打开像素风格预览（画廊模式，支持前后切换）
  -->
  <span
    class="prose-img-wrap"
    :data-prose-img-src="src"
    :data-prose-img-width="width || 1200"
    :data-prose-img-height="height || 800"
    :data-prose-img-alt="alt || ''"
    @click="openPreview"
  >
    <picture>
      <source v-if="hasMobile" :media="`(min-width: 860px)`" :srcSet="src" type="image/webp" />
      <source v-if="hasMobile" :media="`(max-width: 859px)`" :srcSet="mobileSrc" type="image/webp" />
      <img
        :src="src"
        :alt="alt"
        :title="title"
        :width="width || 800"
        :height="height || 600"
        loading="lazy"
      />
    </picture>
    <!-- 悬停时显示放大镜指示器 -->
    <span class="prose-img-magnifier">🔍</span>
  </span>

  <!-- 单个预览实例，由共享状态控制显隐 -->
  <ClientOnly>
    <Preview
      v-if="previewActive"
      :files="previewFiles"
      :start-index="previewStartIndex"
      @close="closePreview"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import type { PreviewImage } from '~/composables/useImagePreview'

const props = defineProps<{
  src: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}>()

// 响应式图片切换逻辑
const isLocal = computed(() => props.src.startsWith('/'))
const isWebp = computed(() => props.src.endsWith('.webp'))
const mobileSrc = computed(() =>
  isLocal.value && isWebp.value
    ? props.src.replace(/\.webp$/, '-m.webp')
    : '',
)
const hasMobile = computed(() => isLocal.value && isWebp.value)

// ═════════════════════════════════════════════════════════
// 模块级共享预览状态
// 所有 ProseImg 实例共享 _gallery，确保一次只渲染一个 Preview
// 避免多个实例各自 Teleport mount div 到 body 导致冲突
// ═════════════════════════════════════════════════════════
const _gallery = reactive({
  images: [] as PreviewImage[],
  activeId: 0,
  startIndex: 0,
})

let _nextId = 1
const instanceId = ref(0)
const previewActive = computed(
  () => instanceId.value > 0 && _gallery.activeId === instanceId.value,
)

const previewFiles = computed(() => _gallery.images)
const previewStartIndex = computed(() => _gallery.startIndex)

onMounted(() => {
  instanceId.value = _nextId++
})

// ── 打开预览 ──

function openPreview() {
  const items = document.querySelectorAll('[data-prose-img-src]')
  if (!items.length) return

  _gallery.images = Array.from(items).map((el) => {
    const wrap = el as HTMLElement
    const imgEl = wrap.querySelector('img')
    // 优先使用实际图片尺寸，其次使用 data 属性，最后使用默认值
    const width = imgEl?.naturalWidth || parseInt(wrap.getAttribute('data-prose-img-width') || '0', 10) || 1200
    const height = imgEl?.naturalHeight || parseInt(wrap.getAttribute('data-prose-img-height') || '0', 10) || 800

    return {
      url: wrap.getAttribute('data-prose-img-src') || '',
      width,
      height,
      alt: wrap.getAttribute('data-prose-img-alt') || undefined,
    }
  })

  const idx = _gallery.images.findIndex((img) => img.url === props.src)
  _gallery.startIndex = Math.max(0, idx)
  _gallery.activeId = instanceId.value
}

function closePreview() {
  _gallery.activeId = 0
}
</script>

<style scoped>
.prose-img-wrap {
  display: inline-block;
  position: relative;
  cursor: zoom-in;
  max-width: 100%;
  line-height: 0;
}

.prose-img-wrap picture,
.prose-img-wrap img {
  display: block;
  max-width: 100%;
  height: auto;
}

/* 🔍 放大镜指示器 */
.prose-img-magnifier {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  user-select: none;
  backdrop-filter: blur(4px);
  line-height: 1;
}

.prose-img-wrap:hover .prose-img-magnifier {
  opacity: 1;
}

/* 确保 markdown 样式不干扰我们的布局 */
.prose-img-wrap :deep(img) {
  margin: 0 !important;
  border-radius: inherit;
}
</style>
