<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window";
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isMaximized = ref(false);

const currentRoute = computed(() => route.name);

onMounted(() => {
  setTimeout(() => {
    appWindow.show();
  }, 80);
});

appWindow.onResized(async () => {
  isMaximized.value = await appWindow.isMaximized();
});
</script>

<template>
  <nav data-tauri-drag-region id="titlebar" class="h-8 flex items-center justify-between select-none text-xs border dark:border-neutral-800">
    <div data-tauri-drag-region class="flex-1 h-full">
      <button aria-label="go back" class="window-control-btn" v-if="route.name == 'Settings'" @click="router.back">
        <svg viewBox="0 0 10 10" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.10938 5.00172L7.10177 0L7.96875 0.874793L3.80755 5.00172L7.96875 9.12864L7.09834 10L2.10938 5.00172Z"/>
        </svg>
      </button>
    </div>

    <p data-tauri-drag-region class="flex-1 truncate flex justify-center items-center">Mutual Finder - {{ currentRoute }}</p>

    <div data-tauri-drag-region class="h-full flex-1 flex items-center justify-end">
      <button aria-label="minimize window" class="window-control-btn" @click="appWindow.minimize">
        <svg x="0px" y="0px" viewBox="0 0 10.2 1">
          <rect x="0" y="50%" width="10.2" height="1" />
        </svg>
      </button>

      <button aria-label="toggle maximize window" class="window-control-btn" @click="appWindow.toggleMaximize">
        <svg viewBox="0 0 10 10" v-if="!isMaximized">
          <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" />
        </svg>

        <svg viewBox="0 0 10.2 10.1" v-else>
          <path d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z" />
        </svg>
      </button>

      <button aria-label="close window" class="window-control-btn hover:bg-[#e81123] group" @click="appWindow.close">
        <svg viewBox="0 0 10 10">
          <polygon class="group-hover:fill-white"
            points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" />
        </svg>
      </button>
    </div>
  </nav>
</template>
