<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Back from "./Icons/Back.vue";
import Close from "./Icons/Close.vue";
import Minimize from "./Icons/Minimize.vue";
import Maximize from "./Icons/Maximize.vue";
import UnMaximize from "./Icons/UnMaximize.vue";

const route = useRoute();
const router = useRouter();
const isMaximized = ref(false);

onMounted(() => {
  setTimeout(() => appWindow.show(), 200)
});

appWindow.onResized(async () => {
  isMaximized.value = await appWindow.isMaximized();
});
</script>

<template>
  <nav data-tauri-drag-region id="titlebar" 
    class="h-8 grid grid-flow-col auto-cols-fr items-center border-b dark:border-neutral-800 select-none text-xs"
  >
    <button aria-label="go back" class="window-control-btn" :class="{ 'opacity-30 pointer-events-none': route.name != 'Settings' }" @click="router.back">
      <Back />
    </button>

    <p data-tauri-drag-region class="pl-2 text-center text-neutral-400">Mutual Finder - {{ route.name }}</p>

    <div data-tauri-drag-region class="h-full flex justify-end">
      <button aria-label="minimize window" class="window-control-btn" @click="appWindow.minimize">
        <Minimize />
      </button>

      <button aria-label="toggle maximize window" class="window-control-btn stroke-black dark:stroke-white" @click="appWindow.toggleMaximize">
        <UnMaximize v-if="isMaximized" />
        <Maximize v-else />
      </button>

      <button aria-label="close window" class="window-control-btn hover:bg-[#e81123] group" @click="appWindow.close">
        <Close />
      </button>
    </div>
  </nav>
</template>
