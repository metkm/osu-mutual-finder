<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";

import { event } from "@tauri-apps/api";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { notify } from "./plugin/notification";

import TitleBar from "./components/AppTitleBar.vue";
const router = useRouter();

onMounted(async () => {
  const { shouldUpdate, manifest } = await checkUpdate();
  notify("Checking for updates..");

  if (shouldUpdate) {
    notify(`Update found. ${manifest?.version}`, {
      acceptText: "Update now",
      acceptCallback: async () => {
        await installUpdate();
        await relaunch();
      } 
    });
  }
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
