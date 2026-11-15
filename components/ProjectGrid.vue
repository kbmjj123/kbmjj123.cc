<template>
	<div class="pgrid">
		<div
			v-if="featured"
			class="pfeatured"
			itemscope
			itemtype="https://schema.org/SoftwareApplication"
		>
			<meta itemprop="applicationCategory" content="DeveloperApplication" />
			<meta v-if="featured.shots?.length" itemprop="screenshot" :content="absoluteShot(featured.shots[0].src)" />
			<div class="pf-body">
				<div class="pf-label">★ FEATURED · FLAGSHIP PRODUCT</div>
				<h3 class="name" itemprop="name">{{ featured.name }}</h3>
				<p class="desc" itemprop="description">{{ featured.desc }}</p>
				<div class="tagrow">
					<span v-for="tag in featured.tags" :key="tag" itemprop="keywords">{{ tag }}</span>
				</div>
				<div class="linkrow">
					<a v-for="link in featured.links" :key="link.label" :href="link.url" itemprop="url" target="_blank" rel="noopener noreferrer">{{ link.label }} ↗</a>
				</div>
			</div>
			<div class="pf-visual">
				<ProjectMedia :shots="featured.shots ?? []" :project-name="featured.name" eager @open="openGallery" />
			</div>
		</div>

		<div
			v-for="(project, i) in restProjects"
			:key="project.name"
			class="pcard"
			:class="`delay-${i}`"
			itemscope
			itemtype="https://schema.org/SoftwareApplication"
		>
			<meta itemprop="applicationCategory" content="DeveloperApplication" />
			<meta v-if="project.shots?.length" itemprop="screenshot" :content="absoluteShot(project.shots[0].src)" />
			<div class="pcard-top">
				<span class="idx">#{{ String(i + 2).padStart(2, '0') }}</span>
				<span class="status" :class="project.status">
					{{ project.status === 'live' ? '● LIVE' : '◆ WIP' }}
				</span>
			</div>
			<div class="pcard-media">
				<ProjectMedia :shots="project.shots ?? []" :project-name="project.name" @open="openGallery" />
			</div>
			<h3 class="name" itemprop="name">{{ project.name }}</h3>
			<p class="desc" itemprop="description">{{ project.desc }}</p>
			<div class="tagrow">
				<span v-for="tag in project.tags" :key="tag" itemprop="keywords">{{ tag }}</span>
			</div>
			<div class="linkrow">
				<a v-for="link in project.links" :key="link.label" :href="link.url" itemprop="url" target="_blank" rel="noopener noreferrer">{{ link.label }} ↗</a>
			</div>
		</div>
	</div>

	<ClientOnly>
		<Preview
			v-if="activeGallery"
			:files="activeGallery.files"
			:start-index="activeGallery.startIndex"
			@close="activeGallery = null"
		/>
	</ClientOnly>
</template>

<script setup lang="ts">
import type { PreviewImage } from '~/composables/useImagePreview'
import { projects } from '~/data/projects'

const SITE_ORIGIN = 'https://kbmjj123.cc'
const absoluteShot = (src: string) => `${SITE_ORIGIN}${src}`

const featured = computed(() => projects.find(p => p.featured))
const restProjects = computed(() => projects.filter(p => !p.featured))

const activeGallery = ref<{ files: PreviewImage[]; startIndex: number } | null>(null)

function openGallery(payload: { files: PreviewImage[]; startIndex: number }) {
	activeGallery.value = payload
}
</script>

<style scoped>
.pgrid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 480px), 1fr));
	gap: 20px;
}

.pfeatured {
	grid-column: 1 / -1;
	display: grid; grid-template-columns: 1.3fr 0.8fr;
	background: var(--bg-deep);
	border: 1.5px solid var(--accent-green);
	position: relative; overflow: hidden;
	opacity: 0; transform: translateY(20px);
	animation: pixelFadeUp 0.5s ease forwards;
	transition: box-shadow 0.2s ease;
}
.pfeatured:hover { box-shadow: 0 8px 26px rgba(74,222,128,0.08); }
.pf-body { padding: 26px 28px; }
.pf-label { font-family: var(--font-pixel); font-size: 8px; color: var(--accent-gold); letter-spacing: 1px; margin-bottom: 16px; }
.pfeatured .name { font-family: var(--font-pixel); font-size: 16px; color: var(--text-primary); margin-bottom: 14px; font-weight: 400; line-height: 1.6; }
.pfeatured .desc { font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 18px; }
.pf-visual {
	border-left: 1.5px solid var(--border-pixel);
	background-color: var(--bg-deep);
	background-image:
		linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
		linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px);
	background-size: 22px 22px;
	display: flex; align-items: flex-start; min-width: 0;
}
.pf-visual :deep(.pm) { width: 100%; }

.pcard {
	background: var(--bg-deep);
	border: 1.5px solid var(--border-pixel);
	padding: 20px 20px 22px;
	position: relative;
	display: flex; flex-direction: column;
	min-width: 0;
	transition: all 0.2s ease;
	opacity: 0; transform: translateY(20px);
	animation: pixelFadeUp 0.5s ease forwards;
}
.delay-0 { animation-delay: 0.12s; }
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.28s; }
.delay-3 { animation-delay: 0.36s; }
.delay-4 { animation-delay: 0.44s; }
.delay-5 { animation-delay: 0.52s; }
.delay-6 { animation-delay: 0.6s; }
.pcard:hover { border-color: var(--accent-green); transform: translateY(-3px); box-shadow: 0 8px 22px rgba(74,222,128,0.06); }

.pcard-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; }
.pcard .idx {
	font-family: var(--font-pixel); font-size: 8px; color: var(--text-muted);
	background: var(--bg-card); border: 1px solid var(--border-pixel);
	padding: 3px 9px;
}
.pcard .status {
	font-family: var(--font-pixel); font-size: 7px; padding: 3px 8px;
	border: 1px solid; letter-spacing: 0.5px;
}
.pcard .status.live { color: var(--accent-green); border-color: var(--accent-green); background: rgba(74,222,128,0.06); }
.pcard .status.wip { color: var(--accent-gold); border-color: var(--accent-gold); background: rgba(251,191,36,0.06); }

.pcard-media { border: 1px solid var(--border-pixel); margin-bottom: 16px; min-width: 0; }
.pcard .name { font-family: var(--font-pixel); font-size: 12px; color: var(--text-primary); margin-bottom: 12px; font-weight: 400; line-height: 1.7; }
.pcard .desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 14px; flex: 1; }
.tagrow { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
.tagrow span { font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border-pixel); padding: 3px 8px; }
.linkrow { display: flex; gap: 8px; flex-wrap: wrap; }
.linkrow a { font-family: var(--font-pixel); font-size: 8px; color: var(--accent-green); border: 1px solid var(--accent-green); padding: 5px 12px; text-decoration: none; transition: all 0.15s; }
.linkrow a:hover { background: var(--accent-green); color: var(--bg-deep); }

@media (max-width: 860px) {
	.pfeatured { grid-template-columns: 1fr; }
	.pf-visual { border-left: none; border-top: 1.5px solid var(--border-pixel); }
	.linkrow a { min-height: 44px; display: inline-flex; align-items: center; }
}
@media (max-width: 480px) {
	.pf-body { padding: 18px 16px 20px; }
	.pfeatured .name { font-size: 13px; }
	.pfeatured .desc { font-size: 14px; }
	.pcard { padding: 16px 14px 18px; }
}
@media (prefers-reduced-motion: reduce) {
	.pfeatured, .pcard { animation: none; opacity: 1; transform: none; }
}
</style>
