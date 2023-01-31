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
  <nav 
    data-tauri-drag-region 
    id="titlebar" 
    class="relative flex items-center h-8 text-xs select-none border-b dark:border-neutral-800"
    >
    <TransitionGroup data-tauri-drag-region name="buttons" tag="div" class="flex flex-1 h-full items-center justify-start">
      <div v-if="route.name == 'Settings'" key="control" class="h-full">
        <button aria-label="go back" class="window-control-btn" @click="router.back">
          <Back />
        </button>
      </div>
  
      <p data-tauri-drag-region key="title" class="pl-2">Mutual Finder - {{ route.name }}</p>
    </TransitionGroup>

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

<style scoped>
.buttons-leave-active, 
.buttons-enter-active,
.buttons-move {
  transition: all 350ms ease-in-out;
}

.buttons-leave-active {
  position: absolute;
}

.buttons-enter-from, .buttons-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

</style>
