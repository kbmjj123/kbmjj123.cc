<template>
	<div
		class="pm"
		role="region"
		aria-roledescription="carousel"
		:aria-label="`Screenshots of ${projectName}`"
		@keydown="onKeydown"
	>
		<div v-if="!hasShots" class="pm-placeholder" aria-hidden="true">
			<span class="pm-glyph">{{ glyph }}</span>
			<span class="pm-corner tl">PREVIEW // PENDING</span>
			<span class="pm-corner br">{{ projectName }}</span>
			<span class="pm-scan"></span>
		</div>

		<div v-else class="pm-viewport">
			<div ref="track" class="pm-track" @scroll.passive="onScroll">
				<div
					v-for="(shot, i) in availableShots"
					:key="shot.src"
					class="pm-slide"
					role="group"
					aria-roledescription="slide"
					:aria-label="`${i + 1} of ${availableShots.length}`"
				>
					<button
						class="pm-trigger"
						type="button"
						:aria-label="`Open ${shot.alt} in full size`"
						@click="openAt(i)"
					>
						<picture>
							<source
								v-if="shot.srcMobile"
								:srcset="shot.srcMobile"
								media="(max-width: 859px)"
								type="image/webp"
							/>
							<img
								:src="shot.src"
								:alt="shot.alt"
								:width="shot.width"
								:height="shot.height"
								:loading="eager && i === 0 ? 'eager' : 'lazy'"
								:fetchpriority="eager && i === 0 ? 'high' : undefined"
								decoding="async"
								@error="onImageError(shot.src)"
							/>
						</picture>
					</button>
				</div>
			</div>

			<template v-if="isCarousel">
				<button class="pm-arrow prev" type="button" aria-label="Previous screenshot" @click="goTo(active - 1)">‹</button>
				<button class="pm-arrow next" type="button" aria-label="Next screenshot" @click="goTo(active + 1)">›</button>
				<div class="pm-bar">
					<span class="pm-counter" aria-live="polite">{{ active + 1 }} / {{ availableShots.length }}</span>
					<div class="pm-dots">
						<button
							v-for="(shot, i) in availableShots"
							:key="`dot-${shot.src}`"
							class="pm-dot"
							:class="{ active: active === i }"
							type="button"
							:aria-label="`Go to screenshot ${i + 1}`"
							:aria-current="active === i ? 'true' : undefined"
							@click="goTo(i)"
						></button>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PreviewImage } from '~/composables/useImagePreview'
import type { ProjectShot } from '~/data/projects'

const props = withDefaults(defineProps<{
	shots: ProjectShot[]
	projectName: string
	eager?: boolean
}>(), {
	eager: false,
})

const emit = defineEmits<{
	open: [payload: { files: PreviewImage[]; startIndex: number }]
}>()

const failed = ref<string[]>([])
const track = ref<HTMLElement | null>(null)
const active = ref(0)
const reduceMotion = ref(false)

const glyph = computed(() => props.projectName.split(' ')[0] || '▦')
const availableShots = computed(() => props.shots.filter(shot => !failed.value.includes(shot.src)))
const hasShots = computed(() => availableShots.value.length > 0)
const isCarousel = computed(() => availableShots.value.length > 1)

