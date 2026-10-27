import videoData from '~/data/videos.json'
import type { VideoChannel, VideoData, VideoItem } from '~/types/video'

const data = videoData as VideoData

/** Parse ISO 8601 duration (`PT12M34S`) into total seconds */
function durationToSeconds(iso: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso.trim())
  if (!match) return 0
  const [, h, m, s] = match
  return Number(h || 0) * 3600 + Number(m || 0) * 60 + Number(s || 0)
}

/** `PT12M34S` → `12:34`, `PT1H02M09S` → `1:02:09` */
export function formatDuration(iso: string): string {
  const total = durationToSeconds(iso)
  if (total <= 0) return ''
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  return `${h > 0 ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`
}

/** Thumbnail endpoint — no API key, no network at runtime beyond the image itself */
export function videoThumbnail(id: string, quality: 'hqdefault' | 'maxresdefault' | 'mqdefault' = 'hqdefault'): string {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`
}

export function videoWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}

export function useVideos() {
  const channel = computed<VideoChannel>(() => data.channel)

  const videos = computed<VideoItem[]>(() =>
    [...(data.videos || [])].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    ),
  )

  const latest = computed<VideoItem[]>(() => {
    const featured = videos.value.filter(v => v.featured)
    const rest = videos.value.filter(v => !v.featured)
    return [...featured, ...rest]
  })

  return { channel, videos, latest, count: computed(() => videos.value.length) }
}
