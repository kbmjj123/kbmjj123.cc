export interface ProjectLink {
	label: string
	url: string
}

export interface ProjectArt {
	glyph: string
	topLeft: string
	bottomRight: string
}

export interface ProjectShot {
	src: string
	srcMobile?: string
	alt: string
	width: number
	height: number
}

export interface Project {
	name: string
	desc: string
	tags: string[]
	links: ProjectLink[]
	status: 'live' | 'wip'
	featured?: boolean
	art?: ProjectArt
	shots?: ProjectShot[]
	/** Slug of the case-study page under /projects/. Absent = case study coming soon. */
	caseStudy?: string
}

const desktopShot = (slug: string, file: string, alt: string): ProjectShot => ({
	src: `/images/projects/${slug}/${file}.webp`,
	alt,
	width: 1280,
	height: 800,
})

export const projects: Project[] = [
	{
		name: '🖼️ BulkPicTools',
		desc: 'Bulk image processing in your browser. Compress, convert, crop, resize — all locally, no upload required, no privacy concerns. Chain multiple operations into a single pass.',
		tags: ['#Vue', '#PWA', '#WebAssembly', '#Canvas', '#PrivacyFirst'],
		links: [
			{ label: 'Website', url: 'https://bulkpictools.com' },
			{ label: 'GitHub', url: 'https://github.com/kbmjj123/BulkPicTools' },
		],
		status: 'live',
		featured: true,
		caseStudy: 'bulkpictools',
		art: { glyph: '🖼️', topLeft: 'IMG://LOCAL', bottomRight: '100% CLIENT-SIDE' },
		shots: [
			desktopShot('bulkpictools', '01', 'BulkPicTools landing page for local batch image processing'),
			desktopShot('bulkpictools', '02', 'BulkPicTools batch queue with multiple images'),
			desktopShot('bulkpictools', '03', 'BulkPicTools processing results and downloads'),
		],
	},
	{
		name: '🌉 BulkPicBridge',
		desc: 'Companion browser extension for BulkPicTools. Hover any image on the web and send it straight to bulkpictools.com for compression, resizing or watermarking — no saving and re-uploading. Works on Midjourney, Doubao, Unsplash and more.',
		tags: ['#ChromeExtension', '#MV3', '#WXT', '#Vue', '#BulkPicTools'],
		links: [
			{ label: 'Chrome Web Store', url: 'https://chromewebstore.google.com/detail/bulkpicbridge/hhkihajejdabchhejcaepccbifiheobc' },
			{ label: 'Website', url: 'https://bulkpictools.com' },
		],
		status: 'live',
		shots: [
			desktopShot('bulkpic-bridge', '01', 'BulkPicBridge hover button on an AI-generated image'),
		],
	},
	{
		name: '🔍 aifindr.org',
		desc: 'Open-source AI tool directory. 500+ tools across 12 categories, curated for makers. Submit a tool, get 3 free dofollow backlinks.',
		tags: ['#Nuxt', '#Cloudflare', '#D1', '#OpenSource'],
		links: [
			{ label: 'Website', url: 'https://aifindr.org' },
			{ label: 'GitHub', url: 'https://github.com/kbmjj123/aifindr.org' },
		],
		status: 'live',
		caseStudy: 'aifindr',
		shots: [
			desktopShot('aifindr-org', '01', 'aifindr.org AI tool directory categories'),
		],
	},
	{
		name: '📊 umami-serve',
		desc: 'Self-hosted Umami analytics fork — deploy your own analytics server for free. No tracking limits, full data ownership, Docker-ready.',
		tags: ['#Umami', '#Analytics', '#Docker', '#Fork'],
		links: [
			{ label: 'GitHub', url: 'https://github.com/kbmjj123/umami-serve' },
		],
		status: 'live',
		shots: [
			desktopShot('umami-serve', '01', 'umami-serve self-hosted analytics dashboard'),
		],
	},
	{
		name: '🧰 JSON Toolbox',
		desc: 'Free online JSON tools. Format, validate, convert (CSV/YAML/TS/XML), compare, minify, test JSONPath — all in your browser. Open source.',
		tags: ['#Vue', '#OpenSource', '#JSON', '#WebTools'],
		links: [
			{ label: 'Website', url: 'https://jsontoolbox.cc' },
			{ label: 'GitHub', url: 'https://github.com/kbmjj123/jsontoolbox.cc' },
		],
		status: 'live',
		caseStudy: 'json-toolbox',
		shots: [
			desktopShot('json-toolbox', '01', 'JSON Toolbox editor with tree and split view'),
		],
	},
	{
		name: '🧩 JSON Toolbox Extension',
		desc: 'Companion browser extension for jsontoolbox.cc. Auto-beautifies raw JSON pages into a searchable, editable tree and split editor — all locally, no account, no tracking. Chrome / Edge Manifest V3, built with WXT + Vue 3.',
		tags: ['#ChromeExtension', '#MV3', '#WXT', '#Vue', '#PrivacyFirst'],
		links: [
			{ label: 'Chrome Web Store', url: 'https://chromewebstore.google.com/detail/json-toolbox/iifmieidldhenocaekobhhinbhojlfoi' },
			{ label: 'Website', url: 'https://jsontoolbox.cc' },
			{ label: 'GitHub', url: 'https://github.com/kbmjj123/json-browser-plugins' },
		],
		status: 'live',
		shots: [
			desktopShot('json-toolbox-extension', '01', 'JSON Toolbox Extension auto-beautified JSON page overlay'),
			desktopShot('json-toolbox-extension', '02', 'JSON Toolbox Extension key and JSONPath search drawer'),
			desktopShot('json-toolbox-extension', '03', 'JSON Toolbox Extension table view for array roots'),
		],
	},
	{
		name: '▦ My9Tools',
		desc: 'Pick nine tools and sites you love, export a 1500×1500 shareable image, or publish it as an updatable public toolbox page. Nuxt 4 + Cloudflare D1/KV/R2, with a curated tool directory and an explore feed.',
		tags: ['#Nuxt', '#Cloudflare', '#D1', '#Canvas', '#Vue'],
		links: [
			{ label: 'Website', url: 'https://my9tools.app' },
			{ label: 'GitHub', url: 'https://github.com/kbmjj123/my9tools-app' },
		],
		status: 'live',
		shots: [
			desktopShot('my9tools', '01', 'My9Tools nine-tool board editor and preview'),
		],
	},
	{
		name: '📄 MinoPDF',
		desc: 'Simple PDF tools that keep your work flowing. Convert, merge, extract, compress, rotate and clean PDFs locally in your browser — no sign-up, no watermark, no daily limit, nothing uploaded. Compatible operations chain into one continuous pass.',
		tags: ['#Nuxt', '#WebAssembly', '#PDF', '#LocalFirst', '#BrowserTools'],
		links: [
			{ label: 'Website', url: 'https://minopdf.com' },
			{ label: 'GitHub', url: 'https://github.com/kbmjj123/minopdf' },
		],
		status: 'live',
		shots: [
			desktopShot('minopdf', '01', 'MinoPDF homepage with local PDF tool browser'),
		],
	},
	{
		name: '💻 kbmjj123.cc',
		desc: 'This very site — a pixel-styled indie dev log. Nuxt 4 + Cloudflare D1/R2/Pages, Nuxt Content v3. Full-text search, RSS, newsletter, dynamic OG images.',
		tags: ['#Nuxt', '#Cloudflare', '#Tailwind', '#D1', '#R2'],
		links: [
			{ label: 'GitHub', url: 'https://github.com/kbmjj123/kbmjj123.cc' },
		],
		status: 'wip',
		shots: [
			desktopShot('kbmjj123-cc', '01', 'kbmjj123.cc pixel-styled homepage'),
		],
	},
]
