<template>
  <section class="videos-page">
    <div class="videos-card">
      <h1>Videos</h1>
      <p class="videos-intro">
        Screen recordings and walkthroughs from the same projects I write about here —
        shipping tools, breaking things, and fixing them on camera.
      </p>

      <!-- Empty state -->
      <div v-if="videos.length === 0" class="videos-empty">
        <p>No videos yet. First one is being edited — check back soon.</p>
        <NuxtLink to="/">← Back to posts</NuxtLink>
      </div>

      <div v-else class="videos-grid">
        <article
          v-for="v in videos"
          :key="v.id"
          class="videos-item"
          itemscope
          itemtype="https://schema.org/VideoObject"
        >
          <YouTubeEmbed :id="v.id" :title="v.title" :duration="v.duration" anchor />

          <div class="videos-item-body">
            <h2 class="videos-item-title" itemprop="name">
              <NuxtLink :to="`/videos#${v.id}`">{{ v.title }}</NuxtLink>
            </h2>
            <div class="videos-item-meta">
              <time :datetime="v.publishedAt">{{ v.publishedAt }}</time>
              <span>⏱ {{ formatDuration(v.duration) }}</span>
            </div>
            <p class="videos-item-desc" itemprop="description">{{ v.description }}</p>
            <div v-if="v.tags?.length" class="videos-item-tags">
              <span v-for="t in v.tags" :key="t" class="videos-item-tag">{{ t }}</span>
            </div>
          </div>

          <meta itemprop="thumbnailUrl" :content="videoThumbnail(v.id)" />
          <meta itemprop="uploadDate" :content="v.publishedAt" />
          <meta itemprop="contentUrl" :content="videoWatchUrl(v.id)" />
          <meta itemprop="duration" :content="v.duration" />
        </article>
      </div>

      <!-- Channel CTA — only once there is something to subscribe for -->
      <div v-if="videos.length" class="videos-cta">
        <div class="videos-cta-text">
          <span class="videos-cta-label">{{ channel.handle }}</span>
          <p>{{ channel.description }}</p>
        </div>
        <a
          :href="channel.url"
          target="_blank"
          rel="noopener noreferrer"
          class="videos-cta-btn"
        >Subscribe on YouTube</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { formatDuration, useVideos, videoThumbnail, videoWatchUrl } from '~/composables/useVideos'

usePageSeo({
  title: 'Videos',
  description: 'YouTube videos from kbmjj123.cc — building web products, shipping side projects, and walking through what actually worked.',
  template: 'prefix',
})

const { channel, videos } = useVideos()
</script>

<style scoped>
.videos-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.videos-card {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1.5px solid var(--border-pixel);
  padding: 28px 30px 30px;
  position: relative;
}
.videos-card::before {
  content: "◆";
  color: var(--accent-green);
  font-size: 8px;
  position: absolute;
  top: -5px;
  left: 14px;
  background: var(--bg-card);
  padding: 0 4px;
}
.videos-card h1 {
  font-family: var(--font-pixel);
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 10px;
}
.videos-intro {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.9;
  border-bottom: 1px dashed var(--border-pixel);
  padding-bottom: 18px;
  margin-bottom: 24px;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.videos-item {
  display: flex;
  flex-direction: column;
  scroll-margin-top: 90px;
}
.videos-item-body {
  padding-top: 12px;
}
.videos-item-title {
  font-family: var(--font-pixel);
  font-size: 11px;
  line-height: 1.8;
  font-weight: 400;
  margin-bottom: 10px;
}
.videos-item-title a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.15s;
}
.videos-item-title a:hover {
  color: var(--accent-green);
}
.videos-item-meta {
  display: flex;
  gap: 14px;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text-muted);
  padding-bottom: 10px;
  border-bottom: 1px dotted var(--border-pixel);
}
.videos-item-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin: 10px 0 0;
}
.videos-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.videos-item-tag {
  font-family: var(--font-pixel);
  font-size: 7px;
  color: var(--text-muted);
  background: var(--bg-deep);
  border: 1px solid var(--border-pixel);
  padding: 3px 8px;
}

/* Empty state */
.videos-empty {
  text-align: center;
  padding: 40px 20px;
  border: 1px dashed var(--border-pixel);
}
.videos-empty p {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--text-muted);
  line-height: 2;
  margin-bottom: 18px;
}
.videos-empty a {
  font-family: var(--font-pixel);
  font-size: 9px;
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
  padding: 6px 18px;
  text-decoration: none;
}

/* Channel CTA */
.videos-cta {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-deep);
  border: 1.5px solid var(--border-pixel);
  border-left: 3px solid var(--accent-gold);
  padding: 18px 20px;
}
.videos-cta-label {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--accent-gold);
}
.videos-cta-text p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 8px 0 0;
}
.videos-cta-btn {
  flex-shrink: 0;
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--accent-green);
  border: 1.5px solid var(--accent-green);
  padding: 8px 20px;
  text-decoration: none;
  transition: all 0.15s ease;
  box-shadow: 2px 2px 0 rgba(74, 222, 128, 0.08);
}
.videos-cta-btn:hover {
  background: var(--accent-green);
  color: var(--bg-deep);
  box-shadow: 4px 4px 0 rgba(74, 222, 128, 0.15);
}

@media (max-width: 860px) {
  .videos-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .videos-card { padding: 16px 14px 18px; }
  .videos-card h1 { font-size: 14px; }
  .videos-cta { flex-direction: column; align-items: flex-start; }
}
</style>
