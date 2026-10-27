<template>
  <NuxtLink
    :to="`/videos#${video.id}`"
    class="video-card"
    itemscope
    itemtype="https://schema.org/VideoObject"
  >
    <VideoThumb :title="video.title" :poster="videoThumbnail(video.id)" :duration="video.duration" />

    <div class="video-card-body">
      <h3 class="video-card-title" itemprop="name">{{ video.title }}</h3>
      <div class="video-card-meta">
        <time :datetime="video.publishedAt">{{ video.publishedAt }}</time>
        <span>{{ durationLabel }}</span>
      </div>
      <div v-if="video.tags?.length" class="video-card-tags">
        <span v-for="t in video.tags" :key="t" class="video-card-tag">{{ t }}</span>
      </div>
    </div>

    <meta itemprop="thumbnailUrl" :content="videoThumbnail(video.id)" />
    <meta itemprop="uploadDate" :content="video.publishedAt" />
    <meta itemprop="contentUrl" :content="videoWatchUrl(video.id)" />
    <meta itemprop="duration" :content="video.duration" />
    <meta itemprop="description" :content="video.description" />
  </NuxtLink>
</template>

<script setup lang="ts">
import { formatDuration, videoThumbnail, videoWatchUrl } from '~/composables/useVideos'
import type { VideoItem } from '~/types/video'

const props = defineProps<{ video: VideoItem }>()
const durationLabel = computed(() => formatDuration(props.video.duration))
</script>

<style scoped>
.video-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1.5px solid var(--border-pixel);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: pixelFadeUp 0.5s ease forwards;
}
.video-card:hover {
  border-color: var(--accent-green);
  box-shadow: 0 4px 16px rgba(74, 222, 128, 0.05);
  transform: translateY(-2px);
}
.video-card:hover .video-card-title {
  color: var(--accent-green);
}
.video-card:hover :deep(.vthumb-play) {
  background: var(--accent-green);
  color: var(--bg-deep);
}
.video-card-body {
  padding: 12px 14px 14px;
}
.video-card-title {
  font-family: var(--font-pixel);
  font-size: 10px;
  line-height: 1.8;
  color: var(--text-primary);
  margin: 0 0 10px;
  font-weight: 400;
  transition: color 0.15s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.video-card-meta {
  display: flex;
  gap: 12px;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text-muted);
  padding-bottom: 10px;
  border-bottom: 1px dotted var(--border-pixel);
}
.video-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}
.video-card-tag {
  font-family: var(--font-pixel);
  font-size: 7px;
  color: var(--text-muted);
  background: var(--bg-deep);
  border: 1px solid var(--border-pixel);
  padding: 2px 8px;
}
</style>
