<script setup lang="ts">
import { useStore } from "./store";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

import { event } from "@tauri-apps/api";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { notify, notifyRemove } from "./plugin/notification";

import TitleBar from "./components/AppTitleBar.vue";
const router = useRouter();
const store = useStore();

onMounted(async () => {
  const { shouldUpdate, manifest } = await checkUpdate();
  const updateText = shouldUpdate ? `Update Available. v${manifest?.version}` : "No update available";
  notify("Checking for updates..");

  if (shouldUpdate) {
    notify(updateText, {
      acceptText: "Update now",
      acceptCallback: async () => {
        notifyRemove(updateText);
        await installUpdate();
        await relaunch();
      },
      delay: 10000
    });
  } else {
    notify(updateText)
  }

  if (store.state.uploaded) return;

  notify("Would you like to upload your friend list to database?", {
    acceptText: "Yes!",
    acceptCallback: () => {
      let url = import.meta.env.DEV ? "http://localhost:3001/api/login" : "https://sibylku.xyz/api/login";

      store.dispatch("toggleUploaded");
      window.location.href = url;
    },
    delay: 15000
  });
})

event.listen("tauri://update-status", (res) => {
  console.log(res);
});

if (import.meta.env.DEV) {
  router.push({ path: "/settings" });
} else {
  router.push({ path: "/" });
}
</script>

<template>
  <TitleBar />
  <div class="relative flex-1 overflow-hidden">
    <suspense>
      <template #default>
        <router-view v-slot="{ Component, route }">
          <keep-alive>
            <component 
              :is="Component" 
              :key="route.meta.usePathKey ? route.path : undefined" 
            />
          </keep-alive>
        </router-view>
      </template>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </suspense>

    <Notification />
  </div>
</template>
