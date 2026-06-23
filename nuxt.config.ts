export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/seo'],

  site: {
    url: 'https://kbmjj123.cc',
    name: 'kbmjj123.cc',
    trailingSlash: false,
  },

  css: ['~/assets/css/main.css', '~/assets/css/markdown.css'],

  compatibilityDate: '2026-05-07',

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      nodeCompat: true,
    }
  },

  runtimeConfig: {
    apiBase: '',
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-light',
          },
          preload: ['javascript', 'typescript', 'css', 'html', 'json', 'bash', 'yaml', 'markdown', 'shell'],
        },
      },
    },
  },

  ogImage: {
    enabled: false,
  },

  robots: {
    disallow: ['/admin/', '/api/'],
    sitemap: '/sitemap.xml',
		groups: [
      {
        userAgent: '*',
        allow: '*',
      }
    ]
  },

  sitemap: {
    autoLastmod: true,
    exclude: ['/admin/**'],
		sources: ['/api/sitemap-posts']
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
})
