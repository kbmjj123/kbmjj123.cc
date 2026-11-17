<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { socialProfiles, siteSocialLinks } from '~/data/social'

const extraScripts = import.meta.dev ? [] : [
  {
    src: 'https://umami.bulkpictools.com/script.js',
    'data-website-id': 'd18cf384-91fc-4da8-8cfe-e89096337c72',
    defer: true,
    type: 'text/javascript',
  },
  {
    src: '//gc.zgo.at/count.js',
    'data-goatcounter': 'https://kbmjj123.goatcounter.com/count',
    async: true,
    type: 'text/javascript',
  },
]
useHead({
  titleTemplate: '%s · kbmjj123.cc',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
		{ rel: 'me', href: siteSocialLinks.mastodon },
		{ rel: 'me', href: 'https://github.com/kbmjj123' },
		{ rel: 'me', href: 'https://x.com/solomaker282' },
  ],
  meta: [
    { name: 'theme-color', content: '#0b0b12' },
  ],
  script: extraScripts,
})

// YouTube profile only cited once there are actually videos to point at
const { count: videoCount } = useVideos()

// Global schema.org identity — Person for indie blog author
// Auto-linked to defineArticle() on post pages as author
useSchemaOrg([
  definePerson({
    name: 'kbmjj123',
    url: 'https://kbmjj123.cc/about',
    image: 'https://kbmjj123.cc/images/site/me.webp',
    sameAs: [
      ...socialProfiles.map(profile => profile.url),
      siteSocialLinks.mastodon,
      ...(videoCount.value > 0 ? [siteSocialLinks.youtube] : []),
    ],
  }),
])
</script>
