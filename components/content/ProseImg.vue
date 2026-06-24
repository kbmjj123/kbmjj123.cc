<template>
  <picture>
    <!-- Desktop: 大图 -->
    <source v-if="hasMobile" :media="`(min-width: 860px)`" :srcSet="src" type="image/webp" />
    <!-- Mobile: 小图 -->
    <source v-if="hasMobile" :media="`(max-width: 859px)`" :srcSet="mobileSrc" type="image/webp" />
    <!-- Fallback -->
    <img :src="src" :alt="alt" :title="title" :width="width" :height="height" loading="lazy" />
  </picture>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
}>()

const isLocal = props.src.startsWith('/')
const isWebp = props.src.endsWith('.webp')

const mobileSrc = computed(() => {
  if (!isLocal || !isWebp) return ''
  return props.src.replace(/\.webp$/, '-m.webp')
})

const hasMobile = computed(() => isLocal && isWebp)
</script>
