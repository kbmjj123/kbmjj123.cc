<template>
  <div class="vthumb">
    <img
      v-if="posterSrc && !failed"
      :src="posterSrc"
      :alt="`Thumbnail — ${title}`"
      class="vthumb-img"
      loading="lazy"
      decoding="async"
      @error="failed = true"
    />
    <!-- Hand-drawn pixel fallback — used while placeholders replace real thumbnails,
         and whenever a YouTube thumbnail 404s (deleted/private video) -->
    <svg
      v-else
      class="vthumb-img"
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      :aria-label="`No thumbnail available — ${title}`"
    >
      <rect width="160" height="90" fill="var(--bg-deep)" />
      <g fill="var(--border-pixel)" opacity="0.55">
        <rect v-for="d in dots" :key="d" :x="4 + (d % 19) * 8" :y="8 + Math.floor(d / 19) * 9" width="1.5" height="1.5" />
      </g>
      <g fill="var(--accent-gold)">
        <rect x="66" y="28" width="44" height="7" />
        <rect x="66" y="35" width="36" height="7" />
        <rect x="66" y="42" width="28" height="7" />
        <rect x="66" y="49" width="20" height="7" />
        <rect x="66" y="56" width="12" height="7" />
      </g>
      <rect y="0" width="160" height="2" fill="var(--accent-green)" opacity="0.5" />
    </svg>

    <span v-if="durationLabel" class="vthumb-duration">{{ durationLabel }}</span>

    <span v-if="showPlay" class="vthumb-play" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14"><path d="M8 5v14l11-7z" /></svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { formatDuration } from '~/composables/useVideos'

const props = withDefaults(defineProps<{
  title: string
  poster?: string
  /** ISO 8601 duration, e.g. PT12M34S */
  duration?: string
  showPlay?: boolean
}>(), {
  poster: '',
  duration: '',
  showPlay: true,
})

const failed = ref(false)
const posterSrc = computed(() => props.poster?.trim() || '')
const durationLabel = computed(() => (props.duration ? formatDuration(props.duration) : ''))
const dots = Array.from({ length: 171 }, (_, i) => i)
</script>

<style scoped>
.vthumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-deep);
  border-bottom: 1.5px solid var(--border-pixel);
  line-height: 0;
}
.vthumb-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}
.vthumb-duration {
  position: absolute;
  right: 6px;
  bottom: 6px;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid var(--border-pixel);
  padding: 2px 6px;
  line-height: 1.4;
}
.vthumb-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 46px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-green);
  background: rgba(11, 11, 18, 0.82);
  border: 2px solid var(--accent-green);
  box-shadow: 3px 3px 0 rgba(74, 222, 128, 0.18);
  transition: all 0.15s ease;
  line-height: 1;
}
.vthumb-play svg {
  fill: currentColor;
}
</style>
