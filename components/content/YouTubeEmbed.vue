<template>
  <!--
    Lazy YouTube player — nothing from youtube.com loads until the user clicks.
    Keeps SSG pages light: a facade image instead of N heavy iframes.

    Usage anywhere in Vue:
      <YouTubeEmbed id="dQw4w9WgXcQ" title="My video" duration="PT12M34S" />

    Usage in Markdown (MDC), components/content/ is auto-registered:
      ::youtube-embed{id="dQw4w9WgXcQ" title="My video"}
      or simply <YouTubeEmbed id="dQw4w9WgXcQ" />
  -->
  <figure class="yt-embed" :id="anchorId">
    <div class="yt-frame" :class="{ 'is-playing': playing }">
      <iframe
        v-if="playing"
        class="yt-iframe"
        :src="embedUrl"
        :title="title || 'YouTube video player'"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
      <button
        v-else
        type="button"
        class="yt-facade"
        :aria-label="`Play video: ${title}`"
        @click="playing = true"
      >
        <VideoThumb :title="title" :poster="posterSrc" :duration="duration" />
        <span class="yt-hint">
          <span style="color:var(--accent-gold);">▶</span> {{ hintLabel }}
        </span>
      </button>
    </div>

    <figcaption v-if="showLink" class="yt-caption">
      <a :href="watchUrl" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { videoThumbnail, videoWatchUrl } from '~/composables/useVideos'

const props = withDefaults(defineProps<{
  /** YouTube video id */
  id: string
  title?: string
  /** ISO 8601 duration, e.g. PT12M34S */
  duration?: string
  /** Override thumbnail, defaults to i.ytimg.com */
  poster?: string
  /** Render an anchor id so /videos#<id> deep links can jump here */
  anchor?: boolean
  showLink?: boolean
}>(), {
  title: '',
  duration: '',
  poster: '',
  anchor: false,
  showLink: true,
})

const playing = ref(false)

const posterSrc = computed(() => props.poster?.trim() || (props.id ? videoThumbnail(props.id) : ''))
const watchUrl = computed(() => videoWatchUrl(props.id))
const embedUrl = computed(() => `https://www.youtube-nocookie.com/embed/${props.id}?autoplay=1&rel=0`)
const anchorId = computed(() => (props.anchor ? props.id : ''))
const hintLabel = computed(() => props.title || 'Click to play')
</script>

<style scoped>
.yt-embed {
  margin: 0;
}
.yt-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--bg-deep);
  border: 1.5px solid var(--border-pixel);
  overflow: hidden;
  line-height: 0;
}
.yt-frame:hover {
  border-color: var(--accent-green);
}
.yt-frame.is-playing {
  border-color: var(--accent-green);
}
.yt-facade {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  text-align: inherit;
}
.yt-facade:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}
.yt-facade:hover :deep(.vthumb-img) {
  transform: scale(1.02);
}
.yt-facade:hover :deep(.vthumb-play) {
  background: var(--accent-green);
  color: var(--bg-deep);
  box-shadow: 4px 4px 0 rgba(74, 222, 128, 0.25);
}
.yt-hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 6px 10px;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--text-secondary);
  background: linear-gradient(to top, rgba(11, 11, 18, 0.92), rgba(11, 11, 18, 0));
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.6;
}
.yt-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.yt-caption {
  margin-top: 6px;
  font-family: var(--font-pixel);
  font-size: 8px;
  line-height: 1.6;
}
.yt-caption a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.15s;
}
.yt-caption a:hover {
  color: var(--accent-green);
}
</style>
