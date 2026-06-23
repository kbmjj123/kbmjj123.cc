<template>
  <div style="display: flex; width: 100%; height: 100%; background: #0b0b12; font-family: 'Press Start 2P', monospace; position: relative; overflow: hidden;">
    <!-- Dot grid background -->
    <div style="position: absolute; inset: 0; background-image: radial-gradient(circle at 25px 25px, rgba(74,222,128,0.03) 1px, transparent 1px); background-size: 50px 50px;" />

    <!-- Top decorative bar -->
    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: repeating-linear-gradient(90deg, #4ade80 0px, #4ade80 8px, transparent 8px, transparent 16px);" />

    <!-- Border frame -->
    <div style="position: absolute; inset: 12px; border: 2px solid #2a2a42; pointer-events: none;" />

    <!-- Content -->
    <div style="display: flex; flex-direction: column; justify-content: center; padding: 60px 80px; position: relative; z-index: 1; width: 100%;">
      <!-- Site identifier -->
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <div style="width: 16px; height: 16px; background: #fbbf24; border: 2px solid #fbbf24; box-shadow: 0 0 0 2px #0b0b12;" />
        <span style="font-size: 18px; color: #4ade80; letter-spacing: 2px;">KB<span style="color: #fbbf24;">MJJ123</span><span style="color: #4d5a7a; font-size: 12px; margin-left: 4px;">.cc</span></span>
      </div>

      <!-- Separator -->
      <div style="width: 60px; height: 2px; background: #4ade80; margin-bottom: 28px; opacity: 0.5;" />

      <!-- Title -->
      <h1 style="font-family: 'Press Start 2P', monospace; font-size: 36px; color: #e8edf5; line-height: 1.3; letter-spacing: -0.5px; margin: 0 0 16px 0; overflow: hidden; max-width: 700px; max-height: 140px;">
        {{ title || 'kbmjj123.cc' }}
      </h1>

      <!-- Description -->
      <p v-if="description" style="font-family: Inter, sans-serif; font-size: 18px; color: #9aa8c9; line-height: 1.6; margin: 0; overflow: hidden; max-width: 600px; max-height: 58px;">
        {{ description }}
      </p>

      <!-- Bottom bar -->
      <div style="position: absolute; bottom: 24px; display: flex; align-items: center; gap: 16px;">
        <span style="font-family: 'Press Start 2P', monospace; font-size: 9px; color: #4d5a7a; letter-spacing: 1px;">✦ pixel · indie · craft ✦</span>
      </div>
    </div>

    <!-- Gold accent block bottom-right -->
    <div style="position: absolute; bottom: 20px; right: 20px; width: 20px; height: 20px; background: #fbbf24; border: 2px solid #fbbf24; box-shadow: 0 0 0 2px #0b0b12; opacity: 0.6;" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>