onMounted(() => {
	reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function onImageError(src: string) {
	if (!failed.value.includes(src)) failed.value = [...failed.value, src]
}

function openAt(index: number) {
	const shot = availableShots.value[index]
	if (!shot) return
	const files: PreviewImage[] = availableShots.value.map(item => ({
		url: item.src,
		width: item.width,
		height: item.height,
		alt: item.alt,
	}))
	emit('open', { files, startIndex: index })
}

function goTo(index: number) {
	const clamped = Math.max(0, Math.min(index, availableShots.value.length - 1))
	active.value = clamped
	const el = track.value
	if (!el) return
	el.scrollTo({
		left: el.clientWidth * clamped,
		behavior: reduceMotion.value ? 'auto' : 'smooth',
	})
}

function onScroll() {
	const el = track.value
	if (!el || el.clientWidth === 0) return
	active.value = Math.max(0, Math.min(
		Math.round(el.scrollLeft / el.clientWidth),
		availableShots.value.length - 1,
	))
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === 'ArrowLeft') {
		event.preventDefault()
		goTo(active.value - 1)
	}
	else if (event.key === 'ArrowRight') {
		event.preventDefault()
		goTo(active.value + 1)
	}
}
</script>

<style scoped>
.pm {
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 10;
	background: var(--bg-deep);
	overflow: hidden;
}
.pm-viewport { position: relative; width: 100%; height: 100%; }
.pm-track {
	display: flex;
	width: 100%;
	height: 100%;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	scrollbar-width: none;
	-ms-overflow-style: none;
}
.pm-track::-webkit-scrollbar { display: none; }
.pm-slide { flex: 0 0 100%; width: 100%; height: 100%; scroll-snap-align: start; }
.pm-trigger {
	display: block; width: 100%; height: 100%; padding: 0; border: 0;
	background: none; cursor: zoom-in;
}
.pm-trigger picture, .pm-trigger img { display: block; width: 100%; height: 100%; }
.pm-trigger img { object-fit: cover; object-position: top; }

.pm-arrow {
	position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
	width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
	font-family: var(--font-ui); font-size: 22px; line-height: 1;
	color: var(--accent-green); background: rgba(11, 11, 18, 0.78);
	border: 1.5px solid var(--border-pixel); cursor: pointer;
	transition: all 0.15s;
}
.pm-arrow:hover { border-color: var(--accent-green); background: var(--bg-deep); }
.pm-arrow.prev { left: 8px; }
.pm-arrow.next { right: 8px; }

.pm-bar {
	position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
	display: flex; align-items: center; justify-content: space-between; gap: 8px;
	padding: 0 10px 4px; pointer-events: none;
	background: linear-gradient(transparent, rgba(11, 11, 18, 0.85));
}
.pm-counter { font-family: var(--font-pixel); font-size: 8px; color: var(--accent-gold); }
.pm-dots { display: flex; gap: 2px; pointer-events: auto; }
.pm-dot {
	width: 44px; height: 44px; display: grid; place-items: center;
	background: none; border: 0; cursor: pointer;
}
.pm-dot::after {
	content: ''; width: 8px; height: 8px;
	background: var(--text-muted); border: 1px solid var(--border-pixel);
	transition: all 0.15s;
}
.pm-dot.active::after { background: var(--accent-green); border-color: var(--accent-green); }

.pm-placeholder {
	position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
	background-color: var(--bg-deep);
	background-image:
		linear-gradient(rgba(74, 222, 128, 0.04) 1px, transparent 1px),
		linear-gradient(90deg, rgba(74, 222, 128, 0.04) 1px, transparent 1px);
	background-size: 22px 22px;
}
.pm-glyph { font-size: 48px; filter: drop-shadow(0 0 18px rgba(74, 222, 128, 0.35)); }
.pm-corner { position: absolute; font-family: var(--font-pixel); font-size: 7px; color: var(--text-muted); }
.pm-corner.tl { top: 12px; left: 14px; }
.pm-corner.br { bottom: 12px; right: 14px; color: var(--accent-green); }
.pm-scan {
	position: absolute; left: 0; right: 0; height: 2px;
	background: var(--accent-green); opacity: 0.35;
	animation: pmScan 4s linear infinite;
}
@keyframes pmScan { 0% { top: 0; } 100% { top: 100%; } }

.pm :focus-visible { outline: 2px solid var(--accent-gold); outline-offset: -2px; }

@media (prefers-reduced-motion: reduce) {
	.pm-track { scroll-behavior: auto; }
	.pm-scan { animation: none; }
}
@media (max-width: 480px) {
	.pm-bar { padding: 0 4px 2px; }
	.pm-glyph { font-size: 36px; }
	.pm-corner { font-size: 6px; }
}
</style>
