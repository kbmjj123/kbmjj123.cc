export default defineNuxtConfig({
	modules: ['@nuxt/content', '@nuxtjs/seo'],

	routeRules: {
		'/': { prerender: true },            // 首页分页列表,构建时预渲染
		'/archive': { prerender: true },
		'/about': { prerender: true },
		'/projects': { prerender: true },

		'/api/comments/**': { ssr: true },   // 评论接口,读写都要现场处理
		'/auth/**': { ssr: true },           // GitHub OAuth 回调,必须现场处理 session/cookie
		'/dashboard/**': { ssr: true },      // 登录后台管理

		'/**': { prerender: true },          // 兜底:其余全部当文章详情页,预渲染
	},

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
		},
		prerender: {
			routes: ['/feed.xml'],
			crawlLinks: true,
			failOnError: false,
		},
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
		enabled: true,
		runtimeCacheStorage: true
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
		xsl: false,
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
