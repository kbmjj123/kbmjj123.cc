<template>
	<div class="author-photo" :class="`size-${size}`">
		<img
			v-if="!failed"
			src="/images/site/me.webp"
			:alt="alt"
			width="320"
			height="320"
			loading="eager"
			decoding="async"
			@error="failed = true"
		/>
		<span v-else class="author-photo-fallback" role="img" :aria-label="alt">🧑‍💻</span>
	</div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	alt: string
	size?: 'lg' | 'sm'
}>(), {
	size: 'lg',
})

const failed = ref(false)
</script>

<style scoped>
.author-photo {
	position: relative;
	flex-shrink: 0;
	overflow: hidden;
	background: transparent;
	border: 1.5px solid var(--accent-green);
	border-radius: 50%;
	box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1), 0 0 18px rgba(74, 222, 128, 0.16);
}
.author-photo.size-lg { width: 120px; height: 120px; }
.author-photo.size-sm { width: 72px; height: 72px; }
.author-photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
.author-photo-fallback {
	display: flex; align-items: center; justify-content: center;
	width: 100%; height: 100%; font-size: 40px;
}
.author-photo.size-sm .author-photo-fallback { font-size: 26px; }
.author-photo::after {
	content: ''; position: absolute; left: 0; right: 0; height: 20%;
	pointer-events: none;
	background: linear-gradient(transparent, rgba(74, 222, 128, 0.06), transparent);
	animation: authorScan 4s linear infinite;
}
@keyframes authorScan { 0% { top: -20%; } 100% { top: 100%; } }
@media (prefers-reduced-motion: reduce) {
	.author-photo::after { animation: none; opacity: 0.4; top: 40%; }
}
</style>
