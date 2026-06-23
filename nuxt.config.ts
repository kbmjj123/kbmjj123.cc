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
            default: 'material-theme-palenight',
            dark: 'material-theme-palenight',
          },
          preload: ['javascript', 'typescript', 'css', 'html', 'json', 'bash', 'yaml', 'markdown', 'shell'],
        },
      },
    },
  },

  ogImage: {
    enabled: true,
    runtimeCacheStorage: false,
  },

  robots: {
    allow: ['/'],
    disallow: ['/admin/', '/api/'],
    sitemap: '/sitemap.xml',
  },

  sitemap: {
    autoLastmod: true,
    exclude: ['/admin/**'],
    zeroRuntime: true,
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
})
