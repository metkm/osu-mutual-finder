<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window";
import { onMounted } from "vue";

onMounted(() => {
  appWindow.show();
});
</script>

<template>
  <div data-tauri-drag-region style="-webkit-app-region: drag" class="w-full h-5 shadow-sm dark:bg-neutral-800 flex-shrink-0 flex justify-end">
    <div class="h-full" @click="appWindow.minimize">
      <svg class="hover:bg-neutral-200 dark:hover:bg-neutral-900 h-full w-7" viewBox="0 0 40 40" fill="none">
        <rect x="9" y="18" width="22" height="4" rx="2" class="fill-black dark:fill-white" /> 
      </svg>
    </div>

    <div class="h-full" @click="appWindow.toggleMaximize">
      <svg class="hover:bg-neutral-200 dark:hover:bg-neutral-900 h-full w-7" fill="none" viewBox="0 0 40 40" >
        <rect x="10" y="10" width="20" height="20" rx="2" class="dark:stroke-white stroke-black" stroke-width="3"/>
      </svg>
    </div>

    <div class="h-full" @click="appWindow.close">
      <svg class="hover:bg-red-500 h-full w-7 " viewBox="0 0 40 40">
        <path d="M10 10L30 30" class="dark:stroke-white stroke-black" stroke-width="3" stroke-linecap="round"/>
        <path d="M30 10L10 30" class="dark:stroke-white stroke-black" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</template>
