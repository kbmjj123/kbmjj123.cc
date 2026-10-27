// ---------------------------------------------------------------------------
// YouTube video types — data is hand-authored in data/videos.json
// ---------------------------------------------------------------------------

/** A single published video */
export interface VideoItem {
  /** 11-character YouTube video id, e.g. `dQw4w9WgXcQ` */
  id: string
  title: string
  description: string
  /** Publish date — `YYYY-MM-DD` */
  publishedAt: string
  /** Duration as ISO 8601 for schema.org VideoObject, e.g. `PT12M34S` */
  duration: string
  tags: string[]
  /** Pin to the front of the homepage Latest Videos strip */
  featured?: boolean
}

/** Channel-level info used for subscribe CTAs and external links */
export interface VideoChannel {
  handle: string
  url: string
  title: string
  description: string
}

export interface VideoData {
  channel: VideoChannel
  videos: VideoItem[]
}
