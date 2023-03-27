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
  <nav data-tauri-drag-region class="grid grid-cols-3 items-center text-xs window-btns">
    <button class="title-btn fill-black dark:fill-white" @click="router.back"
      :class="{ 'opacity-30 pointer-events-none': route.name != 'Settings' }">
      <Back />
    </button>

    <p data-tauri-drag-region class="text-center select-none">Mutual Finder - {{ route.name }}</p>

    <div data-tauri-drag-region class="flex justify-end">
      <button @click="appWindow.minimize" class="title-btn fill-black dark:fill-white">
        <Minimize />
      </button>

      <button @click="appWindow.toggleMaximize" class="title-btn stroke-black dark:stroke-white fill-black dark:fill-white">
        <UnMaximize v-if="isMaximized" />
        <Maximize v-else />
      </button>

      <button @click="appWindow.close" class="title-btn close fill-black dark:fill-white hover:fill-white">
        <Close />
      </button>
    </div>
  </nav>
</template>
