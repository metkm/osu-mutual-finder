<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Back from "./icons/Back.vue";
import Close from "./icons/Close.vue";
import Minimize from "./icons/Minimize.vue";
import Maximize from "./icons/Maximize.vue";
import UnMaximize from "./icons/UnMaximize.vue";

const route = useRoute();
const router = useRouter();
const isMaximized = ref(false);

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
  <nav data-tauri-drag-region id="titlebar" class="h-8 flex items-center justify-between select-none text-xs border-b dark:border-neutral-800">
    <div data-tauri-drag-region class="flex-1 h-full">
      <button aria-label="go back" class="window-control-btn" v-if="route.name == 'Settings'" @click="router.back">
        <Back />
      </button>
    </div>

    <!-- <p data-tauri-drag-region class="flex-1 truncate flex justify-center items-center drop-shadow">Mutual Finder - {{ currentRoute }}</p> -->

    <div data-tauri-drag-region class="h-full flex-1 flex items-center justify-end">
      <button aria-label="minimize window" class="window-control-btn" @click="appWindow.minimize">
        <Minimize />
      </button>

      <button aria-label="toggle maximize window" class="window-control-btn" @click="appWindow.toggleMaximize">
        <UnMaximize v-if="isMaximized" />
        <Maximize v-else />
      </button>

      <button aria-label="close window" class="window-control-btn hover:bg-[#e81123] group" @click="appWindow.close">
        <Close />
      </button>
    </div>
  </nav>
</template>
