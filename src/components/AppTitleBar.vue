<script setup lang="ts">
const minimize = () => window.titleBar.event("minimize");
const maximize = () => window.titleBar.event("maximize");
const close = () => window.titleBar.event("close");
</script>

<template>
  <div style="-webkit-app-region: drag" class="w-full h-5 bg-gray-800 flex-shrink-0 flex justify-end">
    <div class="h-full" @click="minimize">
      <svg style="-webkit-app-region: no-drag" class="hover:bg-gray-900 h-full w-6" viewBox="0 0 40 40" fill="none">
        <rect x="9" y="18" width="22" height="4" rx="2" fill="white"/>
      </svg>
    </div>

    <div class="h-full" @click="maximize">
      <svg style="-webkit-app-region: no-drag" class="hover:bg-gray-900 h-full w-6" fill="none" viewBox="0 0 40 40" >
        <rect x="10" y="10" width="20" height="20" rx="2" stroke="white" stroke-width="3"/>
      </svg>
    </div>

    <div class="h-full" @click="close">
      <svg style="-webkit-app-region: no-drag" class="hover:bg-red-500 h-full w-6" viewBox="0 0 40 40">
        <path d="M10 10L30 30" stroke="white" stroke-width="3" stroke-linecap="round"/>
        <path d="M30 10L10 30" stroke="white" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</template>
