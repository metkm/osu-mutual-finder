<script setup lang="ts">
import { useAuthStore, useSettingsStore } from "./store";
import { onMounted } from "vue";

import { event } from "@tauri-apps/api";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { notify, notifyRemove } from "./plugin/notification";

import TitleBar from "./components/AppTitleBar.vue";
import DevRouter from "./components/DevRouter.vue";
import axios from "axios";

const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const ISDEV = import.meta.env.DEV;
axios.defaults.baseURL = ISDEV ? "http://localhost:3001" : "https://sibylku.xyz";
axios.defaults.withCredentials = true;

onMounted(() => {
  let params = new URLSearchParams(window.location.search);
  let access_token = params.get("access_token");
  let refresh_token = params.get("refresh_token");

  if (access_token && refresh_token) {
    // should keep it in the state. Also can get user profiles with these tokens to reduce normal http calls.
    authStore.access_token = access_token;
    authStore.refresh_token = refresh_token;
    settingsStore.uploaded = true;
  }

  // this is because of changes made. should remove countries if they are not object. Older versions were just country codes in an array
  settingsStore.countries.forEach((country, index) => {
    if (typeof country === "object") return;
    settingsStore.countries.splice(index, 1);
  })
});

onMounted(async () => {
  const { shouldUpdate, manifest } = await checkUpdate();

  if (shouldUpdate) {
    let updateText = `Update available. v${manifest?.version}`;

    notify(updateText, {
      acceptText: "Update now",
      acceptCallback: async () => {
        notifyRemove(updateText);

        await installUpdate();
        await relaunch();
      }
    });
  }

  if (settingsStore.uploaded) {
    // refresh token 

    try {
      const response = await axios.patch<{ access_token: string, refresh_token: string }>("/api/refresh")

      authStore.access_token = response.data.access_token;
      authStore.refresh_token = response.data.refresh_token;
    } catch (err) {
      if (!axios.isAxiosError(err)) return;

      authStore.access_token = "";
      authStore.refresh_token = "";
      settingsStore.uploaded = false;
    }
  }

  notify("Would you like to upload your friend list to database?", {
    acceptText: "Yes!",
    description: "This helps you find mutuals quickly by checking saved mutuals in Mutual Finder's database (Recommended)",
    acceptCallback: () => {
      let url = import.meta.env.DEV ? "http://localhost:3001/api/login" : "https://sibylku.xyz/api/login";

      window.location.href = url;
    },
    delay: 15000,
  });
});

event.listen("tauri://update-status", (res) => {
  console.log(res);
});
</script>

<template>
  <TitleBar />
  <!-- <DevRouter v-if="ISDEV" /> -->

  <div class="flex-1 overflow-hidden">
    <suspense>
      <template #default>
        <router-view v-slot="{ Component, route }">
          <main class="h-full w-full" :aria-label="route.name?.toString()">
            <KeepAlive>
              <component 
                :is="Component" 
                :key="route.meta.usePathKey ? route.path : undefined" 
              />
            </KeepAlive>
          </main>
        </router-view>
      </template>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </suspense>
  </div>

  <Notification />
</template>
