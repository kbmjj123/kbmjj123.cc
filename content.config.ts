import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
    }),
  },
})
